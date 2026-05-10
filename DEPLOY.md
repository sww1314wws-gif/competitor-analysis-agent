# AI驱动的竞品分析Agent协作系统

一个基于多Agent协作的智能竞品分析平台，围绕指定产品或公司，自动收集公开信息、整理结构化结论、生成专业的竞品分析报告。

## 🚀 快速部署到Vercel

### 方式一：使用Vercel CLI（推荐）

```bash
# 1. 安装Vercel CLI
npm install -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署项目
vercel

# 4. 生产环境部署
vercel --prod
```

### 方式二：使用GitHub集成

1. **创建GitHub仓库**
   ```bash
   # 初始化Git仓库
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "Initial commit: AI竞品分析系统"
   
   # 创建GitHub仓库（在GitHub网站上创建）
   # 然后推送代码
   git remote add origin https://github.com/你的用户名/competitor-analysis-agent.git
   git push -u origin main
   ```

2. **连接Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择你的GitHub仓库
   - 点击 "Deploy"
   - 等待部署完成

### 方式三：直接拖拽部署

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 直接拖拽整个项目文件夹到网页上
3. 自动部署完成

## 📋 部署后配置

部署完成后，Vercel会提供给你一个URL，例如：
`https://competitor-analysis-agent.vercel.app`

你可以：
- 直接访问这个URL查看网站
- 设置自定义域名
- 配置环境变量（如果需要）

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## ✨ 功能特性

### 核心功能
- ✅ 任务管理：创建、追踪和管理竞品分析任务
- ✅ Agent协作：5个专业Agent协同工作
- ✅ 实时监控：可视化Agent执行流程和实时日志
- ✅ 报告生成：自动生成结构化分析报告

### 企业级功能
- ✅ 团队协作：成员管理、角色权限配置
- ✅ API接入：完整的RESTful API
- ✅ 知识库管理：自定义数据源配置
- ✅ 系统设置：灵活的Agent参数配置

## 🎨 技术栈

- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS
- Zustand 状态管理
- React Router
- Lucide Icons
- Recharts 图表库

## 📝 项目文档

- [产品需求文档](./.trae/documents/prd.md)
- [技术架构文档](./.trae/documents/tech-architecture.md)

## 许可证

MIT
