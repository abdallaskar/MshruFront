import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../api/axios';
import { BarChart3, Users, FileText, TrendingUp, Eye, Edit, Download, Settings, Activity } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FormPDF from '../components/FormPDF';

export default function AdminDashboard() {


  const navigate = useNavigate();

  // Tabs state
  const [activeTab, setActiveTab] = useState('statistics');

  // Users and Forms
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);

  // Fields Configuration
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  // Counters
  const totalUsers = users.length;
  const totalForms = forms.length;
  const adminUsers = users.filter(user => user.role === 'admin' || user.role === 'مشرف').length;
  const regularUsers = users.filter(user => user.role === 'user' || user.role === 'مستخدم').length;

  // ✅ Fetch Field Configuration
  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/config');
      setFields(res.data.fields || []);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllFieldsUpdate = async () => {
    try {
      await axiosInstance.put(`/config/`, { fields });
      alert('تم حفظ جميع التعديلات بنجاح');
      fetchFields();
    } catch (error) {
      console.error("Error updating fields:", error);
      alert('حدث خطأ أثناء حفظ التعديلات');
    }
  };
  const handleResetFields = async () => {
    try {
      await axiosInstance.post(`/config/reset`);
      alert('تم إعادة الحقول إلى الإعدادات الافتراضية');
      fetchFields();
    } catch (error) {
      console.error("Error resetting fields:", error);
      alert('حدث خطأ أثناء إعادة الحقول');
    }
  }

  // ✅ Load fields only when 'fields' tab is active
  useEffect(() => {
    if (activeTab === 'fields') fetchFields();
  }, [activeTab]);

  // ✅ Load Users & Forms on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, formsRes] = await Promise.all([
          axiosInstance.get('/users'),
          axiosInstance.get('/form/all')
        ]);
        setUsers(usersRes.data);
        setForms(formsRes.data);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };
    fetchData();
  }, []);

  const handleEditForm = (form) => {
    navigate('/form', { state: { mode: 'edit', data: form } });
  };

  const handleWordExport = async (form) => {
    const res = await axiosInstance.get(`/export/word?formId=${form._id}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${form.projectName}.docx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get('/export/forms', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all_forms.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-[#C2C1C1]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base text-[#0DA9A6] font-medium">{title}</p>
          <p className="text-4xl font-bold text-[#15445A] mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#15445A] mb-6">إحصائيات المشروع</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المستخدمين"
          value={totalUsers}
          icon={Users}
          color="bg-[#15445A]"
        />
        <StatCard
          title="إجمالي النماذج"
          value={totalForms}
          icon={FileText}
          color="bg-[#0DA9A6]"
        />
        <StatCard
          title="المشرفين"
          value={adminUsers}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="المستخدمين العاديين"
          value={regularUsers}
          icon={Activity}
          color="bg-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#C2C1C1]">
          <h3 className="text-xl font-semibold text-[#15445A] mb-4">توزيع المستخدمين</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#15445A]">المشرفين</span>
              <span className="text-[#0DA9A6] font-semibold">{adminUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#15445A]">المستخدمين العاديين</span>
              <span className="text-[#15445A] font-semibold">{regularUsers}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#C2C1C1]">
          <h3 className="text-xl font-semibold text-[#15445A] mb-4">مؤشرات الأداء</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#15445A]">متوسط النماذج لكل مستخدم</span>
              <span className="text-[#0DA9A6] font-semibold">
                {totalUsers > 0 ? (totalForms / totalUsers).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#15445A]">نسبة المشرفين</span>
              <span className="text-[#15445A] font-semibold">
                {totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 border border-[#C2C1C1]">
        <h3 className="text-xl font-semibold text-[#15445A] mb-4">نشاط النظام</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#F9F9F9] rounded-lg">
            <div className="text-3xl font-bold text-[#0DA9A6]">{totalUsers}</div>
            <div className="text-base text-[#15445A]">إجمالي المستخدمين المسجلين</div>
          </div>
          <div className="text-center p-4 bg-[#F9F9F9] rounded-lg">
            <div className="text-3xl font-bold text-[#0DA9A6]">{totalForms}</div>
            <div className="text-base text-[#15445A]">إجمالي النماذج المُنشأة</div>
          </div>
          <div className="text-center p-4 bg-[#F9F9F9] rounded-lg">
            <div className="text-3xl font-bold text-[#0DA9A6]">
              {totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0}%
            </div>
            <div className="text-base text-[#15445A]">نسبة حسابات الإدارة</div>
          </div>
        </div>
      </div>
    </div>
  );


  const renderForms = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#15445A] mb-6">جميع النماذج</h2>

      <button
        onClick={handleExport}
        className="px-4 py-2 bg-[#07A869] text-white rounded-lg hover:bg-green-700 cursor-pointer"
      >
        تصدير كل النماذج Excel
      </button>

      <div className="bg-white rounded-lg shadow-md border border-[#C2C1C1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right">
            <thead className="bg-[#0DA9A6] text-white">
              <tr>
                <th className="p-3 border-l border-[#C2C1C1]">اسم المشروع</th>
                <th className="p-3 border-l border-[#C2C1C1]">الهدف الرئيسي</th>
                <th className="p-3 border-l border-[#C2C1C1]">الإدارة المالكة</th>
                <th className="p-3 border-l border-[#C2C1C1]">البريد الإلكتروني</th>
                <th className="p-3 border-l border-[#C2C1C1]">تعديل</th>
                <th className="p-3 border-l border-[#C2C1C1]">PDF</th>
                <th className="p-3 border-l border-[#C2C1C1]">Word</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr
                  key={form._id}
                  className="border-t border-[#C2C1C1] hover:bg-[#F9F9F9] transition-colors text-[#15445A]"
                >
                  <td className="p-3 border-l border-[#C2C1C1]">{form.projectName}</td>
                  <td className="p-3 border-l border-[#C2C1C1]">{form.strategicObjective}</td>
                  <td className="p-3 border-l border-[#C2C1C1]">{form.ownerName}</td>
                  <td className="p-3 border-l border-[#C2C1C1]">{form.email}</td>
                  <td className="p-3 border-l border-[#C2C1C1]">
                    <button
                      onClick={() => handleEditForm(form)}
                      className="bg-[#15445A] hover:bg-[#123d52] text-white px-3 py-1 rounded inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                      تعديل
                    </button>
                  </td>
                  <td className="p-3 border-l border-[#C2C1C1]">
                    <PDFDownloadLink
                      document={<FormPDF form={form} />}
                      fileName={`form-${form.projectName}.pdf`}
                      className="bg-[#0DA9A6] hover:bg-[#0C8B8A] text-white px-3 py-1 rounded inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {({ loading }) =>
                        loading ? 'جارٍ التحميل...' : (
                          <>
                            <Download className="w-4 h-4" />
                            PDF
                          </>
                        )
                      }
                    </PDFDownloadLink>
                  </td>
                  <td className="p-3 border-l border-[#C2C1C1]">
                    <button
                      onClick={() => handleWordExport(form)}
                      className="bg-[#3D7EB9] hover:bg-[#336FA3] text-white px-3 py-1 rounded inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Word
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#15445A] mb-6">جميع المستخدمين</h2>
      <div className="bg-white rounded-lg shadow-md border border-[#C2C1C1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right">
            <thead className="bg-[#0DA9A6] text-white">
              <tr>
                <th className="p-3 border-l border-[#C2C1C1]">الاسم</th>
                <th className="p-3 border-l border-[#C2C1C1]">البريد الإلكتروني</th>
                <th className="p-3 border-l border-[#C2C1C1]">الدور</th>
                <th className="p-3">خيارات</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t border-[#C2C1C1] hover:bg-[#F9F9F9] transition-colors text-[#15445A]">
                  <td className="p-3 border-l border-[#C2C1C1]">{user.userName}</td>
                  <td className="p-3 border-l border-[#C2C1C1]">{user.email}</td>
                  <td className="p-3 border-l border-[#C2C1C1]">
                    <span className={`px-2 py-1 text-sm rounded-full ${user.role === 'admin' || user.role === 'مشرف'
                      ? 'bg-[#0DA9A6] text-white'
                      : 'bg-gray-200 text-gray-800'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="bg-[#15445A] hover:bg-[#133d52] text-white px-3 py-1 rounded text-sm inline-flex items-center gap-1 transition-colors">
                      <Eye className="w-4 h-4" />
                      عرض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFieldSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#15445A] mb-4">إعدادات الحقول</h2>

      {loading ? (
        <p className="text-[#15445A]">جاري التحميل...</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="p-3 font-bold  bg-white rounded shadow border border-[#0DA9A6] space-y-3 text-[#15445A] text-sm">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Label Input */}
                <div className="flex-1 space-y-1">
                  <label className="font-semibold">العنوان:</label>
                  <input
                    value={field.label}
                    onChange={(e) =>
                      setFields((prev) =>
                        prev.map((f, i) => i === index ? { ...f, label: e.target.value } : f)
                      )
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-[#0DA9A6]"
                  />
                </div>

                {/* Placeholder Input */}
                <div className="flex-1 space-y-1">
                  <label className="font-semibold">نص Placeholder:</label>
                  <input
                    value={field.placeholder}
                    onChange={(e) =>
                      setFields((prev) =>
                        prev.map((f, i) => i === index ? { ...f, placeholder: e.target.value } : f)
                      )
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-[#0DA9A6]"
                  />
                </div>
              </div>

              {/* Required Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.isRequired}
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f, i) => i === index ? { ...f, isRequired: e.target.checked } : f)
                    )
                  }
                />
                <label className="font-medium">حقل إجباري؟</label>
              </div>
            </div>
          ))}

          {/* Save All Button */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
            <button
              onClick={handleAllFieldsUpdate}
              className="w-72 py-3 bg-[#0DA9A6] cursor-pointer text-white rounded-lg text-lg font-bold hover:bg-[#0c8b89] transition-all"
            >
              حفظ جميع التعديلات
            </button>
            <button
              onClick={handleResetFields}
              className="w-72 py-3 bg-[#15445A] cursor-pointer text-white rounded-lg text-lg font-bold hover:bg-[#133d52] transition-all"
            >
              إعادة الحقول إلى الإعدادات الافتراضية
            </button>
          </div>
        </div>
      )}
    </div>
  );


  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return renderStatistics();
      case 'forms':
        return renderForms();
      case 'users':
        return renderUsers();
      case 'fields':
        return renderFieldSettings();
      default:
        return renderStatistics();
    }
  };

  return (
    <div className="min-h-screen bg-[#C2C1C1] flex text-xl" dir="rtl">
      <div className="w-64 bg-[#15445A] text-white flex flex-col">
        <div className="p-6 border-b border-[#0DA9A6]">
          <h1 className="text-2xl font-bold">لوحة تحكم المشرف</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('statistics')}
            className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-right transition-colors ${activeTab === 'statistics'
              ? 'bg-[#0DA9A6] text-white'
              : 'text-gray-300 hover:bg-[#133d52] hover:text-white'
              }`}
          >
            <BarChart3 className="w-5 h-5" />
            الإحصائيات
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-right transition-colors ${activeTab === 'forms'
              ? 'bg-[#0DA9A6] text-white'
              : 'text-gray-300 hover:bg-[#133d52] hover:text-white'
              }`}
          >
            <FileText className="w-5 h-5" />
            النماذج
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-right transition-colors ${activeTab === 'users'
              ? 'bg-[#0DA9A6] text-white'
              : 'text-gray-300 hover:bg-[#133d52] hover:text-white'
              }`}
          >
            <Users className="w-5 h-5" />
            المستخدمين
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg text-right transition-colors ${activeTab === 'fields' ? 'bg-[#0DA9A6] text-white' : 'text-gray-300 hover:bg-[#133d52] hover:text-white'
              }`}
          >
            <Settings className="w-5 h-5" />
            إعدادات الحقول
          </button>
        </nav>
      </div>
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}