# AI驱动的竞品分析Agent协作系统

一个基于多Agent协作的智能竞品分析平台，围绕指定产品或公司，自动收集公开信息、整理结构化结论、生成专业的竞品分析报告。

## 功能特性

### 核心功能
- **任务管理**：创建、追踪和管理竞品分析任务
- **Agent协作**：5个专业Agent协同工作（任务规划、信息采集、信息抽取、分析、报告生成）
- **实时监控**：可视化Agent执行流程和实时日志
- **报告生成**：自动生成结构化分析报告，支持多种导出格式

### 企业级功能
- **团队协作**：成员管理、角色权限配置
- **API接入**：完整的RESTful API，支持系统集成
- **知识库管理**：自定义数据源配置
- **系统设置**：灵活的Agent参数配置

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS 样式方案
- Zustand 状态管理
- React Router 路由
- Lucide 图标库
- Recharts 图表库
- React Markdown 渲染

### 后端（规划中）
- FastAPI (Python)
- PostgreSQL 数据库
- Redis 缓存
- Milvus 向量数据库
- Celery 任务队列

## 项目结构

```
competitor-analysis-agent/
├── src/
│   ├── components/          # 可复用组件
│   │   └── Layout.tsx      # 主布局组件
│   ├── pages/              # 页面组件
│   │   ├── Login.tsx       # 登录页
│   │   ├── Register.tsx    # 注册页
│   │   ├── Tasks.tsx       # 任务中心
│   │   ├── TaskDetail.tsx  # 任务详情
│   │   ├── Analysis.tsx     # 分析看板
│   │   ├── Reports.tsx     # 报告列表
│   │   ├── ReportDetail.tsx # 报告详情
│   │   ├── Knowledge.tsx    # 知识库管理
│   │   ├── Settings.tsx    # 系统设置
│   │   ├── Team.tsx        # 团队管理
│   │   └── ApiManagement.tsx # API管理
│   ├── services/          # API服务层
│   │   └── api.ts         # API调用封装
│   ├── stores/            # Zustand状态管理
│   │   └── index.ts       # 状态定义
│   ├── types/             # TypeScript类型定义
│   │   └── index.ts       # 类型声明
│   ├── App.tsx            # 应用入口
│   ├── main.tsx           # React渲染入口
│   └── index.css          # 全局样式
├── package.json          # 项目依赖
├── vite.config.ts        # Vite配置
├── tsconfig.json         # TypeScript配置
├── tailwind.config.js    # Tailwind配置
└── index.html            # HTML入口
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 页面说明

### 个人用户页面
- **登录/注册**：邮箱登录、社交账号登录、企业邮箱注册
- **任务中心**：创建分析任务、查看任务列表
- **分析看板**：实时查看Agent执行进度
- **报告中心**：查看和管理分析报告

### 企业用户扩展页面
- **团队管理**：成员邀请、角色分配
- **API管理**：API密钥生成、Webhook配置
- **系统设置**：Agent参数配置
- **知识库**：数据源配置

## Agent工作流程

1. **任务规划Agent**：解析用户需求，生成执行计划
2. **信息采集Agent**：从多数据源采集信息
3. **信息抽取Agent**：提取关键实体和关系
4. **分析Agent**：进行多维度分析和洞察生成
5. **报告生成Agent**：生成结构化分析报告

## 设计规范

### 色彩系统
- 主色：#1E3A5F（深蓝）、#4A90D9（科技蓝）
- 辅助色：#F59E0B（琥珀）、#10B981（翠绿）
- 中性色：#1F2937（深灰）、#F3F4F6（浅灰）

### 字体
- 中文：思源黑体
- 英文/数字：Inter

### 布局
- 左侧固定导航栏 + 右侧内容区
- 卡片式布局设计
- 响应式适配

## License

MIT
