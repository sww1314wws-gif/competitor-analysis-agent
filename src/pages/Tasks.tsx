import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskApi } from '@/services/api';
import { useTaskStore } from '@/stores';
import type { Task } from '@/types';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  MoreVertical,
  Calendar,
  Target,
} from 'lucide-react';

export default function Tasks() {
  const navigate = useNavigate();
  const { tasks, setTasks, addTask } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent-green" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'planning':
      case 'collecting':
      case 'extracting':
      case 'analyzing':
      case 'generating':
        return <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    const labels: Record<Task['status'], string> = {
      pending: '等待中',
      planning: '规划中',
      collecting: '采集中',
      extracting: '抽取中',
      analyzing: '分析中',
      generating: '生成中',
      completed: '已完成',
      failed: '失败',
    };
    return labels[status];
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green/10 text-accent-green';
      case 'failed':
        return 'bg-red-100 text-red-600';
      case 'planning':
      case 'collecting':
      case 'extracting':
      case 'analyzing':
      case 'generating':
        return 'bg-primary-100 text-primary-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">任务中心</h1>
            <p className="text-sm text-gray-500 mt-1">管理和追踪您的竞品分析任务</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            创建任务
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索任务名称或目标..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">全部状态</option>
            <option value="pending">等待中</option>
            <option value="planning">规划中</option>
            <option value="collecting">采集中</option>
            <option value="extracting">抽取中</option>
            <option value="analyzing">分析中</option>
            <option value="generating">生成中</option>
            <option value="completed">已完成</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">暂无任务</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-primary"
            >
              创建您的第一个任务
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task.id} className="card p-5 hover:scale-105 transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <Link to={`/tasks/${task.id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 mb-2">
                    {task.name}
                  </h3>
                </Link>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{task.target}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{task.time_range.start} ~ {task.time_range.end}</span>
                  </div>
                </div>

                {task.status !== 'pending' && task.status !== 'completed' && task.status !== 'failed' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">进度</span>
                      <span className="text-primary-600 font-medium">{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(task.created_at).toLocaleDateString('zh-CN')}
                  </span>
                  {task.status === 'completed' ? (
                    <Link
                      to={`/reports`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      查看报告 →
                    </Link>
                  ) : task.status !== 'failed' ? (
                    <Link
                      to={`/analysis/${task.id}`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      查看进度 →
                    </Link>
                  ) : (
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                      重新执行
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(task) => {
            addTask(task);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateTaskModal({ onClose, onCreated }: { onClose: () => void; onCreated: (task: Task) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    description: '',
    analysis_dimensions: [] as string[],
    time_range_start: '',
    time_range_end: '',
  });
  const [loading, setLoading] = useState(false);

  const dimensions = [
    { value: 'product_features', label: '产品功能' },
    { value: 'pricing', label: '定价策略' },
    { value: 'market_share', label: '市场份额' },
    { value: 'user_review', label: '用户评价' },
    { value: 'tech_stack', label: '技术架构' },
    { value: 'marketing', label: '营销策略' },
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.target || formData.analysis_dimensions.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const task = await taskApi.createTask(formData);
      onCreated(task);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">创建分析任务</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-8 mt-2">
            <span className={`text-sm ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>基本信息</span>
            <span className={`text-sm ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>分析维度</span>
            <span className={`text-sm ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>时间范围</span>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任务名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="例如：智能电动汽车市场分析"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标公司/产品 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="input-field"
                  placeholder="例如：特斯拉、比亚迪、蔚来"
                />
                <p className="text-xs text-gray-500 mt-1">多个目标用中文顿号分隔</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">任务描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field h-24 resize-none"
                  placeholder="描述您想要分析的具体内容..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                选择分析维度 <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">至少选择一个分析维度</p>
              <div className="grid grid-cols-2 gap-4">
                {dimensions.map((dim) => (
                  <label
                    key={dim.value}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.analysis_dimensions.includes(dim.value)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.analysis_dimensions.includes(dim.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            analysis_dimensions: [...formData.analysis_dimensions, dim.value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            analysis_dimensions: formData.analysis_dimensions.filter(
                              (d) => d !== dim.value
                            ),
                          });
                        }
                      }}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="ml-3 font-medium text-gray-900">{dim.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
                <input
                  type="date"
                  value={formData.time_range_start}
                  onChange={(e) => setFormData({ ...formData, time_range_start: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                <input
                  type="date"
                  value={formData.time_range_end}
                  onChange={(e) => setFormData({ ...formData, time_range_end: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-medium text-gray-900 mb-3">任务摘要</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">任务名称：</span>{formData.name || '未填写'}</p>
                  <p><span className="text-gray-600">分析目标：</span>{formData.target || '未填写'}</p>
                  <p><span className="text-gray-600">分析维度：</span>{formData.analysis_dimensions.length > 0 ? formData.analysis_dimensions.map(d => dimensions.find(dim => dim.value === d)?.label).join('、') : '未选择'}</p>
                  <p><span className="text-gray-600">时间范围：</span>{formData.time_range_start || '未设置'} ~ {formData.time_range_end || '未设置'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一步
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!formData.name || !formData.target)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : '创建任务'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
