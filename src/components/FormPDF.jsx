import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';

import HelveticaMedium from '../assets/fonts/majalla.ttf';
import HelveticaBold from '../assets/fonts/HelveticaNeueBold.ttf';
import MajallaBold from '../assets/fonts/majallab.ttf';

// Register  Helvetic font from Google Fonts
Font.register({
    family: ' Helvetic',
    fonts: [

        { src: HelveticaMedium, fontWeight: 400 },
        { src: HelveticaBold, fontWeight: 500 },
        { src: MajallaBold, fontWeight: 700 },

    ],
});

// Cleaned styles with consistent borders and removed unused classes
const styles = StyleSheet.create({
    page: {
        fontFamily: ' Helvetic',
        fontSize: 16,
        padding: 15,
        direction: 'rtl',
        textAlign: 'right',
        fontWeight: 400,
    },
    header: {
        fontFamily: ' Helvetic',
        fontSize: 22,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#15445A',
        padding: 6,
        marginBottom: 0,
        fontWeight: 700,
    },
    tableContainer: {
        border: '1px solid #000',
        marginBottom: 0,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #000',
    },
    headerCell: {
        backgroundColor: '#0DA9A6',
        color: '#fff',
        padding: 4,
        fontSize: 16,
        fontWeight: 700,
        textAlign: 'center',
        borderRight: '1px solid #000',
        fontFamily: ' Helvetic',
    },
    cell: {
        padding: 5,
        fontSize: 14,
        borderRight: '1px solid #000',
        minHeight: 25,
        fontFamily: ' Helvetic',
        fontWeight: 700,
    },
    halfCell: {
        width: '50%',
    },
    teamTable: {
        marginTop: 10,
        border: '1px solid #000',
    },
    teamHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#0DA9A6',
        borderBottom: '1px solid #000',
    },
    teamCell: {
        padding: 6,
        fontSize: 15,
        borderRight: '1px solid #000',
        textAlign: 'center',
        color: '#fff',
        fontWeight: 700,
        fontFamily: ' Helvetic',
        backgroundColor: '#0DA9A6',
    },
    teamDataCell: {
        padding: 6,
        fontSize: 15,
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
        minHeight: 20,
        fontFamily: ' Helvetic',
        fontWeight: 400,
    },
    coverPage: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'transparent',
    },
    coverTitle: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 20,
        fontFamily: ' Helvetic',
    },
    coverSubtitle: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: ' Helvetic',
        fontWeight: 500,
    },
    coverInfo: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: ' Helvetic',
        fontWeight: 400,
    },
});

const FormPDF = ({ form }) => (
    <Document>
        {/* Cover Page */}
        {/* <Page size="A4" orientation="landscape" style={[styles.page, styles.coverPage]}>
            <Text style={styles.coverTitle}>بناء (المشاريع/البرامج) وحوكمتها</Text>

            <Text style={styles.coverInfo}>الإدارة العامة للتعليم بمنطقة القصيم</Text>
            <Text style={styles.coverInfo}>إدارة التطوير والتحول</Text>
            <Text style={styles.coverInfo}>قسم المشاريع والتحول المؤسسي</Text>

            <View style={{ marginTop: 40, border: '2px solid #000', padding: 20, width: '80%' }}>
                <Text style={styles.coverSubtitle}>اسم (المشروع/البرنامج)</Text>
                <Text style={[styles.coverInfo, { minHeight: 30, textAlign: 'center' }]}>
                    {form.projectName || ''}
                </Text>
                <Text style={styles.coverSubtitle}>مالك (المشروع/البرنامج ) (إدارة/قسم)</Text>
                <Text style={[styles.coverInfo, { minHeight: 30, textAlign: 'center' }]}>
                    {form.ownerName || ''}
                </Text>
            </View>
            <Text style={styles.coverSubtitle}>سنة تعبئة النموذج 2025م</Text>
        </Page> */}

        {/* Page 1 */}
        <Page size="A4" orientation="landscape" style={styles.page}>
            <Text style={styles.header}>نموذج اعتماد مشروع/برنامج</Text>

            <View style={styles.tableContainer}>
                {/* Project name and owner */}
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>مالك المشروع/البرنامج (إدارة/قسم)</Text>
                    </View>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>اسم المشروع/البرنامج</Text>
                    </View>

                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, styles.halfCell,]}>
                        <Text>{form.ownerName || ''}</Text>
                    </View>
                    <View style={[styles.cell, styles.halfCell]}>
                        <Text>{form.projectName || ''}</Text>
                    </View>

                </View>

                {/* Strategic objective and performance indicator */}
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>مؤشر الأداء المستهدف</Text>
                    </View>
                    <View style={[styles.headerCell, styles.halfCell, { borderRight: 'none' }]}>
                        <Text>الهدف الاستراتيجي</Text>
                    </View>

                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, styles.halfCell]}>
                        <Text>{form.performanceIndicator || ''}</Text>
                    </View>
                    <View style={[styles.cell, styles.halfCell, { borderRight: 'none' }]}>
                        <Text>{form.strategicObjective || ''}</Text>
                    </View>

                </View>

                {/* Previous and target readings */}
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>القراءة المستهدفة للمؤشر</Text>
                    </View>
                    <View style={[styles.headerCell, styles.halfCell, { borderRight: 'none' }]}>
                        <Text>القراءة السابقة للمؤشر</Text>
                    </View>

                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, styles.halfCell]}>
                        <Text>{form.targetReading || ''}</Text>
                    </View>
                    <View style={[styles.cell, styles.halfCell, { borderRight: 'none' }]}>
                        <Text>{form.previousReading || ''}</Text>
                    </View>

                </View>

                {/* Contact information header */}
                <View style={styles.tableRow}>
                    <View style={[styles.header, { width: '100%', borderRight: 'none' }]}>
                        <Text>بيانات التواصل</Text>
                    </View>
                </View>

                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>الهاتف الشبكي</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>الجوال</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%', borderRight: 'none' }]}>
                        <Text>البريد الإلكتروني الوزاري</Text>
                    </View>
                </View>

                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.networkPhone || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.mobile || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%', borderRight: 'none' }]}>
                        <Text>{form.email || ''}</Text>
                    </View>
                </View>

                {/* Project main objective */}
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '74.66%' }]}>
                        <Text>{form.mainProjectObjective || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25.33%', borderRight: 'none' }]}>
                        <Text>الهدف الرئيسي للمشروع/البرنامج</Text>
                    </View>
                </View>

                {/* Implementation period */}
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '74.66%' }]}>
                        <Text>{form.implementationPeriod || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25.33%', borderRight: 'none' }]}>
                        <Text>فترة التنفيذ</Text>
                    </View>
                </View>

                {/* Detailed project description */}
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '74.66%' }]}>
                        <Text>{form.detailedProjectDescription || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25.33%', borderRight: 'none' }]}>
                        <Text>الوصف التفصيلي للمشروع/البرنامج</Text>
                        <Text>يتضمن الأنشطة والمراحل التنفيذية</Text>
                    </View>
                </View>

                {/* Supporting management, agency, and target group */}
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, { width: '31%' }]}>
                        <Text>الفئة/الجهة المستهدفة</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '38%' }]}>
                        <Text>الجهة الداعمة (من خارج إدارة التعليم) شراكات إن وجدت</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '31%', borderRight: 'none' }]}>
                        <Text>الإدارة المساندة (من داخل إدارة التعليم) إن وجدت</Text>
                    </View>
                </View>
                <View style={[styles.tableRow, { borderBottom: 'none' }]}>
                    <View style={[styles.cell, { width: '31%' }]}>
                        <Text>{form.targetGroup || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '38%' }]}>
                        <Text>{form.supportingAgency || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '31%', borderRight: 'none' }]}>
                        <Text>{form.supportingManagement || ''}</Text>
                    </View>
                </View>
            </View>
        </Page>

        {/* Page 2 */}
        <Page size="A4" orientation="landscape" style={styles.page}>
            {/* Team section */}
            <View style={styles.header}>
                <Text>فريق العمل بالمشروع/البرنامج</Text>
            </View>

            <View style={styles.teamTable}>
                <View style={styles.teamHeaderRow}>
                    <View style={[styles.teamCell, { width: '32%' }]}>
                        <Text>جهة العمل</Text>
                    </View>
                    <View style={[styles.teamCell, { width: '32%' }]}>
                        <Text>الوظيفة</Text>
                    </View>
                    <View style={[styles.teamCell, { width: '32%' }]}>
                        <Text>الاسم</Text>
                    </View>
                    <View style={[styles.teamCell, { width: '4%', borderRight: 'none' }]}>
                        <Text>م</Text>
                    </View>
                </View>

                {/* Team members rows */}
                {form.teamMembers && form.teamMembers.length > 0 ? (
                    form.teamMembers.map((member, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <View style={[styles.teamDataCell, { width: '32%' }, { borderBottom: 'none' }]}>
                                <Text>{member.workType || ''}</Text>
                            </View>
                            <View style={[styles.teamDataCell, { width: '32%' }, { borderBottom: 'none' }]}>
                                <Text>{member.position || ''}</Text>
                            </View>
                            <View style={[styles.teamDataCell, { width: '32%' }, { borderBottom: 'none' }]}>
                                <Text>{member.name || ''}</Text>
                            </View>
                            <View style={[styles.teamDataCell, { width: '4%' }, { borderBottom: 'none' }, { borderRight: 'none' }]}>
                                <Text>{idx + 1}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    Array.from({ length: 4 }, (_, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <View style={[styles.teamDataCell, { width: '32%' }]}>
                                <Text></Text>
                            </View>
                            <View style={[styles.teamDataCell, { width: '32%' }]}>
                                <Text></Text>
                            </View>
                            <View style={[styles.teamDataCell, { width: '32%' }]}>
                                <Text></Text>
                            </View>
                            <View style={[styles.teamDataCell, { width: '4%', borderRight: 'none' }]}>
                                <Text>{idx + 1}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>

            {/* Performance indicators */}
            <View style={[styles.header, { marginTop: 8 }]}>
                <Text>مؤشرات الأداء الخاصة بالمشروع/البرنامج</Text>
            </View>

            <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>المؤشر الثالث:</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>المؤشر الثاني:</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%', borderRight: 'none' }]}>
                        <Text>المؤشر الأول:</Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.performanceIndicators?.[2]?.indicator || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.performanceIndicators?.[1]?.indicator || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%', borderRight: 'none' }]}>
                        <Text>{form.performanceIndicators?.[0]?.indicator || ''}</Text>
                    </View>
                </View>

                {/* Potential challenges */}
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '75%' }]}>
                        <Text>{form.potentialChallenges || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25%', borderRight: 'none' }]}>
                        <Text>الصعوبات/التحديات المحتملة</Text>
                    </View>
                </View>

                {/* Proposed procedures */}
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '75%' }]}>
                        <Text>{form.proposedProcedures || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25%', borderRight: 'none' }]}>
                        <Text>الإجراءات المقترحة للتعامل معها</Text>
                    </View>
                </View>

                {/* Project budget */}
                <View style={[styles.tableRow, { borderBottom: 'none' }]}>
                    <View style={[styles.cell, { width: '75%' }]}>
                        <Text>{form.projectBudget || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25%', borderRight: 'none' }]}>
                        <Text>الموازنة التقديرية للمشروع/البرنامج</Text>
                    </View>
                </View>
            </View>

            {/* Authority approval */}
            <View style={[styles.header, { marginTop: 8 }]}>
                <Text>اعتماد صاحب الصلاحية</Text>
            </View>

            <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>التوقيع</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>التاريخ</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%', borderRight: 'none' }]}>
                        <Text>الاسم</Text>
                    </View>
                </View>

                <View style={[styles.tableRow, { borderBottom: 'none' }]}>
                    <View style={[styles.cell, { width: '33.33%', minHeight: 40 }]}>
                        <Text>{form.authoritySignature || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%', minHeight: 40 }]}>
                        <Text>{form.authorityDate || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%', minHeight: 40, borderRight: 'none' }]}>
                        <Text>{form.authorityName || ''}</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document >
);

export default FormPDF;