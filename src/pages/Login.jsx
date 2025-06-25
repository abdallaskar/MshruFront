import { useState } from 'react';
import { isValidEmail, isValidPassword } from '../../utils/validtionRegstiration';
import { Link, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
  };

  const loginUserHandler = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    const { email, password } = formData;
    let hasErrors = false;

    if (!isValidEmail(email)) {
      setEmailError('يرجى إدخال بريد إلكتروني صحيح (example@example.com)');
      hasErrors = true;
    }

    if (!isValidPassword(password)) {
      setPasswordError('كلمة المرور يجب أن تحتوي 6 خانات أو أكثر، وتحتوي علي الأقل على حرف ورقم');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });

      // نجاح تسجيل الدخول
      const data = response.data;
      login(data.user, data.token);
      if (data.user.role === 'admin') {
        navigate('/admin');
      }
      else {
        navigate('/');
      }

    } catch (error) {
      const serverMsg = error?.response?.data?.message;

      if (serverMsg?.includes('البريد الإلكتروني')) {
        setEmailError(serverMsg); // البريد الإلكتروني غير موجود
      } else if (serverMsg?.toLowerCase().includes('كلمة المرور')) {
        setPasswordError(serverMsg);
      } else {
        setEmailError(serverMsg || 'فشل تسجيل الدخول. حاول مرة أخرى.');
      }

      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 text-[#15445A] px-4" dir="rtl">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-lg lg:max-w-lg xl:max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
          <div className="bg-[#15445A] p-4 text-center">
            <h2 className="text-3xl font-bold text-white">تسجيل الدخول</h2>
          </div>

          <form className="space-y-6 p-6" onSubmit={loginUserHandler}>
            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-semibold text-[#0DA9A6] mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-2 border rounded-md bg-white text-[#15445A] focus:outline-none focus:ring-2 ${emailError
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                  }`}
                placeholder="example@email.com"
                required
              />
              {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-sm font-semibold text-[#0DA9A6] mb-1">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-md bg-white text-[#15445A] focus:outline-none focus:ring-2 ${passwordError
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                    }`}
                  placeholder="********"
                  required
                />
                <span
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 left-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
            </div>

            {/* زر الدخول */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0DA9A6] text-white py-2 rounded-md font-semibold hover:bg-[#0b918e] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>

            {/* رابط إنشاء حساب */}
            <div className="text-center mt-4">
              <p className="text-[#15445A]">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="text-[#0DA9A6] font-semibold hover:underline">
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}