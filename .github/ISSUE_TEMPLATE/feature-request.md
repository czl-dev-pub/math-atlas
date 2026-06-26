name: 💡 功能建议
description: 建议新增交互、功能或可视化改进
title: "[功能] "
labels: ["功能建议"]
body:
  - type: textarea
    id: problem
    attributes:
      label: 你想解决什么问题
      description: 在什么场景下，你希望项目能做什么它现在做不到的事？
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: 你期望的方案
      description: 具体希望怎么改进？（功能建议默认需要评估工作量与适用性，未必立刻采纳。）
    validations:
      required: true
  - type: dropdown
    id: scope
    attributes:
      label: 涉及范围
      options:
        - 交互 / 操作
        - 可视化 / 显示
        - 内容结构
        - 数据 / 进度
        - 其他
    validations:
      required: false
  - type: textarea
    id: alternatives
    attributes:
      label: 你考虑过的替代方案（可选）
