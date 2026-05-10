export interface User {
  id: string;
  email: string;
  name: string;
  role: 'individual' | 'enterprise_admin' | 'enterprise_editor' | 'enterprise_viewer';
  enterprise_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  name: string;
  target: string;
  description: string;
  analysis_dimensions: string[];
  time_range: {
    start: string;
    end: string;
  };
  status: 'pending' | 'planning' | 'collecting' | 'extracting' | 'analyzing' | 'generating' | 'completed' | 'failed';
  progress: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateTaskRequest {
  name: string;
  target: string;
  description: string;
  analysis_dimensions: string[];
  time_range_start: string;
  time_range_end: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: Task['status'];
  progress: number;
  current_agent: string;
  agent_progress: {
    planner: number;
    collector: number;
    extractor: number;
    analyzer: number;
    reporter: number;
  };
  message: string;
}

export interface AgentLog {
  id: string;
  task_id: string;
  agent_name: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Report {
  id: string;
  task_id: string;
  title: string;
  summary: string;
  sections: ReportSection[];
  created_at: string;
  export_formats: ('pdf' | 'word' | 'markdown')[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  charts?: ChartData[];
  tables?: TableData[];
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'radar';
  title: string;
  data: any;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface DataSource {
  id: string;
  name: string;
  type: 'news' | 'social' | 'financial' | 'product' | 'app_store';
  config: {
    url?: string;
    api_key?: string;
    enabled: boolean;
  };
  is_active: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'active';
  invited_at: string;
  joined_at?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_preview: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
}

export type TaskStatus = Task['status'];
export type UserRole = User['role'];
