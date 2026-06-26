name: 🐛 知识点 / 事实纠错
description: 定义、教材、前置依赖、MSC 编码等有事实错误
title: "[纠错] "
labels: ["内容纠错", "待核对"]
body:
  - type: markdown
    attributes:
      value: |
        感谢纠错！**事实性改动必须附可核对的来源链接**，否则无法采纳。
        请尽量填全下面的字段，越具体我们核对越快。
  - type: input
    id: node
    attributes:
      label: 涉及的节点
      description: 哪个节点？（点开节点详情面板，标题下的英文名，如 calculus2 / measure / linalg）
      placeholder: "例如：measure"
    validations:
      required: true
  - type: input
    id: field
    attributes:
      label: 涉及的字段
      description: 哪一项有问题？（定义 def / 推荐资源 res / 前置 prereq / MSC 编码 / 知识点 items）
      placeholder: "例如：推荐资源 res"
    validations:
      required: true
  - type: textarea
    id: current
    attributes:
      label: 当前内容（错的）
      description: 现在项目里写的是什么？原样贴过来。
    validations:
      required: true
  - type: textarea
    id: correct
    attributes:
      label: 应该改为
      description: 正确的内容是什么？
    validations:
      required: true
  - type: textarea
    id: source
    attributes:
      label: 来源依据（必填）
      description: |
        可核对的来源链接或出处。**没有来源的纠错无法采纳。**
        优先级：出版社官网 / 官方课标 / 维基百科 / 豆瓣读书 > 个人博客。
        例：书名作者可贴豆瓣读书链接；定义可贴维基链接；教材版次贴出版社页面。
      placeholder: |
        例：
        - 豆瓣：https://book.douban.com/subject/xxx
        - 维基：https://zh.wikipedia.org/wiki/xxx
    validations:
      required: true
  - type: textarea
    id: notes
    attributes:
      label: 补充说明（可选）
