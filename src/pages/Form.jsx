import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ar from 'react-phone-input-2/lang/ar.json';

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
        implementationPeriod: '',
        detailedProjectDescription: '',
        supportingManagement: '',
        supportingAgency: '',
        targetGroup: '',
        teamMembers: [{ name: '', position: '', workType: '' }],
        performanceIndicators: [
            { indicator: 'المؤشر الأول', value: '' },
            { indicator: 'المؤشر الثاني', value: '' },
            { indicator: 'المؤشر الثالث', value: '' }
        ],
        potentialChallenges: '',
        uniqueProcedures: '',
        projectBudget: '',
        authorityName: '',
        authorityDate: '',
        authoritySignature: ''
    });
    const { mode, data } = location.state || {};
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData(data); // prefill for edit mode
        }
    }, [mode, data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const updateTeamMember = (index, field, value) => {
        const newTeamMembers = [...formData.teamMembers];
        newTeamMembers[index][field] = value;
        setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
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

    const updatePerformanceIndicator = (index, field, value) => {
        const newIndicators = [...formData.performanceIndicators];
        newIndicators[index][field] = value;
        setFormData(prev => ({ ...prev, performanceIndicators: newIndicators }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'edit') {
                await axiosInstance.post('/form', { ...formData, formId: formData._id });
                toast.success('تم تعديل النموذج');
            } else {
                await axiosInstance.post('/form', formData);
                toast.success('تم إنشاء النموذج');
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
                implementationPeriod: '',
                detailedProjectDescription: '',
                supportingManagement: '',
                supportingAgency: '',
                targetGroup: '',
                teamMembers: [{ name: '', position: '', workType: '' }],
                performanceIndicators: [
                    { indicator: 'المؤشر الأول', value: '' },
                    { indicator: 'المؤشر الثاني', value: '' },
                    { indicator: 'المؤشر الثالث', value: '' }
                ],
                potentialChallenges: '',
                uniqueProcedures: '',
                projectBudget: '',
                authorityName: '',
                authorityDate: '',
                authoritySignature: ''
            })
            navigate('/');
        } catch (error) {
            console.error('خطأ أثناء الإرسال:', error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#15445A] text-[#15445A] px-4 py-8 text-lg" dir="rtl">
            <div className="max-w-[82%] mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* صندوق عنوان المشروع */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-4">
                            <h2 className="text-3xl font-bold text-center text-white">نموذج اعتماد مشروع / برنامج</h2>
                        </div>

                        {/* الصفوف داخل الجدول */}
                        <div className="border-t border-[#C2C1C1]">
                            {/* الصف 1 */}
                            <div className="grid grid-cols-2">
                                <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">اسم المشروع / البرنامج</div>
                                <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center"> مالك المشروع ) إداراة / قسم ( </div>
                            </div>

                            <div className="grid grid-cols-2 border-t border-[#C2C1C1]">
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="أدخل اسم المشروع / البرنامج"
                                        required
                                    />
                                </div>
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="اسم الإدارة المالكة"
                                        required
                                    />
                                </div>
                            </div>

                            {/* الصف 2 */}
                            <div className="grid grid-cols-2 border-t border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">الهدف الاستراتيجي</div>
                                <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center">مؤشر الأداء المستهدف</div>
                            </div>

                            <div className="grid grid-cols-2 border-t border-[#C2C1C1]">
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="strategicObjective"
                                        value={formData.strategicObjective}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="أدخل الهدف الاستراتيجي"
                                        required
                                    />
                                </div>
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="performanceIndicator"
                                        value={formData.performanceIndicator}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="أدخل مؤشر الأداء المستهدف"
                                        required
                                    />
                                </div>
                            </div>

                            {/* الصف 3 */}
                            <div className="grid grid-cols-2 border-t border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">القراءة السابقة للمؤشر</div>
                                <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center">القراءة المستهدفة للمؤشر</div>
                            </div>

                            <div className="grid grid-cols-2 border-t border-[#C2C1C1]">
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="previousReading"
                                        value={formData.previousReading}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="أدخل القراءة السابقة للمؤشر"
                                        required
                                    />
                                </div>
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="targetReading"
                                        value={formData.targetReading}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="أدخل القراءة المستهدفة للمؤشر"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* صندوق بيانات التواصل */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-4">
                            <h2 className="text-2xl font-bold text-center text-white">بيانات التواصل</h2>
                        </div>

                        {/* صف العناوين الثلاثي */}
                        <div className="grid grid-cols-3 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">البريد الإلكتروني</div>
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">الجوال</div>
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center">الهاتف الشبكي )اختياري(</div>
                        </div>

                        <div className="grid grid-cols-3 border-t border-[#C2C1C1]">
                            <div className="p-4 border-l border-[#C2C1C1]">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                    placeholder="example@gmail.com"
                                    required
                                />
                            </div>
                            <div className="p-4 border-l border-[#C2C1C1]">
                                <PhoneInput
                                    country={'sa'} // يبدأ من السعودية
                                    value={formData.phone}
                                    onChange={(phone) => setFormData({ ...formData, phone })}
                                    inputClass="!w-full !px-4 !py-2 !border !border-[#C2C1C1] !rounded-md !focus:outline-none !focus:ring-2 !focus:ring-[#0DA9A6] !text-[#15445A]"
                                    containerClass="text-right"
                                    buttonClass=""
                                    enableSearch
                                    localization={ar}
                                    placeholder="رقم الهاتف"
                                />
                            </div>
                            <div className="p-4">
                                <input
                                    type="tel"
                                    name="networkPhone"
                                    value={formData.networkPhone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border text-right border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                    placeholder="الهاتف الشبكي"

                                />
                            </div>
                        </div>

                        {/* الهدف الرئيسي */}
                        <div className="grid grid-cols-2 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">الهدف الرئيسي للمشروع / البرنامج</div>
                            <div className="p-4">
                                <input
                                    type="text"
                                    name="mainProjectObjective"
                                    value={formData.mainProjectObjective}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                    placeholder="أدخل الهدف الرئيسي"
                                    required
                                />
                            </div>
                        </div>

                        {/* فترة التنفيذ */}
                        <div className="grid grid-cols-2 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">فترة التنفيذ</div>
                            <div className="p-4">
                                <input
                                    type="text"
                                    name="implementationPeriod"
                                    value={formData.implementationPeriod}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                    placeholder="أدخل فترة التنفيذ"
                                    required
                                />
                            </div>
                        </div>

                        {/* الوصف التفصيلي */}
                        <div className="grid grid-cols-2 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">
                                الوصف التفصيلي للمشروع / البرنامج<br />يتضمن الأنشطة والمراحل التنفيذية
                            </div>
                            <div className="p-4">
                                <textarea
                                    name="detailedProjectDescription"
                                    value={formData.detailedProjectDescription}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A] resize-none"
                                    placeholder="أدخل الوصف التفصيلي"
                                    required
                                />
                            </div>
                        </div>

                        {/* صف الإدارة والجهة والفئة */}
                        <div className="grid grid-cols-3 border-t border-[#C2C1C1]">
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">الإدارة المساندة</div>
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center border-l border-[#C2C1C1]">الجهة الداعمة</div>
                            <div className="bg-[#0DA9A6] p-4 text-white font-semibold text-center">الفئة المستهدفة</div>
                        </div>

                        <div className="grid grid-cols-3 border-t border-[#C2C1C1]">
                            <div className="p-4 border-l border-[#C2C1C1]">
                                <input
                                    type="text"
                                    name="supportingManagement"
                                    value={formData.supportingManagement}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                    placeholder="الإدارة المساندة"
                                    required
                                />
                            </div>
                            <div className="p-4 border-l border-[#C2C1C1]">
                                <input
                                    type="text"
                                    name="supportingAgency"
                                    value={formData.supportingAgency}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                    placeholder="الجهة الداعمة"
                                    required
                                />
                            </div>
                            <div className="p-4">
                                <input
                                    type="text"
                                    name="targetGroup"
                                    value={formData.targetGroup}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                    placeholder="الفئة المستهدفة"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Team Members Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border posl border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-4">
                            <h2 className="text-2xl font-bold text-center text-white">فريق العمل</h2>
                        </div>
                        <div className="border-t border-[#C2C1C1]">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-[#0DA9A6] text-white">
                                            <th className="px-4 py-3 text-center font-semibold border-l border-[#C2C1C1]">م</th>
                                            <th className="px-4 py-3 text-center font-semibold border-l border-[#C2C1C1]">الاسم</th>
                                            <th className="px-4 py-3 text-center font-semibold border-l border-[#C2C1C1]">الوظيفة</th>
                                            <th className="px-4 py-3Run Code text-center font-semibold border-l border-[#C2C1C1]">جهة العمل</th>
                                            <th className="px-4 py-3 text-center font-semibold">العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {formData.teamMembers.map((member, index) => (
                                            <tr key={index} className="border-b border-[#C2C1C1]">
                                                <td className="px-4 py-3 text-center border-l border-[#C2C1C1] font-medium">{index + 1}</td>
                                                <td className="px-4 py-3 border-l border-[#C2C1C1]">
                                                    <input
                                                        type="text"
                                                        value={member.name}
                                                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                                        placeholder="اسم العضو"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3 border-l border-[#C2C1C1]">
                                                    <input
                                                        type="text"
                                                        value={member.position}
                                                        onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                                        placeholder="الوظيفة"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3 border-l border-[#C2C1C1]">
                                                    <input
                                                        type="text"
                                                        value={member.workType}
                                                        onChange={(e) => updateTeamMember(index, 'workType', e.target.value)}
                                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                                        placeholder="جهة العمل"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
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
                            <div className="p-4">
                                <button
                                    type="button"
                                    onClick={addTeamMember}
                                    className="px-4 py-2 bg-[#0DA9A6] text-white rounded-md hover:bg-[#0C8B8A] transition-all font-medium"
                                >
                                    إضافة عضو جديد
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Performance Indicators Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-4">
                            <h2 className="text-2xl font-bold text-center text-white">مؤشرات الأداء</h2>
                        </div>
                        <div className="border-t border-[#C2C1C1]">
                            {formData.performanceIndicators.map((indicator, index) => (
                                <div key={index} className="grid grid-cols-2 border-b border-[#C2C1C1]">
                                    <div className="bg-[#0DA9A6] p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                        {indicator.indicator}
                                    </div>
                                    <div className="p-4">
                                        <input
                                            type="text"
                                            value={indicator.value}
                                            onChange={(e) => updatePerformanceIndicator(index, 'value', e.target.value)}
                                            className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                            placeholder={`تفاصيل ${indicator.indicator}`}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Information Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-4">
                            <h2 className="text-2xl font-bold text-center text-white">معلومات إضافية</h2>
                        </div>
                        <div className="border-t border-[#C2C1C1]">
                            {/* Challenges Row */}
                            <div className="grid grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    الصعوبات/التحديات المحتملة
                                </div>
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="potentialChallenges"
                                        value={formData.potentialChallenges}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="اذكر الصعوبات والتحديات المحتملة"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Procedures Row */}
                            <div className="grid grid-cols-2 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    الإجراءات المقترحة للتعامل معها
                                </div>
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="uniqueProcedures"
                                        value={formData.uniqueProcedures}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="اذكر الإجراءات المقترحة"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Budget Row */}
                            <div className="grid grid-cols-2">
                                <div className="bg-[#0DA9A6] p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">
                                    الموازنة التقديرية للمشروع/البرنامج
                                </div>
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="projectBudget"
                                        value={formData.projectBudget}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="أدخل الموازنة التقديرية"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Authority Approval Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#C2C1C1]">
                        <div className="bg-[#15445A] p-4">
                            <h2 className="text-2xl font-bold text-center text-white">اعتماد صاحب الصلاحية</h2>
                        </div>
                        <div className="border-t border-[#C2C1C1]">
                            <div className="grid grid-cols-3 border-b border-[#C2C1C1]">
                                <div className="bg-[#0DA9A6] p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">الاسم</div>
                                <div className="bg-[#0DA9A6] p-4 border-l border-[#C2C1C1] text-center font-semibold text-white">التاريخ</div>
                                <div className="bg-[#0DA9A6] p-4 text-center font-semibold text-white"> التوقيع )اختياري(</div>
                            </div>
                            <div className="grid grid-cols-3">
                                <div className="p-4 border-l border-[#C2C1C1]">
                                    <input
                                        type="text"
                                        name="authorityName"
                                        value={formData.authorityName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="اسم صاحب الصلاحية"
                                        required
                                    />
                                </div>
                                <div className="p-4 border-l border-[#C2C1C1]">
                                    <input
                                        type="date"
                                        name="authorityDate"
                                        value={formData.authorityDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A] [&::-webkit-calendar-picker-indicator]:opacity-100"
                                        required
                                    />
                                </div>
                                <div className="p-4">
                                    <input
                                        type="text"
                                        name="authoritySignature"
                                        value={formData.authoritySignature}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-[#C2C1C1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0DA9A6] text-[#15445A]"
                                        placeholder="التوقيع"

                                    />
                                </div>
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
            </div>
        </div>
    );
}