import { useState } from 'react';
import { isValidEmail, isValidPassword } from '../../utils/validtionRegstiration';
import { Link, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const registerUserHandler = async (e) => {
        e.preventDefault();
        setErrors({ userName: '', email: '', password: '', confirmPassword: '' });
        setSuccessMessage('');

        const { userName, email, password, confirmPassword } = formData;
        let hasErrors = false;
        let newErrors = {};

        if (!userName || userName.trim().length < 2) {
            newErrors.userName = 'الاسم يجب أن يكون على الأقل حرفين';
            hasErrors = true;
        }

        if (!isValidEmail(email)) {
            newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح (example@example.com)';
            hasErrors = true;
        }

        if (!isValidPassword(password)) {
            newErrors.password = 'كلمة المرور يجب أن تحتوي 6 خانات أو أكثر، وتحتوي علي الاقل علي حرف ورقم';
            hasErrors = true;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axiosInstance.post('auth/register', { userName, email, password });

            if (response.status === 201) {
                setSuccessMessage('تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.');
                login(response.data.user, response.data.token);

                setFormData({ userName: '', email: '', password: '', confirmPassword: '' });

                setTimeout(() => navigate('/'), 800);
            }
        } catch (error) {
            const serverMsg = error?.response?.data?.message;
            if (serverMsg?.includes('البريد')) {
                setErrors((prev) => ({ ...prev, email: serverMsg }));
            } else {
                setErrors((prev) => ({ ...prev, email: serverMsg || 'حدث خطأ في الاتصال. تأكد من الشبكة وحاول مجددًا.' }));
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#F9F9F9] py-8 text-[#15445A] px-4" dir="rtl">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-lg lg:max-w-lg xl:max-w-lg mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                    <div className="bg-[#15445A] p-4 text-center">
                        <h2 className="text-3xl font-bold text-white">إنشاء حساب جديد</h2>
                    </div>

                    {successMessage && (
                        <div className="p-4 text-green-700 bg-green-100 border border-green-300 text-center">
                            {successMessage}
                        </div>
                    )}

                    <form className="space-y-6 p-6" onSubmit={registerUserHandler}>
                        {/* الاسم الكامل */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0DA9A6] mb-1">الاسم الثلاثي</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName || ''}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-4 py-2 border rounded-md bg-white text-[#15445A] focus:outline-none focus:ring-2 ${errors.fullName
                                    ? 'border-red-400 focus:ring-red-200'
                                    : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                    }`}
                                placeholder="ادخل اسمك"
                                required
                            />
                            {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
                        </div>

                        {/* البريد الإلكتروني */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0DA9A6] mb-1">البريد الإلكتروني</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-4 py-2 border rounded-md bg-white text-[#15445A] focus:outline-none focus:ring-2 ${errors.email
                                    ? 'border-red-400 focus:ring-red-200'
                                    : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                    }`}
                                placeholder="ali@gmail.com"
                                required
                            />
                            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        {/* كلمة المرور */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0DA9A6] mb-1">كلمة المرور</label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password || ''}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 border rounded-md bg-white text-[#15445A] focus:outline-none focus:ring-2 ${errors.password
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder="ادخل كلمة سر 6 أحرف على الأقل وتحتوي علي ورقم، "
                                    required

                                />
                                {/* Toggle Icon */}
                                <span
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 left-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                        </div>

                        {/* تأكيد كلمة المرور */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0DA9A6] mb-1">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword || ''}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 border rounded-md bg-white text-[#15445A] focus:outline-none focus:ring-2 ${errors.confirmPassword
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder="أعد كتابة كلمة السر"
                                    required
                                />

                                {/* Toggle Icon */}
                                <span
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 left-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* زر التسجيل */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0DA9A6] text-white py-2 rounded-md font-semibold hover:bg-[#0b918e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'جاري التسجيل...' : 'تسجيل'}
                        </button>

                        {/* رابط تسجيل الدخول */}
                        <div className="text-center mt-4">
                            <p className="text-[#15445A]">
                                لديك حساب بالفعل؟{' '}
                                <Link to="/login" className="text-[#0DA9A6] font-semibold hover:underline">
                                    تسجيل الدخول
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}