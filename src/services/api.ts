import axios from 'axios';
import type { Task, Report, AgentLog, CreateTaskRequest, DataSource, TeamMember, ApiKey } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    return { data: { token: 'mock-token', user: { id: '1', email, name: email.split('@')[0], role: 'individual' } } };
  },
  register: async (email: string, password: string, name: string, isEnterprise: boolean) => {
    return { data: { token: 'mock-token', user: { id: '1', email, name, role: isEnterprise ? 'enterprise_admin' : 'individual' } } };
  },
};

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    return [
      {
        id: '1',
        name: '智能电动汽车市场分析',
        target: '特斯拉、比亚迪、蔚来',
        description: '分析2024年智能电动汽车市场竞争格局',
        analysis_dimensions: ['产品功能', '定价策略', '市场份额', '用户评价'],
        time_range: { start: '2024-01-01', end: '2024-12-31' },
        status: 'completed',
        progress: 100,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T12:30:00Z',
        user_id: '1',
      },
      {
        id: '2',
        name: '在线教育平台竞品分析',
        target: 'VIPKID、猿辅导、作业帮',
        description: '分析K12在线教育市场竞争态势',
        analysis_dimensions: ['产品功能', '市场份额', '技术架构'],
        time_range: { start: '2024-01-01', end: '2024-03-31' },
        status: 'analyzing',
        progress: 65,
        created_at: '2024-03-01T09:00:00Z',
        updated_at: '2024-03-01T11:20:00Z',
        user_id: '1',
      },
    ];
  },
  createTask: async (data: CreateTaskRequest): Promise<Task> => {
    return {
      id: Date.now().toString(),
      ...data,
      time_range: { start: data.time_range_start, end: data.time_range_end },
      analysis_dimensions: data.analysis_dimensions,
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
    };
  },
  getTaskStatus: async (taskId: string) => {
    return {
      task_id: taskId,
      status: 'analyzing',
      progress: 65,
      current_agent: 'analyzer',
      agent_progress: { planner: 100, collector: 100, extractor: 100, analyzer: 45, reporter: 0 },
      message: '分析Agent正在生成洞察',
    };
  },
  startTask: async (taskId: string) => {
    return { success: true };
  },
};

export const reportApi = {
  getReports: async (): Promise<Report[]> => {
    return [
      {
        id: '1',
        task_id: '1',
        title: '智能电动汽车市场竞品分析报告',
        summary: '本报告全面分析了2024年智能电动汽车市场的竞争格局，涵盖特斯拉、比亚迪、蔚来等主要竞争者。',
        sections: [
          { id: '1', title: '执行摘要', content: '智能电动汽车市场在2024年继续保持高速增长态势。特斯拉、比亚迪和蔚来是市场的主要竞争者。' },
          { id: '2', title: '公司概览', content: '**特斯拉**：全球领先的电动汽车制造商，2024年交付量达180万辆。\n\n**比亚迪**：中国最大电动汽车制造商，垂直整合能力强。\n\n**蔚来**：高端智能电动汽车品牌，服务体系完善。' },
          { id: '3', title: '产品分析', content: '## 产品对比\n\n| 维度 | 特斯拉Model 3 | 比亚迪汉 | 蔚来ET7 |\n|------|--------------|---------|---------|\n| 续航里程 | 556km | 605km | 700km |\n| 售价 | 26.59万 | 22.98万 | 44.80万 |\n| 辅助驾驶 | FSD | DiPilot | NAD |' },
          { id: '4', title: '市场分析', content: '2024年智能电动汽车市场份额分布：\n\n- 特斯拉：35%\n- 比亚迪：28%\n- 其他：37%' },
          { id: '5', title: '竞争格局', content: '市场呈现"一超多强"格局，特斯拉领先优势明显，但比亚迪正在快速追赶。' },
          { id: '6', title: '结论与建议', content: '1. 建议关注特斯拉的FSD技术发展\n2. 比亚迪的成本控制能力值得关注\n3. 蔚来的用户服务体系是差异化竞争点' },
        ],
        created_at: '2024-01-15T12:30:00Z',
        export_formats: ['pdf', 'word', 'markdown'],
      },
    ];
  },
  getReport: async (reportId: string): Promise<Report | null> => {
    const reports = await reportApi.getReports();
    return reports.find(r => r.id === reportId) || null;
  },
};

export const agentLogApi = {
  getLogs: async (taskId: string): Promise<AgentLog[]> => {
    return [
      { id: '1', task_id: taskId, agent_name: 'planner', level: 'info', message: '任务规划Agent启动', timestamp: '2024-03-01T09:00:00Z' },
      { id: '2', task_id: taskId, agent_name: 'planner', level: 'info', message: '解析任务：分析VIPKID、猿辅导、作业帮', timestamp: '2024-03-01T09:00:01Z' },
      { id: '3', task_id: taskId, agent_name: 'planner', level: 'info', message: '生成执行计划：3个数据源，5个分析维度', timestamp: '2024-03-01T09:00:02Z' },
      { id: '4', task_id: taskId, agent_name: 'collector', level: 'info', message: '信息采集Agent启动', timestamp: '2024-03-01T09:00:05Z' },
      { id: '5', task_id: taskId, agent_name: 'collector', level: 'info', message: '开始采集新闻数据...', timestamp: '2024-03-01T09:00:10Z' },
      { id: '6', task_id: taskId, agent_name: 'collector', level: 'info', message: '采集完成：获取123条新闻', timestamp: '2024-03-01T09:05:30Z' },
      { id: '7', task_id: taskId, agent_name: 'collector', level: 'info', message: '开始采集社交媒体数据...', timestamp: '2024-03-01T09:05:35Z' },
      { id: '8', task_id: taskId, agent_name: 'extractor', level: 'info', message: '信息抽取Agent启动', timestamp: '2024-03-01T09:10:00Z' },
      { id: '9', task_id: taskId, agent_name: 'extractor', level: 'info', message: '实体识别完成：提取356个实体', timestamp: '2024-03-01T09:15:20Z' },
      { id: '10', task_id: taskId, agent_name: 'analyzer', level: 'info', message: '分析Agent启动', timestamp: '2024-03-01T09:15:25Z' },
      { id: '11', task_id: taskId, agent_name: 'analyzer', level: 'info', message: '正在进行产品功能对比分析...', timestamp: '2024-03-01T09:16:00Z' },
      { id: '12', task_id: taskId, agent_name: 'analyzer', level: 'info', message: '正在进行市场份额分析...', timestamp: '2024-03-01T09:17:30Z' },
    ];
  },
};

export const dataSourceApi = {
  getDataSources: async (): Promise<DataSource[]> => {
    return [
      { id: '1', name: '财经新闻', type: 'news', config: { url: 'https://finance.example.com', enabled: true }, is_active: true, created_at: '2024-01-01T00:00:00Z' },
      { id: '2', name: '社交媒体', type: 'social', config: { url: 'https://social.example.com', enabled: true }, is_active: true, created_at: '2024-01-01T00:00:00Z' },
      { id: '3', name: '应用商店', type: 'app_store', config: { enabled: true }, is_active: true, created_at: '2024-01-01T00:00:00Z' },
    ];
  },
};

export const teamApi = {
  getMembers: async (): Promise<TeamMember[]> => {
    return [
      { id: '1', email: 'admin@example.com', name: '管理员', role: 'admin', status: 'active', invited_at: '2024-01-01T00:00:00Z', joined_at: '2024-01-01T00:00:00Z' },
      { id: '2', email: 'editor@example.com', name: '编辑器', role: 'editor', status: 'active', invited_at: '2024-01-05T00:00:00Z', joined_at: '2024-01-05T00:00:00Z' },
    ];
  },
};

export const apiKeyApi = {
  getApiKeys: async (): Promise<ApiKey[]> => {
    return [
      { id: '1', name: '生产环境', key_preview: 'sk_live_****5678', created_at: '2024-01-01T00:00:00Z', last_used: '2024-03-01T10:00:00Z', is_active: true },
      { id: '2', name: '测试环境', key_preview: 'sk_test_****1234', created_at: '2024-01-15T00:00:00Z', is_active: false },
    ];
  },
};

export default api;
