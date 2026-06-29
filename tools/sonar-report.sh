#!/bin/sh
# 把 SonarQube Quality Gate 结果作为 note 贴回 GitLab（push→commit note；MR→MR note）
# 让推送者/评审者无需翻 job 日志或 dashboard，直接在 GitLab 页面看到不达标原因。
# 用法（在 .gitlab-ci.yml 的 sonarqube-check job 末尾调用）：
#   sh tools/sonar-report.sh
# 依赖环境变量：CI_API_V4_URL, CI_PROJECT_ID, CI_COMMIT_SHA, CI_MERGE_REQUEST_IID,
#               SONAR_HOST_URL, SONAR_TOKEN, SONAR_PROJECT_KEY, GITLAB_WRITE_TOKEN
# 行为：仅报告，不阻断（即使 Quality Gate 失败也以 0 退出）。
set -u

NOTE_BODY=""
SUCCESS_MSG="✅ SonarQube Quality Gate 通过。"

# SONAR_PROJECT_KEY 缺失时用默认值（项目名），不因此跳过反馈
: "${SONAR_PROJECT_KEY:=${CI_PROJECT_NAME:-math-atlas}}"

if [ -z "${SONAR_HOST_URL:-}" ] || [ -z "${SONAR_TOKEN:-}" ]; then
  echo "[sonar-report] 缺少 SONAR_HOST_URL 或 SONAR_TOKEN，跳过反馈。"
  exit 0
fi

# 1. 查 Quality Gate 状态
CE_TASK_URL="${SONAR_HOST_URL}/api/ce/task?component=${SONAR_PROJECT_KEY}"
# 用 analysisId 取 quality gate 详情比较稳，但社区版可直接用 qualitygates/project_status
QG_URL="${SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${SONAR_PROJECT_KEY}"
echo "[sonar-report] 查询 Quality Gate: ${QG_URL}"
QG_JSON=$(curl -s -u "${SONAR_TOKEN}:" "${QG_URL}" 2>/dev/null || true)
QG_STATUS=$(echo "${QG_JSON}" | sed -n 's/.*"projectStatus"[ ]*:[ ]*{[^}]*"status"[ ]*:[ ]*"\([A-Z_]*\)".*/\1/p' | head -1)

if [ -z "${QG_STATUS}" ]; then
  echo "[sonar-report] 未能解析 Quality Gate 状态，跳过。原始响应: ${QG_JSON}"
  exit 0
fi
echo "[sonar-report] Quality Gate 状态: ${QG_STATUS}"

# 2. 构造 note 内容
if [ "${QG_STATUS}" = "OK" ]; then
  NOTE_BODY="${SUCCESS_MSG}"
else
  # 解析不达标的条件（FAILED 项）
  FAILED_CONDITIONS=$(echo "${QG_JSON}" | sed -n 's/.*"conditions"\([[][^]]*[]]\).*/\1/p')
  # 简单提取每个 condition 的 metricKey 和 status
  REASONS=$(echo "${QG_JSON}" | sed -n 's/.*"conditions"\([[][^]]*[]]\).*/\1/p' | \
    sed 's/}/}\n/g' | \
    sed -n 's/.*"metricKey"[ ]*:[ ]*"\([^"]*\)"[^}]*"status"[ ]*:[ ]*"\([A-Z_]*\)".*/- \1: \2/p' | \
    grep -i FAILED || true)
  NOTE_BODY="❌ SonarQube Quality Gate 未通过（${QG_STATUS}）。

新代码质量门禁未达标项：
${REASONS:-（未能解析具体项，请查看 dashboard）}

详见：${SONAR_HOST_URL}/dashboard?id=${SONAR_PROJECT_KEY}"
fi

echo "[sonar-report] note 内容:
${NOTE_BODY}"

# 3. 写回 GitLab（push→commit comment；有 MR→MR note）
if [ -z "${GITLAB_WRITE_TOKEN:-}" ]; then
  echo "[sonar-report] 未配置 GITLAB_WRITE_TOKEN，无法写回 GitLab。note 仅打印在 job 日志。"
  exit 0
fi

# 把 NOTE_BODY 转成合法 JSON 字符串值
NOTE_JSON=$(printf '%s' "${NOTE_BODY}" | python3 -c 'import json,sys;print(json.dumps(sys.stdin.read()))' 2>/dev/null)
if [ -z "${NOTE_JSON}" ]; then
  # python3 不可用时的兜底：简单转义双引号和反斜杠
  ESC=$(printf '%s' "${NOTE_BODY}" | sed 's/\\/\\\\/g; s/"/\\"/g')
  NOTE_JSON="\"${ESC}\""
fi

if [ -n "${CI_MERGE_REQUEST_IID:-}" ]; then
  # MR note：字段名是 body
  API="${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes"
  PAYLOAD=$(printf '{"body":%s}' "${NOTE_JSON}")
else
  # commit comment：字段名是 note（注意：不是 body！）
  API="${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/repository/commits/${CI_COMMIT_SHA}/comments"
  PAYLOAD=$(printf '{"note":%s}' "${NOTE_JSON}")
fi
echo "[sonar-report] 写回: ${API}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --request POST --header "PRIVATE-TOKEN: ${GITLAB_WRITE_TOKEN}" \
  --header "Content-Type: application/json" --data "${PAYLOAD}" "${API}" 2>/dev/null || echo "000")
echo "[sonar-report] GitLab API 返回: ${HTTP_CODE}"

# 仅报告，不阻断
exit 0
