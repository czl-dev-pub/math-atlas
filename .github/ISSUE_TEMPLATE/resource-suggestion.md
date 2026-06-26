name: 📚 教材 / 资源推荐
description: 推荐某节点更好的教材、视频或补充学习资源
title: "[资源] "
labels: ["资源推荐"]
body:
  - type: input
    id: node
    attributes:
      label: 适合哪个节点
      placeholder: "例如：realanalysis / fourier"
    validations:
      required: true
  - type: textarea
    id: resource
    attributes:
      label: 推荐的资源
      description: 请注明书名、作者、出版社、版次（视频请注明讲师与平台）。
      placeholder: |
        例：盖尔范德《广义函数》卷一，科学出版社中译本
        或：3Blue1Brown《线性代数的本质》系列
    validations:
      required: true
  - type: input
    id: isbn
    attributes:
      label: ISBN 或来源链接（如有）
      description: 便于我们核对真实性。豆瓣 / 出版社页面 / 课程官网均可。
      placeholder: "https://book.douban.com/subject/xxx  或  ISBN 9787030809605"
  - type: textarea
    id: reason
    attributes:
      label: 推荐理由（可选）
      description: 为什么觉得它比现有的更好？适合什么读者？
