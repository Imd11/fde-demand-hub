# FDE 需求台

一个最简的内部需求收集前端。页面基于 OpenAI Sites + shadcn/ui 搭建，并参考 DevOrder 的克制视觉语言重新组合为单页工作流；没有复制 CSDN 品牌、Logo 或文案。

## 本地运行

```bash
npm install
npm run dev
```

## 当前行为

- 校验必填字段。
- 生成前端演示编号 `REQ-YYYYMMDD-XXXX`。
- 暂存最近 20 条演示数据到浏览器 `localStorage` 的 `fde-requirement-demo`。
- 不会把信息发送到服务器；成功页已明确提示这是前端演示。

## 后端接入约定

把 `RequirementForm.tsx` 中的本地暂存逻辑替换为：

```http
POST /api/requirements
Content-Type: application/json
```

请求体：

```json
{
  "title": "官网新增线索收集表单",
  "type": "网站与产品",
  "priority": "普通",
  "description": "使用场景、目标用户、问题与期待结果",
  "expectedDate": "2026-09-15",
  "budget": "5000-20000 元",
  "requester": "张三",
  "contact": "飞书 / 手机 / 邮箱"
}
```

建议成功响应：

```json
{
  "id": "REQ-20260902-AB12",
  "status": "submitted",
  "createdAt": "2026-09-02T10:00:00+08:00"
}
```

前端源文件：

- `app/page.tsx`：页面布局和流程说明。
- `components/sites/devorder-csdn-net-e00368e5/root-8a5edab2/RequirementForm.tsx`：字段、校验与提交逻辑。
- `app/globals.css`：视觉令牌。
