name: 🎯 体验问题
description: 操作不顺手、看不懂、显示异常等使用体验问题
title: "[体验] "
labels: ["体验问题"]
body:
  - type: textarea
    id: what-happened
    attributes:
      label: 遇到了什么问题
      description: 你在做什么、期望发生什么、实际发生了什么。
    validations:
      required: true
  - type: input
    id: browser
    attributes:
      label: 浏览器
      placeholder: "例如：Chrome 120 / Edge 120 / Firefox"
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: 复现步骤
      description: 别人怎样按你的步骤重现这个问题？
      placeholder: |
        1. 打开 math-atlas.html
        2. 点击 xxx 节点
        3. ...
    validations:
      required: true
  - type: textarea
    id: screenshot
    attributes:
      label: 截图（可选）
      description: 拖入图片即可。显示异常强烈建议附截图。
