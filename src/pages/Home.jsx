import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [userForms, setUserForms] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserForms([]);
      return;
    }

    const fetchUserForms = async () => {
      try {
        const res = await axiosInstance.get('/form');
        setUserForms(res.data);
      } catch (err) {
        console.error('فشل في جلب النماذج:', err);
        const errorMessage =
          err?.response?.data?.message || 'حدث خطأ غير متوقع أثناء تحميل البيانات';
        toast.error(errorMessage);
      }
    };

    fetchUserForms();
  }, [isLoggedIn]);

  return (
    <div
      className="min-h-screen pt-6 bg-[#F3F7FA] text-[#15445A] text-lg"
      dir="rtl"
      style={{ fontFamily: "'Helvetica Neue', 'Sakkal Majalla'" }}
    >
      {/* Header */}
      <header className="p-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold">مرحباً بك</h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-10">
        {isLoggedIn && (
          <>
            {/* User Info Card */}
            <div className="bg-white border border-[#C2C1C1] rounded-xl p-8 shadow text-xl">
              <div className="flex items-center space-x-8 space-x-reverse">
                <img
                  src={user?.profileImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
                  alt="User"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="flex-1 space-y-3 mx-4">
                  <h2 className="text-3xl font-bold">{user?.userName}</h2>
                  <p className="text-lg text-gray-700">{user?.email}</p>
                  <p className="text-lg text-gray-500">
                    التاريخ: {new Date().toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Form Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
              {user.role === 'admin' && (

                <button
                  onClick={() => navigate('/admin')}
                  className="mx-5 bg-gradient-to-r from-[#3D7EB9] via-[#0DA9A6] to-[#07A869] text-white px-5 py-5 rounded-xl text-2xl shadow hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3">
                    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                  </svg>
                  <span>لوحة التحكم</span>
                </button>
              )}

              <button
                onClick={() => navigate('/form', { state: { mode: 'create' } })}
                className="bg-[#07A869] text-white px-10 py-5 mx-5 rounded-xl text-2xl shadow hover:bg-[#05975f] transition-all cursor-pointer"
              >
                <span className="inline-block align-middle ml-2 text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                إضافة نموذج جديد
              </button>
            </div>

            {/* Forms Table */}
            {userForms.length > 0 ? (
              <div className="bg-white border border-[#C2C1C1] rounded-xl shadow overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-right table-auto text-lg">
                    <thead className="bg-gradient-to-r from-[#3D7EB9] via-[#0DA9A6] to-[#07A869] text-white text-xl">
                      <tr>
                        <th className="px-6 py-5">اسم المشروع</th>
                        <th className="px-6 py-5">الهدف الرئيسي</th>
                        <th className="px-6 py-5">الفئة المستهدفة</th>
                        <th className="px-6 py-5">التاريخ</th>
                        <th className="px-6 py-5">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userForms.map((form, index) => (
                        <tr
                          key={form._id}
                          className={`${index % 2 === 0 ? 'bg-[#F1F5F9]' : 'bg-white'
                            } hover:bg-[#E2F4F3] transition-colors`}
                        >
                          <td className="px-6 py-5">{form.projectName || '—'}</td>
                          <td className="px-6 py-5">{form.mainProjectObjective || '—'}</td>
                          <td className="px-6 py-5">{form.targetGroup || '—'}</td>
                          <td className="px-6 py-5">{form.authorityDate || '—'}</td>
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() =>
                                navigate('/form', {
                                  state: { mode: 'edit', data: form },
                                })
                              }
                              className="bg-[#0DA9A6] text-white px-5 py-3 rounded text-lg hover:bg-[#0c8b89] transition"
                            >
                              تعديل
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (

              user.role === 'user' ?
                (<div className="text-center py-12 text-gray-500 text-2xl">
                  <div className="text-6xl mb-4">📋</div>
                  لا توجد نماذج محفوظة حتى الآن.
                </div>)
                : (null))
            }


          </>
        )}

        {!isLoggedIn && (
          <div className="text-center py-24 space-y-6">
            <button
              onClick={() => navigate('/form', { state: { mode: 'create' } })}
              className="bg-[#0DA9A6] text-white px-10 py-5 mx-4 rounded-xl cursor-pointer text-2xl shadow hover:bg-[#07A869] transition-all"
            >
              <span className="inline-block align-middle ml-2 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              إضافة نموذج جديد
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#3D7EB9] text-white px-10 py-5 mx-5 rounded-xl cursor-pointer text-2xl shadow hover:bg-[#336fa3] transition-all"
            >
              تسجيل الدخول الآن
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
