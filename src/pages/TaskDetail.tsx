import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { taskApi } from '@/services/api';
import type { Task, AgentLog } from '@/types';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Target,
  Calendar,
  BarChart3,
} from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const tasks = await taskApi.getTasks();
      const foundTask = tasks.find((t) => t.id === id);
      setTask(foundTask || null);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!task) return;
    try {
      await taskApi.startTask(task.id);
      setTask({ ...task, status: 'planning' });
    } catch (error) {
      console.error('Failed to start task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">任务不存在</p>
          <Link to="/tasks" className="mt-4 btn-primary inline-block">
            返回任务列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/tasks" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{task.name}</h1>
            <p className="text-sm text-gray-500 mt-1">任务详情</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">任务配置</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">分析目标</label>
                    <p className="font-medium text-gray-900 mt-1 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {task.target}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">分析维度</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {task.analysis_dimensions.map((dim) => (
                        <span
                          key={dim}
                          className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm"
                        >
                          {dim}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">时间范围</label>
                    <p className="font-medium text-gray-900 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {task.time_range.start} ~ {task.time_range.end}
                    </p>
                  </div>
                  {task.description && (
                    <div>
                      <label className="text-sm text-gray-500">任务描述</label>
                      <p className="text-gray-900 mt-1">{task.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {task.status !== 'pending' && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">执行状态</h2>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">总体进度</span>
                      <span className="font-medium text-primary-600">{task.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">当前状态</span>
                    <span className={`font-medium ${
                      task.status === 'completed' ? 'text-accent-green' :
                      task.status === 'failed' ? 'text-red-500' : 'text-primary-600'
                    }`}>
                      {task.status === 'completed' ? '已完成' :
                       task.status === 'failed' ? '失败' :
                       task.status === 'planning' ? '规划中' :
                       task.status === 'collecting' ? '采集中' :
                       task.status === 'extracting' ? '抽取中' :
                       task.status === 'analyzing' ? '分析中' :
                       task.status === 'generating' ? '生成中' : task.status}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">任务信息</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">创建时间</span>
                    <span className="text-gray-900">{new Date(task.created_at).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">更新时间</span>
                    <span className="text-gray-900">{new Date(task.updated_at).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">任务ID</span>
                    <span className="text-gray-900 font-mono text-xs">{task.id}</span>
                  </div>
                </div>
              </div>

              {task.status === 'pending' && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">操作</h2>
                  <button onClick={handleStartAnalysis} className="btn-primary w-full">
                    启动分析
                  </button>
                </div>
              )}

              {task.status !== 'pending' && task.status !== 'completed' && task.status !== 'failed' && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">操作</h2>
                  <Link to={`/analysis/${task.id}`} className="btn-primary w-full flex items-center justify-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    查看实时分析
                  </Link>
                </div>
              )}

              {task.status === 'completed' && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">操作</h2>
                  <Link to="/reports" className="btn-primary w-full flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    查看报告
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
