import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { Bot, Eye, EyeOff, Building2, User } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isEnterprise: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.name, formData.isEnterprise);
      navigate('/tasks');
    } catch (err) {
      setError('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-amber rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-12 h-12 text-white" />
            <h1 className="text-3xl font-bold text-white">AI竞品分析系统</h1>
          </div>
          <p className="text-primary-100 text-lg">创建您的账户</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">注册</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="张三"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="border-t border-gray-200 pt-5">
              <p className="text-sm font-medium text-gray-700 mb-3">账户类型</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isEnterprise: false })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    !formData.isEnterprise
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className={`w-8 h-8 mx-auto mb-2 ${!formData.isEnterprise ? 'text-primary-500' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${!formData.isEnterprise ? 'text-primary-600' : 'text-gray-600'}`}>
                    个人用户
                  </p>
                  <p className="text-xs text-gray-500 mt-1">基础功能，有使用限制</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isEnterprise: true })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.isEnterprise
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building2 className={`w-8 h-8 mx-auto mb-2 ${formData.isEnterprise ? 'text-primary-500' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${formData.isEnterprise ? 'text-primary-600' : 'text-gray-600'}`}>
                    企业用户
                  </p>
                  <p className="text-xs text-gray-500 mt-1">完整功能，团队协作</p>
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 text-primary-600 rounded mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                我已阅读并同意{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  服务条款
                </a>{' '}
                和{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  隐私政策
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '创建账户'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              已有账户？{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
