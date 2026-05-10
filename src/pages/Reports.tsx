import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportApi } from '@/services/api';
import type { Report } from '@/types';
import {
  FileText,
  Search,
  Download,
  Calendar,
  ArrowRight,
  Loader2,
  File,
} from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportApi.getReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">报告中心</h1>
            <p className="text-sm text-gray-500 mt-1">查看和管理您的竞品分析报告</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索报告..."
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
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">暂无报告</p>
            <Link to="/tasks" className="mt-4 btn-primary">
              创建分析任务
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Link
                key={report.id}
                to={`/reports/${report.id}`}
                className="card p-5 hover:scale-105 transition-transform"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    {report.export_formats.map((format) => (
                      <span
                        key={format}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs uppercase"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {report.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{report.summary}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(report.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <span className="text-sm text-primary-600 font-medium flex items-center gap-1">
                    查看详情 <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
