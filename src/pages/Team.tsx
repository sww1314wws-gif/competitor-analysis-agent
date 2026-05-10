import { useState, useEffect } from 'react';
import { teamApi } from '@/services/api';
import type { TeamMember } from '@/types';
import {
  Users,
  Plus,
  Search,
  Loader2,
  Mail,
  MoreVertical,
  Crown,
  Edit,
  Eye,
} from 'lucide-react';

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await teamApi.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-accent-amber" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-primary-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleLabel = (role: TeamMember['role']) => {
    const labels: Record<TeamMember['role'], string> = {
      admin: '管理员',
      editor: '编辑者',
      viewer: '查看者',
    };
    return labels[role];
  };

  const getRoleBadgeColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-accent-amber/10 text-accent-amber';
      case 'editor':
        return 'bg-primary-100 text-primary-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">团队管理</h1>
            <p className="text-sm text-gray-500 mt-1">
              管理团队成员和权限
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            邀请成员
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索成员..."
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
                    成员
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    邀请时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getRoleBadgeColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        {getRoleLabel(member.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.status === 'active'
                          ? 'bg-accent-green/10 text-accent-green'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.status === 'active' ? '已激活' : '待激活'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.invited_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-primary-600 hover:text-primary-700 mr-3">
                        编辑
                      </button>
                      {member.role !== 'admin' && (
                        <button className="text-red-600 hover:text-red-700">
                          移除
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">权限说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-accent-amber" />
                <h3 className="font-medium text-gray-900">管理员</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 管理团队成员</li>
                <li>• 配置数据源</li>
                <li>• 管理API密钥</li>
                <li>• 查看用量统计</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Edit className="w-5 h-5 text-primary-600" />
                <h3 className="font-medium text-gray-900">编辑者</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 创建分析任务</li>
                <li>• 生成报告</li>
                <li>• 管理个人数据源</li>
                <li>• 导出报告</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium text-gray-900">查看者</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 查看分享的报告</li>
                <li>• 查看分析结果</li>
                <li>• 导出报告</li>
                <li>• 无法创建任务</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          onInvite={(email, role) => {
            console.log('Invite:', email, role);
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
}

function InviteMemberModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (email: string, role: TeamMember['role']) => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('editor');

  const handleSubmit = () => {
    if (email) {
      onInvite(email, role);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">邀请团队成员</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="colleague@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">角色</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamMember['role'])}
              className="input-field"
            >
              <option value="editor">编辑者</option>
              <option value="viewer">查看者</option>
              <option value="admin">管理员</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!email}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送邀请
          </button>
        </div>
      </div>
    </div>
  );
}
