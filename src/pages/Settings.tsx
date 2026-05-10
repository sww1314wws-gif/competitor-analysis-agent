import { useState } from 'react';
import {
  Settings,
  Bot,
  Bell,
  Shield,
  Palette,
  Save,
  Loader2,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('agents');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'agents', name: 'Agent配置', icon: Bot },
    { id: 'notifications', name: '通知设置', icon: Bell },
    { id: 'security', name: '安全设置', icon: Shield },
    { id: 'appearance', name: '外观设置', icon: Palette },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="text-sm text-gray-500 mt-1">配置系统参数和Agent行为</p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <aside className="w-64 bg-white border-r border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'agents' && (
              <div className="max-w-4xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Agent配置</h2>

                <div className="space-y-6">
                  <div className="card p-6">
                    <h3 className="font-medium text-gray-900 mb-4">任务规划Agent</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">模型选择</label>
                        <select className="input-field">
                          <option>GPT-4</option>
                          <option>GPT-3.5-turbo</option>
                          <option>Claude-3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Temperature</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          defaultValue="0.7"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="font-medium text-gray-900 mb-4">信息采集Agent</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">最大并发数</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          defaultValue="5"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">超时时间(秒)</label>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          defaultValue="60"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="font-medium text-gray-900 mb-4">分析Agent</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">分析维度</label>
                        <div className="space-y-2">
                          {['产品对比', '市场定位', '用户口碑', '发展趋势', 'SWOT分析'].map((dim) => (
                            <label key={dim} className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded" />
                              <span className="text-sm text-gray-700">{dim}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">RAG检索数量</label>
                        <input
                          type="number"
                          min="5"
                          max="50"
                          defaultValue="20"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="font-medium text-gray-900 mb-4">报告生成Agent</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">报告模板</label>
                        <select className="input-field">
                          <option>标准分析报告</option>
                          <option>简洁概要报告</option>
                          <option>详细研究报告</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">报告章节</label>
                        <div className="space-y-2">
                          {['执行摘要', '公司概览', '产品分析', '市场分析', '竞争格局', '结论建议'].map((section) => (
                            <label key={section} className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded" />
                              <span className="text-sm text-gray-700">{section}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        保存配置
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-4xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">通知设置</h2>
                <div className="card p-6 space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">任务完成通知</p>
                      <p className="text-sm text-gray-500">当分析任务完成时发送通知</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">任务失败通知</p>
                      <p className="text-sm text-gray-500">当分析任务失败时发送通知</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">系统公告</p>
                      <p className="text-sm text-gray-500">接收系统更新和维护通知</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                  </label>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleSave} className="btn-primary">
                    保存设置
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-4xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">安全设置</h2>
                <div className="space-y-6">
                  <div className="card p-6">
                    <h3 className="font-medium text-gray-900 mb-4">修改密码</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">当前密码</label>
                        <input type="password" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">新密码</label>
                        <input type="password" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">确认新密码</label>
                        <input type="password" className="input-field" />
                      </div>
                    </div>
                    <button className="mt-4 btn-primary">更新密码</button>
                  </div>

                  <div className="card p-6">
                    <h3 className="font-medium text-gray-900 mb-4">两步验证</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      启用两步验证以增强账户安全性
                    </p>
                    <button className="btn-secondary">启用两步验证</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="max-w-4xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">外观设置</h2>
                <div className="card p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">主题</label>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-4 rounded-lg border-2 border-primary-500 bg-gray-50 text-center">
                        <div className="w-full h-16 bg-white rounded mb-2 border" />
                        <p className="text-sm font-medium">浅色</p>
                      </button>
                      <button className="p-4 rounded-lg border-2 border-gray-200 text-center hover:border-gray-300">
                        <div className="w-full h-16 bg-gray-900 rounded mb-2" />
                        <p className="text-sm font-medium">深色</p>
                      </button>
                      <button className="p-4 rounded-lg border-2 border-gray-200 text-center hover:border-gray-300">
                        <div className="w-full h-16 bg-gradient-to-r from-white to-gray-900 rounded mb-2" />
                        <p className="text-sm font-medium">自动</p>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={handleSave} className="btn-primary">
                    保存设置
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
