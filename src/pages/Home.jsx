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
      className="min-h-screen pt-6 bg-gradient-to-r from-[#3D7EB9] via-[#0DA9A6] to-[#07A869] text-white text-base md:text-lg"
      dir="rtl"
      style={{ fontFamily: "'Helvetica Neue', 'Sakkal Majalla'" }}
    >
      {/* Header */}
      <header className="p-4 text-center">
        <h1 className="text-3xl md:text-6xl font-bold leading-relaxed">
          مرحباً بك
          <br />
          نموذج اعتماد مشروع/برنامج
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 space-y-8 md:space-y-10">

        {isLoggedIn && (
          <>
            {/* User Info Card */}
            <div className="border border-[#C2C1C1] rounded-xl p-4 md:p-8 shadow text-base md:text-xl">
              <div className="flex flex-col md:flex-row items-center md:space-x-8 md:space-x-reverse space-y-4 md:space-y-0">
                <img
                  src={user?.profileImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'}
                  alt="User"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
                <div className="flex-1 space-y-2 md:space-y-3 mx-2 md:mx-4 text-center md:text-right">
                  <h2 className="text-2xl md:text-3xl font-bold">{user?.userName}</h2>
                  <p className="text-base md:text-lg">{user?.email}</p>
                  <p className="text-base md:text-lg">
                    التاريخ: {new Date().toLocaleDateString('ar-EG')}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Form Buttons */}
            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-6 mt-4 md:mt-6">
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full md:w-auto mx-2 bg-[#15445A] text-white px-6 py-3 md:px-10 md:py-5 rounded-xl text-lg md:text-2xl shadow hover:bg-[#1544AB] transition cursor-pointer flex items-center justify-center gap-3"
                >
                  {/* Admin Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3">
                    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                  </svg>
                  <span>لوحة التحكم</span>
                </button>
              )}

              <button
                onClick={() => navigate('/form', { state: { mode: 'create' } })}
                className="w-full md:w-auto mx-2 bg-[#15445A] text-white px-6 py-3 md:px-10 md:py-5 rounded-xl text-lg md:text-2xl shadow hover:bg-[#1544AB] transition cursor-pointer flex items-center justify-center gap-3"
              >
                {/* Plus Icon */}
                <span className="inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                إضافة نموذج جديد
              </button>
            </div>

            {/* Forms Table */}
            {userForms.length > 0 ? (
              <div className="bg-white border border-[#C2C1C1] rounded-xl shadow overflow-x-auto mb-6 md:mb-8 text-[#15445A]">
                <table className="min-w-full text-right table-auto text-sm md:text-lg">
                  <thead className="bg-gradient-to-r from-[#3D7EB9] via-[#0DA9A6] to-[#07A869] text-white">
                    <tr>
                      <th className="px-4 py-3 md:px-6 md:py-5">اسم المشروع</th>
                      <th className="px-4 py-3 md:px-6 md:py-5">الهدف الرئيسي</th>
                      <th className="px-4 py-3 md:px-6 md:py-5">الفئة المستهدفة</th>
                      <th className="px-4 py-3 md:px-6 md:py-5">التاريخ</th>
                      <th className="px-4 py-3 md:px-6 md:py-5">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userForms.map((form, index) => (
                      <tr
                        key={form._id}
                        className={`${index % 2 === 0 ? 'bg-[#F1F5F9]' : 'bg-white'} hover:bg-[#E2F4F3] transition-colors`}
                      >
                        <td className="px-4 py-3 md:px-6 md:py-5">{form.projectName || '—'}</td>
                        <td className="px-4 py-3 md:px-6 md:py-5">{form.mainProjectObjective || '—'}</td>
                        <td className="px-4 py-3 md:px-6 md:py-5">{form.targetGroup || '—'}</td>
                        <td className="px-4 py-3 md:px-6 md:py-5">{form.authorityDate || '—'}</td>
                        <td className="px-4 py-3 md:px-6 md:py-5 text-center">
                          <button
                            onClick={() => navigate('/form', { state: { mode: 'edit', data: form } })}
                            className="bg-[#0DA9A6] text-white px-3 py-2 md:px-5 md:py-3 rounded text-sm md:text-lg hover:bg-[#0c8b89] transition"
                          >
                            تعديل
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : user.role === 'user' && (
              <div className="text-center py-8 md:py-12 text-gray-200 text-lg md:text-2xl">
                <div className="text-5xl md:text-6xl mb-3">📋</div>
                لا توجد نماذج محفوظة حتى الآن.
              </div>
            )}
          </>
        )}

        {!isLoggedIn && (
          <>
            <div className="text-center py-16 md:py-24 space-y-4 md:space-y-6">
              <button
                onClick={() => navigate('/form', { state: { mode: 'create' } })}
                className="bg-[#15445A] text-[#C1B48A] px-6 py-3 md:px-10 md:py-5 text-xl md:text-4xl rounded shadow hover:bg-[#1544AB] transition cursor-pointer"
              >
                <span className="inline-block align-middle ml-2 text-lg md:text-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                إضافة نموذج جديد
              </button>

              <div className="block h-[5px] w-full bg-gradient-to-r from-[#3D7EB9] via-[#0DA9A6] to-[#07A869]"></div>
            </div>

            <div className="fixed bottom-4 right-4 text-right">
              <button
                onClick={() => navigate('/login')}
                className="bg-[#3D7EB9] text-white px-4 py-2 rounded text-xs md:text-sm shadow hover:bg-[#336fa3] transition cursor-pointer"
              >
                تسجيل دخول المسؤول
              </button>
              <p className="text-xs md:text-lg text-gray-200 mt-1">)خاص بمسؤول الموقع (</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
