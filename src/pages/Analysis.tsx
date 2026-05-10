import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { taskApi, agentLogApi } from '@/services/api';
import type { Task, AgentLog } from '@/types';
import {
  ArrowLeft,
  Loader2,
  Bot,
  Database,
  FileSearch,
  Brain,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

interface AgentNode {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  progress: number;
  description: string;
}

export default function Analysis() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentNodes, setAgentNodes] = useState<AgentNode[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const loadData = async () => {
    try {
      const tasks = await taskApi.getTasks();
      const foundTask = tasks.find((t) => t.id === id);
      if (foundTask) {
        setTask(foundTask);
        updateAgentNodes(foundTask);
      }
      await loadLogs();
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    if (!id) return;
    try {
      const data = await agentLogApi.getLogs(id);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const updateAgentNodes = (task: Task) => {
    const nodes: AgentNode[] = [
      {
        id: 'planner',
        name: '任务规划',
        icon: Bot,
        status: getAgentStatus(task, 'planner'),
        progress: task.status === 'completed' ? 100 : task.agent_progress?.planner || 0,
        description: '解析需求，生成执行计划',
      },
      {
        id: 'collector',
        name: '信息采集',
        icon: Database,
        status: getAgentStatus(task, 'collector'),
        progress: task.status === 'completed' ? 100 : task.agent_progress?.collector || 0,
        description: '从多数据源采集信息',
      },
      {
        id: 'extractor',
        name: '信息抽取',
        icon: FileSearch,
        status: getAgentStatus(task, 'extractor'),
        progress: task.status === 'completed' ? 100 : task.agent_progress?.extractor || 0,
        description: '提取关键实体和关系',
      },
      {
        id: 'analyzer',
        name: '分析',
        icon: Brain,
        status: getAgentStatus(task, 'analyzer'),
        progress: task.status === 'completed' ? 100 : task.agent_progress?.analyzer || 0,
        description: '多维度分析和洞察生成',
      },
      {
        id: 'reporter',
        name: '报告生成',
        icon: FileText,
        status: getAgentStatus(task, 'reporter'),
        progress: task.status === 'completed' ? 100 : task.agent_progress?.reporter || 0,
        description: '生成结构化分析报告',
      },
    ];
    setAgentNodes(nodes);
  };

  const getAgentStatus = (task: Task, agentId: string): AgentNode['status'] => {
    if (task.status === 'failed') return 'failed';
    if (task.status === 'completed') return 'completed';
    if (task.status === 'pending') return 'pending';

    const agentOrder = ['planner', 'collector', 'extractor', 'analyzer', 'reporter'];
    const currentAgentIndex = agentOrder.indexOf(task.status);
    const agentIndex = agentOrder.indexOf(agentId);

    if (agentIndex < currentAgentIndex) return 'completed';
    if (agentIndex === currentAgentIndex) return 'executing';
    return 'pending';
  };

  const getStatusIcon = (status: AgentNode['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-accent-green" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'executing':
        return <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
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
          <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
            <h1 className="text-2xl font-bold text-gray-900">分析看板</h1>
            <p className="text-sm text-gray-500 mt-1">{task.name}</p>
          </div>
          <button onClick={loadData} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Agent 执行流程</h2>
            <div className="relative">
              <div className="flex items-center justify-between">
                {agentNodes.map((node, index) => (
                  <div key={node.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center bg-white border-4 transition-all ${
                          node.status === 'executing'
                            ? 'border-primary-500 agent-node-executing'
                            : node.status === 'completed'
                            ? 'border-accent-green'
                            : node.status === 'failed'
                            ? 'border-red-500'
                            : 'border-gray-200'
                        }`}
                      >
                        {getStatusIcon(node.status)}
                      </div>
                      <div className="mt-3 text-center">
                        <p className="font-medium text-gray-900">{node.name}</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-24">{node.description}</p>
                        {node.status === 'executing' && (
                          <div className="mt-2 w-20">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                                style={{ width: `${node.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-primary-600 mt-1">{node.progress}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < agentNodes.length - 1 && (
                      <div
                        className={`w-32 h-1 mx-2 rounded transition-all ${
                          node.status === 'completed'
                            ? 'bg-accent-green'
                            : node.status === 'executing'
                            ? 'bg-primary-200 flow-line-active'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">实时日志</h2>
                <span className="text-xs text-gray-500">{logs.length} 条日志</span>
              </div>
              <div className="h-96 overflow-auto bg-gray-900 p-4 font-mono text-sm">
                {logs.length === 0 ? (
                  <p className="text-gray-500">暂无日志</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="mb-2 flex items-start gap-3">
                      <span className="text-gray-500 flex-shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString('zh-CN')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${
                          log.level === 'error'
                            ? 'bg-red-500/20 text-red-400'
                            : log.level === 'warning'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {log.agent_name}
                      </span>
                      <span
                        className={`${
                          log.level === 'error'
                            ? 'text-red-400'
                            : log.level === 'warning'
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>

            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">数据预览</h2>
              </div>
              <div className="p-4">
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>暂无数据</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">采集统计</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">新闻数据</p>
                          <p className="text-2xl font-bold text-primary-600">123</p>
                        </div>
                        <div>
                          <p className="text-gray-500">社交媒体</p>
                          <p className="text-2xl font-bold text-primary-600">456</p>
                        </div>
                        <div>
                          <p className="text-gray-500">应用商店</p>
                          <p className="text-2xl font-bold text-primary-600">78</p>
                        </div>
                        <div>
                          <p className="text-gray-500">官方网站</p>
                          <p className="text-2xl font-bold text-primary-600">23</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">抽取统计</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">实体数量</p>
                          <p className="text-2xl font-bold text-accent-green">356</p>
                        </div>
                        <div>
                          <p className="text-gray-500">关系三元组</p>
                          <p className="text-2xl font-bold text-accent-green">189</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
