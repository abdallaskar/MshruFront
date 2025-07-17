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

    const initialFormData = {
        projectName: { label: '', value: '' },
        ownerName: { label: '', value: '' },
        strategicObjective: { label: '', value: '' },
        performanceIndicator: { label: '', value: '' },
        previousReading: { label: '', value: '' },
        targetReading: { label: '', value: '' },
        email: { label: '', value: '' },
        phone: { label: '', value: '' },
        networkPhone: { label: '', value: '' },
        mainProjectObjective: { label: '', value: '' },
        startDate: { label: '', value: '' },
        endDate: { label: '', value: '' },
        detailedProjectDescription: { label: '', value: '' },
        supportingManagement: { label: '', value: '' },
        supportingAgency: { label: '', value: '' },
        targetGroup: { label: '', value: '' },
        teamMembers: [
            {
                name: { label: '', value: '' },
                position: { label: '', value: '' },
                workType: { label: '', value: '' }
            }
        ],
        firstIndicator: { label: '', value: '' },
        secondIndicator: { label: '', value: '' },
        thirdIndicator: { label: '', value: '' },
        potentialChallenges: { label: '', value: '' },
        uniqueProcedures: { label: '', value: '' },
        projectBudget: { label: '', value: '' },
        authorityName: { label: '', value: '' },
        authorityDate: { label: '', value: '' },
        authoritySignature: { label: '', value: '' },
    };

    const [formData, setFormData] = useState(initialFormData);
    const [formFields, setFormFields] = useState({});
    const [errors, setErrors] = useState({});
    const { mode, data } = location.state || {};
    const [loading, setLoading] = useState(false);

    // ✅ هذا useEffect المسؤول عن labels فقط عند الإضافة الجديدة
    useEffect(() => {
        const fetchFormFields = async () => {
            const res = await axiosInstance.get('/config');
            const fieldsArray = res.data.fields || [];
            const fieldsObject = fieldsArray.reduce((acc, field) => {
                acc[field.fieldKey] = field;
                return acc;
            }, {});
            setFormFields(fieldsObject);

            // ✅ فقط في حالة إضافة جديدة نحدث labels
            if (mode !== 'edit') {
                setFormData(prev => {
                    const updated = { ...prev };
                    for (const key in updated) {
                        if (fieldsObject[key]) {
                            updated[key].label = fieldsObject[key].label;
                        }
                    }
                    return updated;
                });
            }
        };
        fetchFormFields();
    }, [mode]);

    // ✅ عند تعديل البيانات نأخذ label من البيانات القديمة
    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData(prev => {
                const filled = { ...prev };
                for (const key in filled) {
                    if (data[key]) {
                        filled[key].value = data[key].value;
                        filled[key].label = data[key].label || '';
                    }
                }
                if (data.teamMembers) filled.teamMembers = data.teamMembers;
                return filled;
            });
        }
    }, [mode, data]);

    // ✅ input handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: {
                label: prev[name]?.label || '', // ✅ الحفاظ على اللابل القديم فقط
                value: value
            }
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // ✅ team members handlers
    const updateTeamMember = (index, field, value) => {
        const newTeamMembers = [...formData.teamMembers];
        newTeamMembers[index][field] = {
            label: formFields[field]?.label || newTeamMembers[index][field]?.label || '',
            value: value
        };
        setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
        setErrors(prev => ({ ...prev, [`teamMember_${index}_${field}`]: '' }));
    };

    const addTeamMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [
                ...prev.teamMembers,
                {
                    name: { label: '', value: '' },
                    position: { label: '', value: '' },
                    workType: { label: '', value: '' }
                }
            ]
        }));
    };

    const removeTeamMember = (index) => {
        if (formData.teamMembers.length > 1) {
            const updated = formData.teamMembers.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, teamMembers: updated }));
        }
    };

    // ✅ validation before submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        Object.entries(formFields).forEach(([key, { isRequired }]) => {
            if (isRequired && !formData[key]?.value?.trim()) {
                newErrors[key] = 'هذا الحقل مطلوب';
            }
        });

        formData.teamMembers.forEach((member, index) => {
            ['name', 'position', 'workType'].forEach(field => {
                if (!member[field]?.value?.trim()) {
                    newErrors[`teamMember_${index}_${field}`] = 'هذا الحقل مطلوب';
                }
            });
        });

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            toast.error('يرجى تعبئة جميع الحقول المطلوبة', { position: 'top-center' });
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };
            if (mode === 'edit') payload.formId = data._id;

            await axiosInstance.post('/form', payload);
            toast.success(mode === 'edit' ? 'تم تعديل النموذج' : 'تم إنشاء النموذج', { position: 'top-center' });
            setFormData(initialFormData);
            setErrors({});
            navigate('/');
        } catch (err) {
            console.error('خطأ أثناء الإرسال:', err);
        } finally {
            setLoading(false);
        }
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
                                        {formData.projectName?.label || 'اسم المشروع'}
                                    </label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        value={formData.projectName.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.projectName ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'}`}
                                        placeholder={formData.projectName?.placeholder || 'اسم المشروع'}
                                    />
                                    {errors.projectName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
                                    )}
                                </div>

                                {/* Owner Name */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formData.ownerName?.label || 'مالك المشروع ) إدارة / قسم ('}
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.ownerName ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'}`}
                                        placeholder={formData.ownerName?.placeholder || 'اسم الإدارة المالكة'}
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
                                        {formData.strategicObjective?.label || 'الهدف الاستراتيجي'}
                                    </label>
                                    <input
                                        type="text"
                                        name="strategicObjective"
                                        value={formData.strategicObjective.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.strategicObjective
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.strategicObjective?.placeholder || 'أدخل الهدف الاستراتيجي'}
                                    />
                                    {errors.strategicObjective && (
                                        <p className="text-red-500 text-sm mt-1">{errors.strategicObjective}</p>
                                    )}
                                </div>



                                {/* مؤشر الأداء المستهدف */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formData.performanceIndicator?.label || 'مؤشر الأداء المستهدف'}
                                    </label>
                                    <input
                                        type="text"
                                        name="performanceIndicator"
                                        value={formData.performanceIndicator.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.performanceIndicator
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.performanceIndicator?.placeholder || 'أدخل مؤشر الأداء المستهدف'}
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
                                        {formData.previousReading?.label || 'القراءة السابقة للمؤشر'}
                                    </label>
                                    <input
                                        type="text"
                                        name="previousReading"
                                        value={formData.previousReading.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.previousReading
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.previousReading?.placeholder || 'أدخل القراءة السابقة للمؤشر'}
                                    />
                                    {errors.previousReading && (
                                        <p className="text-red-500 text-sm mt-1">{errors.previousReading}</p>
                                    )}
                                </div>

                                {/* القراءة المستهدفة للمؤشر */}
                                <div className="p-2 md:p-4">
                                    <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                        {formData.targetReading?.label || 'القراءة المستهدفة للمؤشر'}
                                    </label>
                                    <input
                                        type="text"
                                        name="targetReading"
                                        value={formData.targetReading.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.targetReading
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.targetReading?.placeholder || 'أدخل القراءة المستهدفة للمؤشر'}
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
                                    {formData.email?.label || 'البريد الإلكتروني'}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email.value}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.email
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.email?.placeholder || 'example@gmail.com'}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* الجوال */}
                            <div className="p-2 md:p-4 border-b md:border-b-0 md:border-l border-[#C2C1C1]">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formData.phone?.label || 'الجوال'}
                                </label>
                                <PhoneInput
                                    country={'sa'}
                                    name="phone"
                                    value={formData.phone.value}
                                    onChange={(phone) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            phone: {
                                                ...prev.phone,
                                                value: phone,
                                            },
                                        }));
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
                                    placeholder={formData.phone?.placeholder || 'رقم الهاتف'}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {/* الهاتف الشبكي */}
                            <div className="p-2 md:p-4">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formData.networkPhone?.label || 'الهاتف الشبكي ) اختياري ('}
                                </label>
                                <input
                                    type="tel"
                                    name="networkPhone"
                                    value={formData.networkPhone.value}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.networkPhone
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.networkPhone?.placeholder || 'الهاتف الشبكي'}
                                />
                                {errors.networkPhone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.networkPhone}</p>
                                )}
                            </div>

                        </div>


                        {/* الهدف الرئيسي */}
                        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-2 md:p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">
                                {formData.mainProjectObjective?.label || 'الهدف الرئيسي للمشروع / البرنامج'}
                            </div>
                            <div className="p-2 md:p-4">
                                <input
                                    type="text"
                                    name="mainProjectObjective"
                                    value={formData.mainProjectObjective.value}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.mainProjectObjective
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.mainProjectObjective?.placeholder || 'أدخل الهدف الرئيسي'}
                                />
                                {errors.mainProjectObjective && (
                                    <p className="text-red-500 text-sm mt-1">{errors.mainProjectObjective}</p>
                                )}
                            </div>

                        </div>

                        {/* فترة التنفيذ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-2 md:p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">
                                {formData.startDate?.label || 'تاريخ البداية'}
                            </div>
                            <div className="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 md:p-4">
                                {/* تاريخ البداية */}
                                <div>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate.value}
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
                                        value={formData.endDate.value}
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
                                {formData.detailedProjectDescription?.label || 'الوصف التفصيلي للمشروع / البرنامج'}
                                {/* <br />يتضمن الأنشطة والمراحل التنفيذية */}
                            </div>
                            <div className="p-2 md:p-4">
                                <textarea
                                    name="detailedProjectDescription"
                                    value={formData.detailedProjectDescription.value}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] resize-none ${errors.detailedProjectDescription
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.detailedProjectDescription?.placeholder || 'أدخل الوصف التفصيلي'}
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
                                    {formData.supportingManagement?.label || 'الإدارة المساندة'}
                                </label>
                                <input
                                    type="text"
                                    name="supportingManagement"
                                    value={formData.supportingManagement.value}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.supportingManagement
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.supportingManagement?.placeholder || 'الإدارة المساندة'}
                                />
                                {errors.supportingManagement && (
                                    <p className="text-red-500 text-sm mt-1">{errors.supportingManagement}</p>
                                )}
                            </div>

                            {/* الجهة الداعمة */}
                            <div className="p-2 md:p-4 border-l border-[#C2C1C1]">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formData.supportingAgency?.label || 'الجهة الداعمة'}
                                </label>
                                <input
                                    type="text"
                                    name="supportingAgency"
                                    value={formData.supportingAgency.value}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.supportingAgency
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.supportingAgency?.placeholder || 'الجهة الداعمة'}
                                />
                                {errors.supportingAgency && (
                                    <p className="text-red-500 text-sm mt-1">{errors.supportingAgency}</p>
                                )}
                            </div>

                            {/* الفئة المستهدفة */}
                            <div className="p-2 md:p-4">
                                <label className="block mb-2 text-white font-semibold bg-[#0DA9A6] p-2 text-center md:text-right rounded">
                                    {formData.targetGroup?.label || 'الفئة المستهدفة'}
                                </label>
                                <input
                                    type="text"
                                    name="targetGroup"
                                    value={formData.targetGroup.value}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.targetGroup
                                        ? 'border-red-500 shadow-md shadow-red-300'
                                        : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.targetGroup?.placeholder || 'الفئة المستهدفة'}
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
                            <h2 className="text-2xl font-bold text-center text-white">فريق العمل بالمشروع / البرنامج</h2>
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
                                                {formData.teamMember_name?.label || 'الاسم'}
                                            </label>
                                            <input
                                                type="text"
                                                value={member.name.value}
                                                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_name`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                    }`}
                                                placeholder={formData.teamMember_name?.placeholder || 'اسم العضو'}
                                            />
                                            {errors[`teamMember_${index}_name`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`teamMember_${index}_name`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[#15445A] font-semibold">
                                                {formData.teamMember_position?.label || 'الوظيفة'}
                                            </label>
                                            <input
                                                type="text"
                                                value={member.position.value}
                                                onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                                                className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_position`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                    }`}
                                                placeholder={formData.teamMember_position?.placeholder || 'الوظيفة'}
                                            />
                                            {errors[`teamMember_${index}_position`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`teamMember_${index}_position`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[#15445A] font-semibold">
                                                {formData.teamMember_workType?.label || 'جهة العمل'}
                                            </label>
                                            <input
                                                type="text"
                                                value={member.workType.value}
                                                onChange={(e) => updateTeamMember(index, 'workType', e.target.value)}
                                                className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_workType`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                    }`}
                                                placeholder={formData.teamMember_workType?.placeholder || 'جهة العمل'}
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
                                                        value={member.name.value}
                                                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_name`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                            }`}
                                                        placeholder={formData.teamMember_name?.placeholder || 'اسم العضو'}
                                                    />
                                                </td>
                                                <td className="px-2 md:px-4 py-3 border-l border-[#C2C1C1]">
                                                    <input
                                                        type="text"
                                                        value={member.position.value}
                                                        onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_position`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                            }`}
                                                        placeholder={formData.teamMember_position?.placeholder || 'الوظيفة'}
                                                    />
                                                </td>
                                                <td className="px-2 md:px-4 py-3 border-l border-[#C2C1C1]">
                                                    <input
                                                        type="text"
                                                        value={member.workType.value}
                                                        onChange={(e) => updateTeamMember(index, 'workType', e.target.value)}
                                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors[`teamMember_${index}_workType`] ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                                            }`}
                                                        placeholder={formData.teamMember_workType?.placeholder || 'جهة العمل'}
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
                            <h2 className="text-2xl font-bold text-center text-white" >مؤشرات الأداء الخاصة بالمشروع / البرنامج</h2>
                        </div>


                        <div className="border-t border-[#C2C1C1]">
                            {/* Challenges Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formData.firstIndicator?.label || 'المؤشر الأول'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="firstIndicator"
                                        value={formData.firstIndicator.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.firstIndicator
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.firstIndicator?.placeholder || 'اذكر المؤشر الأول'}

                                    />
                                    {errors.firstIndicator && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstIndicator}</p>
                                    )}
                                </div>
                            </div>

                            {/* secondIndicator */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formData.secondIndicator?.label || 'المؤشر الثاني'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="secondIndicator"
                                        value={formData.secondIndicator.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.secondIndicator
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.secondIndicator?.placeholder || 'اذكر المؤشر الثاني '}

                                    />
                                    {errors.secondIndicator && (
                                        <p className="text-red-500 text-sm mt-1">{errors.secondIndicator}</p>
                                    )}
                                </div>
                            </div>

                            {/* third indicator*/}
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formData.thirdIndicator?.label || 'الثالث المؤشر'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="thirdIndicator"
                                        value={formData.thirdIndicator.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.thirdIndicator
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.thirdIndicator?.placeholder || 'اذكر المؤشر الثالت  '}

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
                                    {formData.potentialChallenges?.label || 'الصعوبات/التحديات المحتملة'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="potentialChallenges"
                                        value={formData.potentialChallenges.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.potentialChallenges
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.potentialChallenges?.placeholder || 'اذكر الصعوبات والتحديات المحتملة'}

                                    />
                                    {errors.potentialChallenges && (
                                        <p className="text-red-500 text-sm mt-1">{errors.potentialChallenges}</p>
                                    )}
                                </div>
                            </div>

                            {/* Procedures Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formData.uniqueProcedures?.label || 'الإجراءات المقترحة للتعامل معها'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="uniqueProcedures"
                                        value={formData.uniqueProcedures.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.uniqueProcedures
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.uniqueProcedures?.placeholder || 'اذكر الإجراءات المقترحة'}

                                    />
                                    {errors.uniqueProcedures && (
                                        <p className="text-red-500 text-sm mt-1">{errors.uniqueProcedures}</p>
                                    )}
                                </div>
                            </div>

                            {/* Budget Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    {formData.projectBudget?.label || 'الموازنة التقديرية للمشروع/البرنامج'}
                                </div>
                                <div className="p-2 md:p-4">
                                    <input
                                        type="text"
                                        name="projectBudget"
                                        value={formData.projectBudget.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.projectBudget
                                            ? 'border-red-500 shadow-md shadow-red-300'
                                            : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.projectBudget?.placeholder || 'أدخل الموازنة التقديرية'}

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
                                        {formData.authorityName?.label || 'الاسم'}
                                    </label>
                                    <input
                                        type="text"
                                        name="authorityName"
                                        value={formData.authorityName.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authorityName ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.authorityName?.placeholder || 'اسم صاحب الصلاحية'}
                                    />
                                    {errors.authorityName && <p className="text-red-500 text-sm mt-1">{errors.authorityName}</p>}
                                </div>

                                <div>
                                    <label className="block text-[#15445A] font-semibold">
                                        {formData.authorityDate?.label || 'التاريخ'}
                                    </label>
                                    <input
                                        type="date"
                                        name="authorityDate"
                                        value={formData.authorityDate.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authorityDate ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                    />
                                    {errors.authorityDate && <p className="text-red-500 text-sm mt-1">{errors.authorityDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-[#15445A] font-semibold">
                                        {formData.authoritySignature?.label || 'التوقيع'}
                                    </label>
                                    <input
                                        type="text"
                                        name="authoritySignature"
                                        value={formData.authoritySignature.value}
                                        onChange={handleInputChange}
                                        className={`w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authoritySignature ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                            }`}
                                        placeholder={formData.authoritySignature?.placeholder || 'التوقيع'}
                                    />
                                    {errors.authoritySignature && <p className="text-red-500 text-sm mt-1">{errors.authoritySignature}</p>}
                                </div>
                            </div>
                        </div>

                        {/* للديسكتوب: صفوف أعمدة */}
                        <div className="hidden md:grid md:grid-cols-3 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                {formData.authorityName?.label || 'الاسم'}
                            </div>
                            <div className="bg-[#0DA9A6] p-2 md:p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                {formData.authorityDate?.label || 'التاريخ'}
                            </div>
                            <div className="bg-[#0DA9A6] p-2 md:p-4 text-center font-semibold text-white">
                                {formData.authoritySignature?.label || 'التوقيع )اختياري('}
                            </div>
                        </div>

                        <div className="hidden md:grid md:grid-cols-3 border-t border-[#C2C1C1]">
                            <div className="p-2 md:p-4 border-l border-[#C2C1C1]">
                                <input
                                    type="text"
                                    name="authorityName"
                                    value={formData.authorityName.value}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authorityName ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.authorityName?.placeholder || 'اسم صاحب الصلاحية'}
                                />
                                {errors.authorityName && <p className="text-red-500 text-sm mt-1">{errors.authorityName}</p>}
                            </div>

                            <div className="p-2 md:p-4 border-l border-[#C2C1C1]">
                                <input
                                    type="date"
                                    name="authorityDate"
                                    value={formData.authorityDate.value}
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
                                    value={formData.authoritySignature.value}
                                    onChange={handleInputChange}
                                    className={`w-full px-2 md:px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#15445A] ${errors.authoritySignature ? 'border-red-500 shadow-md shadow-red-300' : 'border-[#C2C1C1] focus:ring-[#0DA9A6]'
                                        }`}
                                    placeholder={formData.authoritySignature?.placeholder || 'التوقيع'}
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