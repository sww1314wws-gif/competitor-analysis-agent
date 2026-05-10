import { useState, useEffect } from 'react';
import { apiKeyApi } from '@/services/api';
import type { ApiKey } from '@/types';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function ApiManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const data = await apiKeyApi.getApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (keyId: string, keyPreview: string) => {
    navigator.clipboard.writeText(keyPreview);
    setCopiedId(keyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleActive = (keyId: string) => {
    setApiKeys(
      apiKeys.map((k) =>
        k.id === keyId ? { ...k, is_active: !k.is_active } : k
      )
    );
  };

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理API密钥和Webhook配置</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            创建API密钥
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-primary-50 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Key className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">API接入说明</h2>
              <p className="text-sm text-gray-600 mb-4">
                通过API可以将竞品分析功能集成到您的内部系统。使用下方的API密钥进行身份验证。
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">请求示例：</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  curl -X POST https://api.example.com/v1/tasks \
                  -H "Authorization: Bearer YOUR_API_KEY" \
                  -H "Content-Type: application/json" \
                  -d '{"target": "Tesla", "dimensions": ["product"]}'
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API密钥</h2>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Key className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm text-gray-600 font-mono">
                            {apiKey.key_preview}
                          </code>
                          <button
                            onClick={() => handleCopy(apiKey.id, apiKey.key_preview)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {copiedId === apiKey.id ? (
                              <CheckCircle className="w-4 h-4 text-accent-green" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={apiKey.is_active}
                          onChange={() => handleToggleActive(apiKey.id)}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          {apiKey.is_active ? '启用' : '禁用'}
                        </span>
                      </label>
                      <button className="p-2 hover:bg-gray-100 rounded text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      创建于 {new Date(apiKey.created_at).toLocaleDateString('zh-CN')}
                    </span>
                    {apiKey.last_used && (
                      <span>
                        最后使用: {new Date(apiKey.last_used).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook配置</h2>
          <p className="text-sm text-gray-600 mb-4">
            配置Webhook URL，系统将在任务状态变化时向该URL发送通知。
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="https://your-webhook-url.com/webhook"
              className="input-field flex-1"
            />
            <button className="btn-primary">保存</button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateApiKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(name) => {
            console.log('Create API key:', name);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateApiKeyModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (name: string) => void;
}) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name) {
      onCreated(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">创建API密钥</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密钥名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="例如：生产环境密钥"
            />
            <p className="text-xs text-gray-500 mt-1">
              使用有意义的名称便于识别不同环境的密钥
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            创建
          </button>
        </div>
      </div>
    </div>
  );
}
