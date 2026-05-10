import { useState, useEffect } from 'react';
import { dataSourceApi } from '@/services/api';
import type { DataSource } from '@/types';
import {
  Database,
  Plus,
  Search,
  Globe,
  MessageSquare,
  TrendingUp,
  Store,
  Settings,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function Knowledge() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      const data = await dataSourceApi.getDataSources();
      setDataSources(data);
    } catch (error) {
      console.error('Failed to load data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'news':
        return <Globe className="w-5 h-5" />;
      case 'social':
        return <MessageSquare className="w-5 h-5" />;
      case 'financial':
        return <TrendingUp className="w-5 h-5" />;
      case 'app_store':
        return <Store className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: DataSource['type']) => {
    const labels: Record<DataSource['type'], string> = {
      news: '新闻',
      social: '社交媒体',
      financial: '财经数据',
      product: '产品官网',
      app_store: '应用商店',
    };
    return labels[type];
  };

  const filteredDataSources = dataSources.filter((ds) =>
    ds.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">知识库管理</h1>
            <p className="text-sm text-gray-500 mt-1">配置和管理数据采集源</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            添加数据源
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索数据源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数据源
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDataSources.map((ds) => (
                  <tr key={ds.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                          {getTypeIcon(ds.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ds.name}</p>
                          <p className="text-sm text-gray-500">{ds.config.url || '未配置URL'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {getTypeLabel(ds.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ds.is_active ? (
                        <span className="flex items-center gap-1 text-accent-green">
                          <CheckCircle className="w-4 h-4" />
                          启用
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <XCircle className="w-4 h-4" />
                          禁用
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ds.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-primary-600 hover:text-primary-700 mr-3">
                        编辑
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">向量库状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">索引文档数</p>
              <p className="text-2xl font-bold text-primary-600">1,234</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">向量维度</p>
              <p className="text-2xl font-bold text-primary-600">1536</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">最后更新时间</p>
              <p className="text-2xl font-bold text-primary-600">2小时前</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn-secondary">重建索引</button>
            <button className="btn-secondary">清理数据</button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddDataSourceModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function AddDataSourceModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'news' as DataSource['type'],
    url: '',
  });

  const handleSubmit = () => {
    console.log('Add data source:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">添加数据源</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">数据源名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="例如：财经新闻"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">数据类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as DataSource['type'] })}
              className="input-field"
            >
              <option value="news">新闻</option>
              <option value="social">社交媒体</option>
              <option value="financial">财经数据</option>
              <option value="product">产品官网</option>
              <option value="app_store">应用商店</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">数据源URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="input-field"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            取消
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            添加
          </button>
        </div>
      </div>
    </div>
  );
}
