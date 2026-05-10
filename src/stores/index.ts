import { create } from 'zustand';
import type { User, Task, Report } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isEnterprise: boolean) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  login: async (email: string, password: string) => {
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: 'individual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', mockToken);
    set({ user: mockUser, token: mockToken, isAuthenticated: true });
  },
  register: async (email: string, password: string, name: string, isEnterprise: boolean) => {
    const mockUser: User = {
      id: '1',
      email,
      name,
      role: isEnterprise ? 'enterprise_admin' : 'individual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const mockToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('token', mockToken);
    set({ user: mockUser, token: mockToken, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user: User) => set({ user }),
}));

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setCurrentTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t),
    currentTask: state.currentTask?.id === taskId ? { ...state.currentTask, ...updates } : state.currentTask,
  })),
  setCurrentTask: (task) => set({ currentTask: task }),
}));

interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  setCurrentReport: (report: Report | null) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  currentReport: null,
  setReports: (reports) => set({ reports }),
  addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
  setCurrentReport: (report) => set({ currentReport: report }),
}));
