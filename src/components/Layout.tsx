import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import {
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Database,
  Users,
  Key,
  ChevronLeft,
  Menu,
  Bot,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: '任务中心', href: '/tasks', icon: FileText },
  { name: '分析看板', href: '/analysis', icon: BarChart3 },
  { name: '报告中心', href: '/reports', icon: FileText },
  { name: '知识库', href: '/knowledge', icon: Database },
];

const enterpriseNavigation = [
  { name: '团队管理', href: '/team', icon: Users },
  { name: 'API管理', href: '/api-management', icon: Key },
  { name: '系统设置', href: '/settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isEnterprise = user?.role?.startsWith('enterprise');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-primary-500" />
              <span className="font-bold text-lg text-primary-600">竞品分析</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {sidebarCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}

          {isEnterprise && (
            <>
              <div className={`my-4 border-t border-gray-200 ${sidebarCollapsed ? 'mx-2' : 'mx-0'}`} />
              {!sidebarCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                  企业管理
                </div>
              )}
              {enterpriseNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${
                      sidebarCollapsed ? 'justify-center' : ''
                    }`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1 hover:bg-gray-100 rounded"
              title="退出登录"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
