import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportApi } from '@/services/api';
import type { Report, ReportSection } from '@/types';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  FileText,
  Table,
  BarChart3,
  CheckCircle,
} from 'lucide-react';

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'preview'>('content');

  useEffect(() => {
    loadReport();
  }, [id]);

  useEffect(() => {
    if (report && report.sections.length > 0 && !activeSection) {
      setActiveSection(report.sections[0].id);
    }
  }, [report, activeSection]);

  const loadReport = async () => {
    try {
      const data = await reportApi.getReport(id || '');
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'pdf' | 'word' | 'markdown') => {
    console.log(`Exporting as ${format}...`);
  };

  const handleShare = () => {
    console.log('Sharing report...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">报告不存在</p>
          <Link to="/reports" className="mt-4 btn-primary inline-block">
            返回报告列表
          </Link>
        </div>
      </div>
    );
  }

  const currentSection = report.sections.find((s) => s.id === activeSection);

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/reports" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                生成于 {new Date(report.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="btn-secondary flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              分享
            </button>
            <div className="relative group">
              <button className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 hidden group-hover:block z-10">
                {report.export_formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <File className="w-4 h-4" />
                    {format === 'pdf' ? '导出 PDF' : format === 'word' ? '导出 Word' : '导出 Markdown'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            报告内容
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            数据预览
          </button>
        </div>
      </header>

      {activeTab === 'content' ? (
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-auto">
              <div className="p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">目录</h3>
                <nav className="space-y-1">
                  {report.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-accent-green/10 rounded-lg p-4 mb-8 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">执行摘要</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.summary}</p>
                  </div>
                </div>

                {currentSection && (
                  <div className="prose prose-lg max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentSection.title}</h2>
                    <div className="text-gray-700 leading-relaxed">
                      <ReactMarkdown>{currentSection.content}</ReactMarkdown>
                    </div>

                    {currentSection.charts && currentSection.charts.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          图表
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-gray-500 text-sm">图表展示区域</p>
                        </div>
                      </div>
                    )}

                    {currentSection.tables && currentSection.tables.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Table className="w-5 h-5" />
                          表格
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {currentSection.tables[0].headers.map((header, i) => (
                                  <th
                                    key={i}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {currentSection.tables[0].rows.map((row, i) => (
                                <tr key={i}>
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-3 text-sm text-gray-700">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">数据预览</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="font-medium text-gray-900 mb-2">报告章节</h3>
                <p className="text-3xl font-bold text-primary-600">{report.sections.length}</p>
                <p className="text-sm text-gray-500 mt-1">个章节</p>
              </div>
              <div className="card p-6">
                <h3 className="font-medium text-gray-900 mb-2">图表数量</h3>
                <p className="text-3xl font-bold text-accent-green">
                  {report.sections.reduce((acc, s) => acc + (s.charts?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-500 mt-1">个图表</p>
              </div>
              <div className="card p-6">
                <h3 className="font-medium text-gray-900 mb-2">表格数量</h3>
                <p className="text-3xl font-bold text-accent-amber">
                  {report.sections.reduce((acc, s) => acc + (s.tables?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-500 mt-1">个表格</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
