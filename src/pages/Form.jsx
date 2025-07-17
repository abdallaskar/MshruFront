import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ar from 'react-phone-input-2/lang/ar.json';
import '../App.css'

export default function Form() {

    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        projectName: '',
        ownerName: '',
        strategicObjective: '',
        performanceIndicator: '',
        previousReading: '',
        targetReading: '',
        email: '',
        phone: '',
        networkPhone: '',
        mainProjectObjective: '',
        startDate: '',
        endDate: '',
        detailedProjectDescription: '',
        supportingManagement: '',
        supportingAgency: '',
        targetGroup: '',
        teamMembers: [{ name: '', position: '', workType: '' }],
        firstIndicator: '',
        secondIndicator: '',
        thirdIndicator: '',
        potentialChallenges: '',
        uniqueProcedures: '',
        projectBudget: '',
        authorityName: '',
        authorityDate: '',
        authoritySignature: ''
    });
    const [formFields, setFormFields] = useState([]);
    useEffect(() => {
        const fetchFormFields = async () => {
            const res = await axiosInstance.get('/config');
            const fieldsArray = res.data.fields || [];

            // نحول ال array لـ object => { projectName: {label, placeholder}, ... }
            const fieldsObject = fieldsArray.reduce((acc, field) => {
                acc[field.fieldKey] = field;
                return acc;
            }, {});
            setFormFields(fieldsObject);
        };
        fetchFormFields();
    }, []);

    // console.log('formFields', formFields);

    const [errors, setErrors] = useState({});
    const { mode, data } = location.state || {};
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData(data);
        }
    }, [mode, data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const updateTeamMember = (index, field, value) => {
        const newTeamMembers = [...formData.teamMembers];
        newTeamMembers[index][field] = value;

        setFormData((prev) => ({
            ...prev,
            teamMembers: newTeamMembers,
        }));

        // إزالة الخطأ لهذا الحقل
        setErrors((prev) => ({
            ...prev,
            [`teamMember_${index}_${field}`]: '',
        }));
    };

    const addTeamMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [...prev.teamMembers, { name: '', position: '', workType: '' }]
        }));
    };

    const removeTeamMember = (index) => {
        if (formData.teamMembers.length > 1) {
            const newTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // ✅ التحقق من الحقول النصية بناءً على formFields
        // console.log('formFields:', formFields);
        Object.values(formFields).forEach(({ fieldKey, isRequired }) => {
            if (isRequired && (!formData[fieldKey] || !formData[fieldKey].trim())) {
                newErrors[fieldKey] = 'هذا الحقل مطلوب';
            }
        });

        // ✅ التحقق من بيانات الفريق
        if (Array.isArray(formData.teamMembers)) {
            formData.teamMembers.forEach((member, index) => {
                if (!member.name.trim()) {
                    newErrors[`teamMember_${index}_name`] = 'هذا الحقل مطلوب';
                }
                if (!member.position.trim()) {
                    newErrors[`teamMember_${index}_position`] = 'هذا الحقل مطلوب';
                }
                if (!member.workType.trim()) {
                    newErrors[`teamMember_${index}_workType`] = 'هذا الحقل مطلوب';
                }
            });
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('يرجى تعبئة جميع الحقول المطلوبة', { position: "top-center" });
            return;
        }
        setLoading(true);

        try {
            if (mode === 'edit') {
                await axiosInstance.post('/form', { ...formData, formId: formData._id });
                toast.success('تم تعديل النموذج', {
                    position: "top-center",
                    className: 'custom-toast',
                });
            } else {
                await axiosInstance.post('/form', formData);
                toast.success('تم إنشاء النموذج', {
                    position: "top-center",
                    className: 'custom-toast',
                });
            }

            setFormData({
                projectName: '',
                ownerName: '',
                strategicObjective: '',
                performanceIndicator: '',
                previousReading: '',
                targetReading: '',
                email: '',
                phone: '',
                networkPhone: '',
                mainProjectObjective: '',
                startDate: '',
                endDate: '',
                detailedProjectDescription: '',
                supportingManagement: '',
                supportingAgency: '',
                targetGroup: '',
                teamMembers: [{ name: '', position: '', workType: '' }],
                firstIndicator: '',
                secondIndicator: '',
                thirdIndicator: '',
                potentialChallenges: '',
                uniqueProcedures: '',
                projectBudget: '',
                authorityName: '',
                authorityDate: '',
                authoritySignature: ''
            });

            setErrors({});
            navigate('/');
        } catch (error) {
            console.error('خطأ أثناء الإرسال:', error);
        }

        setLoading(false);
    };




    return (
        <div className="min-h-screen bg-[#15445A] text-[#15445A] px-2 md:px-4 py-8 text-lg" dir="rtl">
            <div className="max-w-full md:max-w-[82%] mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* صندوق عنوان المشروع */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-2 md:p-4">
                            <h2 className="text-3xl font-bold text-center text-white">نموذج اعتماد مشروع / برنامج</h2>
                        </div>

                        {/* الصفوف داخل الجدول */}
                        <div className="border-t border-[#C2C1C1]">
                            {/* الصف 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#C2C1C1]">

                                {/* Project Name */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formFields.projectName?.label || 'اسم المشروع'}
                                    </label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.projectName ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'}`}
                                        placeholder={formFields.projectName?.placeholder || 'اسم المشروع'}
                                    />
                                    {errors.projectName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
                                    )}
                                </div>

                                {/* Owner Name */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formFields.ownerName?.label || 'مالك المشروع ) إدارة / قسم ('}
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.ownerName ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'}`}
                                        placeholder={formFields.ownerName?.placeholder || 'اسم الإدارة المالكة'}
                                    />
                                    {errors.ownerName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
                                    )}
                                </div>

                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#C2C1C1]">

                                {/* الهدف الاستراتيجي */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formFields.strategicObjective?.label || 'الهدف الاستراتيجي'}
                                    </label>
                                    <input
                                        type="text"
                                        name="strategicObjective"
                                        value={formData.strategicObjective}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.strategicObjective
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.strategicObjective?.placeholder || 'أدخل الهدف الاستراتيجي'}
                                    />
                                    {errors.strategicObjective && (
                                        <p className="text-red-500 text-sm mt-1">{errors.strategicObjective}</p>
                                    )}
                                </div>

                                {/* مؤشر الأداء المستهدف */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formFields.performanceIndicator?.label || 'مؤشر الأداء المستهدف'}
                                    </label>
                                    <input
                                        type="text"
                                        name="performanceIndicator"
                                        value={formData.performanceIndicator}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.performanceIndicator
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.performanceIndicator?.placeholder || 'أدخل مؤشر الأداء المستهدف'}
                                    />
                                    {errors.performanceIndicator && (
                                        <p className="text-red-500 text-sm mt-1">{errors.performanceIndicator}</p>
                                    )}
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#C2C1C1]">

                                {/* القراءة السابقة للمؤشر */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formFields.previousReading?.label || 'القراءة السابقة للمؤشر'}
                                    </label>
                                    <input
                                        type="text"
                                        name="previousReading"
                                        value={formData.previousReading}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.previousReading
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.previousReading?.placeholder || 'أدخل القراءة السابقة للمؤشر'}
                                    />
                                    {errors.previousReading && (
                                        <p className="text-red-500 text-sm mt-1">{errors.previousReading}</p>
                                    )}
                                </div>

                                {/* القراءة المستهدفة للمؤشر */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formFields.targetReading?.label || 'القراءة المستهدفة للمؤشر'}
                                    </label>
                                    <input
                                        type="text"
                                        name="targetReading"
                                        value={formData.targetReading}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.targetReading
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.targetReading?.placeholder || 'أدخل القراءة المستهدفة للمؤشر'}
                                    />
                                    {errors.targetReading && (
                                        <p className="text-red-500 text-sm mt-1">{errors.targetReading}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* صندوق بيانات التواصل */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-2 md:p-4">
                            <h2 className="text-2xl font-bold text-center text-white">بيانات التواصل</h2>
                        </div>

                        {/* الحقول الثلاثة */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#C2C1C1]">

                            {/* البريد الإلكتروني */}
                            <div className="p-2 md:p-4 border-b md:border-b-0 md:border-l border-[#C2C1C1]">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formFields.email?.label || 'البريد الإلكتروني'}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.email
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.email?.placeholder || 'example@gmail.com'}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* الجوال */}
                            <div className="p-2 md:p-4 border-b md:border-b-0 md:border-l border-[#C2C1C1]">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formFields.phone?.label || 'الجوال'}
                                </label>
                                <PhoneInput
                                    country={'sa'}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(phone) => {
                                        setFormData((prev) => ({ ...prev, phone }));
                                        setErrors((prev) => ({ ...prev, phone: '' }));
                                    }}
                                    inputClass={`!w-full !px-2 md:!px-4 !py-2 !border !rounded-md !focus:outline-none !focus:ring-2 !text-[#15445A] ${errors.phone
                                        ? '!border-red-500 !shadow-md !shadow-red-300'
                                        : '!border-[#C2C1C1] !focus:ring-[#0DA9A6]'
                                        }`}
                                    containerClass="text-right"
                                    buttonClass=""
                                    enableSearch
                                    localization={ar}
                                    placeholder={formFields.phone?.placeholder || 'رقم الهاتف'}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {/* الهاتف الشبكي */}
                            <div className="p-2 md:p-4">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formFields.networkPhone?.label || 'الهاتف الشبكي ) اختياري ('}
                                </label>
                                <input
                                    type="tel"
                                    name="networkPhone"
                                    value={formData.networkPhone}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.networkPhone
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.networkPhone?.placeholder || 'الهاتف الشبكي'}
                                />
                                {errors.networkPhone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.networkPhone}</p>
                                )}
                            </div>

                        </div>


                        {/* الهدف الرئيسي */}
                        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-2 md:p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">
                                {formFields.mainProjectObjective?.label || 'الهدف الرئيسي للمشروع / البرنامج'}
                            </div>
                            <div className="p-2 md:p-4">
                                <input
                                    type="text"
                                    name="mainProjectObjective"
                                    value={formData.mainProjectObjective}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.mainProjectObjective
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.mainProjectObjective?.placeholder || 'أدخل الهدف الرئيسي'}
                                />
                                {errors.mainProjectObjective && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mainProjectObjective}</p>
                                )}
                            </div>

                        </div>

                        {/* فترة التنفيذ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-2 md:p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">
                                {formFields.startDate?.label || 'تاريخ البداية'}
                            </div>
                            <div className="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:p-4">
                                {/* تاريخ البداية */}
                                <div>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.startDate
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                                    )}
                                </div>

                                {/* تاريخ النهاية */}
                                <div>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.endDate
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                    />
                                    {errors.endDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                                    )}
                                </div>
                            </div>

                        </div>



                        {/* الوصف التفصيلي */}
                        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-2 md:p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">
                                {formFields.detailedProjectDescription?.label || 'الوصف التفصيلي للمشروع / البرنامج'}
                                <br />يتضمن الأنشطة والمراحل التنفيذية
                            </div>
                            <div className="p-2 md:p-4">
                                <textarea
                                    name="detailedProjectDescription"
                                    value={formData.detailedProjectDescription}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] resize-none ${errors.detailedProjectDescription
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.detailedProjectDescription?.placeholder || 'أدخل الوصف التفصيلي'}
                                />
                                {errors.detailedProjectDescription && (
                                    <p className="text-red-500 text-sm mt-1">{errors.detailedProjectDescription}</p>
                                )}
                            </div>

                        </div>
                        {/* الإدارة - الجهة الداعمة - الفئة المستهدفة */}
                        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#C2C1C1]">

                            {/* الإدارة المساندة */}
                            <div className="p-2 md:p-4 border-l border-[#C2C1C1]">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formFields.supportingManagement?.label || 'الإدارة المساندة'}
                                </label>
                                <input
                                    type="text"
                                    name="supportingManagement"
                                    value={formData.supportingManagement}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.supportingManagement
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.supportingManagement?.placeholder || 'الإدارة المساندة'}
                                />
                                {errors.supportingManagement && (
                                    <p className="text-red-500 text-sm mt-1">{errors.supportingManagement}</p>
                                )}
                            </div>

                            {/* الجهة الداعمة */}
                            <div className="p-2 md:p-4 border-l border-[#C2C1C1]">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formFields.supportingAgency?.label || 'الجهة الداعمة'}
                                </label>
                                <input
                                    type="text"
                                    name="supportingAgency"
                                    value={formData.supportingAgency}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.supportingAgency
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.supportingAgency?.placeholder || 'الجهة الداعمة'}
                                />
                                {errors.supportingAgency && (
                                    <p className="text-red-500 text-sm mt-1">{errors.supportingAgency}</p>
                                )}
                            </div>

                            {/* الفئة المستهدفة */}
                            <div className="p-2 md:p-4">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formFields.targetGroup?.label || 'الفئة المستهدفة'}
                                </label>
                                <input
                                    type="text"
                                    name="targetGroup"
                                    value={formData.targetGroup}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.targetGroup
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.targetGroup?.placeholder || 'الفئة المستهدفة'}
                                />
                                {errors.targetGroup && (
                                    <p className="text-red-500 text-sm mt-1">{errors.targetGroup}</p>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* فريق العمل */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-2 md:p-4">
                            <h2 className="text-2xl font-bold text-center text-white">فريق العمل</h2>
                        </div>

                        <div className="border-t border-[#C2C1C1]">
                            {/* للموبايل: عرض عمودي لكل عضو */}
                            <div className="md:hidden divide-y divide-[#C2C1C1]">
                                {formData.teamMembers.map((member, index) => (
                                    <div key={index} className="p-2 space-y-2">
                                        {/* رقم العضو */}
                                        <div className="font-semibold text-[#0DA9A6]">العضو رقم: {index + 1}</div>

                                        <div>
                                            <label className="block text-[#15445A] font-semibold">
                                                {formFields.teamMember_name?.label || 'الاسم'}
                                            </label>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_name`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                    }`}
                                                placeholder={formFields.teamMember_name?.placeholder || 'اسم العضو'}
                                            />
                                            {errors[`teamMember_${index}_name`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`teamMember_${index}_name`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[#15445A] font-semibold">
                                                {formFields.teamMember_position?.label || 'الوظيفة'}
                                            </label>
                                            <input
                                                type="text"
                                                value={member.position}
                                                onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                                                className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_position`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                    }`}
                                                placeholder={formFields.teamMember_position?.placeholder || 'الوظيفة'}
                                            />
                                            {errors[`teamMember_${index}_position`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`teamMember_${index}_position`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[#15445A] font-semibold">
                                                {formFields.teamMember_workType?.label || 'جهة العمل'}
                                            </label>
                                            <input
                                                type="text"
                                                value={member.workType}
                                                onChange={(e) => updateTeamMember(index, 'workType', e.target.value)}
                                                className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_workType`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                    }`}
                                                placeholder={formFields.teamMember_workType?.placeholder || 'جهة العمل'}
                                            />
                                            {errors[`teamMember_${index}_workType`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`teamMember_${index}_workType`]}</p>
                                            )}
                                        </div>

                                        {/* زر حذف */}
                                        {formData.teamMembers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTeamMember(index)}
                                                className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all font-medium w-full"
                                            >
                                                حذف العضو
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* للديسكتوب: جدول كامل */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-[#0DA9A6] text-white">
                                            <th className="px-2 md:px-4 py-3 text-center font-semibold border-l border-[#C2C1C1]">م</th>
                                            <th className="px-2 md:px-4 py-3 text-center font-semibold border-l border-[#C2C1C1]">الاسم</th>
                                            <th className="px-2 md:px-4 py-3 text-center font-semibold border-l border-[#C2C1C1]">الوظيفة</th>
                                            <th className="px-2 md:px-4 py-3 text-center font-semibold border-l border-[#C2C1C1]">جهة العمل</th>
                                            <th className="px-2 md:px-4 py-3 text-center font-semibold">العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {formData.teamMembers.map((member, index) => (
                                            <tr key={index} className="border-b border-[#C2C1C1]">
                                                <td className="px-2 md:px-4 py-3 text-center border-l border-[#C2C1C1] font-medium">{index + 1}</td>
                                                <td className="px-2 md:px-4 py-3 border-l border-[#C2C1C1]">
                                                    <input
                                                        type="text"
                                                        value={member.name}
                                                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_name`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                            }`}
                                                        placeholder={formFields.teamMember_name?.placeholder || 'اسم العضو'}
                                                    />
                                                </td>
                                                <td className="px-2 md:px-4 py-3 border-l border-[#C2C1C1]">
                                                    <input
                                                        type="text"
                                                        value={member.position}
                                                        onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_position`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                            }`}
                                                        placeholder={formFields.teamMember_position?.placeholder || 'الوظيفة'}
                                                    />
                                                </td>
                                                <td className="px-2 md:px-4 py-3 border-l border-[#C2C1C1]">
                                                    <input
                                                        type="text"
                                                        value={member.workType}
                                                        onChange={(e) => updateTeamMember(index, 'workType', e.target.value)}
                                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_workType`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                            }`}
                                                        placeholder={formFields.teamMember_workType?.placeholder || 'جهة العمل'}
                                                    />
                                                </td>
                                                <td className="px-2 md:px-4 py-3 text-center">
                                                    {formData.teamMembers.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTeamMember(index)}
                                                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all font-medium"
                                                        >
                                                            حذف
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* زر إضافة عضو جديد */}
                            <div className="p-2 md:p-4">
                                <button
                                    type="button"
                                    onClick={addTeamMember}
                                    className="px-2 md:px-4 py-2 bg-[#0DA9A6] text-white rounded-md hover:bg-[#0C8B8A] transition-all font-medium w-full md:w-auto"
                                >
                                    إضافة عضو جديد
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Performance Indicators Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-2 md:p-4">
                            <h2 className="text-2xl font-bold text-center text-white">مؤشرات الأداء</h2>
                        </div>


                        <div className="border-t border-[#C2C1C1]">
                            {/* Challenges Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formFields.firstIndicator?.label || 'المؤشر الأول'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="firstIndicator"
                                        value={formData.firstIndicator}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.firstIndicator
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.firstIndicator?.placeholder || 'اذكر المؤشر الأول'}

                                    />
                                    {errors.firstIndicator && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstIndicator}</p>
                                    )}
                                </div>
                            </div>

                            {/* secondIndicator */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formFields.secondIndicator?.label || 'المؤشر الثاني'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="secondIndicator"
                                        value={formData.secondIndicator}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.secondIndicator
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.secondIndicator?.placeholder || 'اذكر المؤشر الثاني '}

                                    />
                                    {errors.secondIndicator && (
                                        <p className="text-red-500 text-sm mt-1">{errors.secondIndicator}</p>
                                    )}
                                </div>
                            </div>

                            {/* third indicator*/}
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formFields.thirdIndicator?.label || 'الثالث المؤشر'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="thirdIndicator"
                                        value={formData.thirdIndicator}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.thirdIndicator
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.thirdIndicator?.placeholder || 'اذكر المؤشر الثالت  '}

                                    />
                                    {errors.thirdIndicator && (
                                        <p className="text-red-500 text-sm mt-1">{errors.thirdIndicator}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Additional Information Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-2 md:p-4">
                            <h2 className="text-2xl font-bold text-center text-white">معلومات إضافية</h2>
                        </div>

                        <div className="border-t border-[#C2C1C1]">
                            {/* Challenges Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formFields.potentialChallenges?.label || 'الصعوبات/التحديات المحتملة'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="potentialChallenges"
                                        value={formData.potentialChallenges}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.potentialChallenges
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.potentialChallenges?.placeholder || 'اذكر الصعوبات والتحديات المحتملة'}

                                    />
                                    {errors.potentialChallenges && (
                                        <p className="text-red-500 text-sm mt-1">{errors.potentialChallenges}</p>
                                    )}
                                </div>
                            </div>

                            {/* Procedures Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formFields.uniqueProcedures?.label || 'الإجراءات المقترحة للتعامل معها'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="uniqueProcedures"
                                        value={formData.uniqueProcedures}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.uniqueProcedures
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.uniqueProcedures?.placeholder || 'اذكر الإجراءات المقترحة'}

                                    />
                                    {errors.uniqueProcedures && (
                                        <p className="text-red-500 text-sm mt-1">{errors.uniqueProcedures}</p>
                                    )}
                                </div>
                            </div>

                            {/* Budget Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formFields.projectBudget?.label || 'الموازنة التقديرية للمشروع/البرنامج'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="projectBudget"
                                        value={formData.projectBudget}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.projectBudget
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.projectBudget?.placeholder || 'أدخل الموازنة التقديرية'}

                                    />
                                    {errors.projectBudget && (
                                        <p className="text-red-500 text-sm mt-1">{errors.projectBudget}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Authority Approval Table */}
                    {/* اعتماد صاحب الصلاحية */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-2 md:p-4">
                            <h2 className="text-2xl font-bold text-center text-white">اعتماد صاحب الصلاحية</h2>
                        </div>

                        {/* للموبايل: عرض عمودي */}
                        <div className="md:hidden divide-y divide-[#C2C1C1]">
                            <div className="p-2 space-y-2">
                                <div>
                                    <label className="block text-[#15445A] font-semibold">
                                        {formFields.authorityName?.label || 'الاسم'}
                                    </label>
                                    <input
                                        type="text"
                                        name="authorityName"
                                        value={formData.authorityName}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authorityName ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.authorityName?.placeholder || 'اسم صاحب الصلاحية'}
                                    />
                                    {errors.authorityName && <p className="text-red-500 text-sm mt-1">{errors.authorityName}</p>}
                                </div>

                                <div>
                                    <label className="block text-[#15445A] font-semibold">
                                        {formFields.authorityDate?.label || 'التاريخ'}
                                    </label>
                                    <input
                                        type="date"
                                        name="authorityDate"
                                        value={formData.authorityDate}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authorityDate ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                    />
                                    {errors.authorityDate && <p className="text-red-500 text-sm mt-1">{errors.authorityDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-[#15445A] font-semibold">
                                        {formFields.authoritySignature?.label || 'التوقيع'}
                                    </label>
                                    <input
                                        type="text"
                                        name="authoritySignature"
                                        value={formData.authoritySignature}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authoritySignature ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formFields.authoritySignature?.placeholder || 'التوقيع'}
                                    />
                                    {errors.authoritySignature && <p className="text-red-500 text-sm mt-1">{errors.authoritySignature}</p>}
                                </div>
                            </div>
                        </div>

                        {/* للديسكتوب: صفوف أعمدة */}
                        <div className="hidden md:grid md:grid-cols-3 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                {formFields.authorityName?.label || 'الاسم'}
                            </div>
                            <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                {formFields.authorityDate?.label || 'التاريخ'}
                            </div>
                            <div className="bg-[#0DA9A6] p-2 md:p-4 text-center font-semibold text-white">
                                {formFields.authoritySignature?.label || 'التوقيع )اختياري('}
                            </div>
                        </div>

                        <div className="hidden md:grid md:grid-cols-3 border-t border-[#C2C1C1]">
                            <div className="p-2 md:p-4 border-l border-[#C2C1C1]">
                                <input
                                    type="text"
                                    name="authorityName"
                                    value={formData.authorityName}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authorityName ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.authorityName?.placeholder || 'اسم صاحب الصلاحية'}
                                />
                                {errors.authorityName && <p className="text-red-500 text-sm mt-1">{errors.authorityName}</p>}
                            </div>

                            <div className="p-2 md:p-4 border-l border-[#C2C1C1]">
                                <input
                                    type="date"
                                    name="authorityDate"
                                    value={formData.authorityDate}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authorityDate ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                />
                                {errors.authorityDate && <p className="text-red-500 text-sm mt-1">{errors.authorityDate}</p>}
                            </div>

                            <div className="p-2 md:p-4">
                                <input
                                    type="text"
                                    name="authoritySignature"
                                    value={formData.authoritySignature}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authoritySignature ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formFields.authoritySignature?.placeholder || 'التوقيع'}
                                />
                                {errors.authoritySignature && <p className="text-red-500 text-sm mt-1">{errors.authoritySignature}</p>}
                            </div>
                        </div>
                    </div>



                    {/* Submit Button */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-3 bg-gradient-to-r from-[#0DA9A6] to-[#0C8B8A] text-white rounded-lg font-bold text-lg hover:from-[#0C8B8A] hover:to-[#0B7C7B] transition-all shadow-lg transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                            >
                                {loading ? 'جاري التقديم...' : 'تقديم النموذج'}
                            </button>
                            <p className="text-sm text-gray-600 mt-2">
                                بالضغط على "تقديم النموذج" فإنك توافق على صحة البيانات المدخلة
                            </p>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    );
}