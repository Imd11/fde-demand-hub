# 产业园 FDE 总站

面向企业咨询者的中文单页，由 CSDN 与序动科技双品牌页头、服务介绍、问题输入框和联系方式组成。问题、姓名与手机或邮箱必填。咨询免费。

## 本地运行

```bash
npm install
npm run dev
```

## 当前交互

- 校验问题、姓名和联系方式。
- 当前是前端交互预览：点击咨询后，草稿保存到本机 localStorage 的 fde-consultation-draft，不发送给服务团队。
- 页面明确反馈本地暂存状态，不模拟后台接单或 AI 回答。
- 正式上线前需接入真实收件接口及数据使用说明。

## 文件

- app/page.tsx：单页结构。
- app/globals.css：桌面与手机布局。
- components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/RequirementForm.tsx：问题、姓名、联系方式和预览交互。
- public/brand/README.md：真实 Logo 来源。
