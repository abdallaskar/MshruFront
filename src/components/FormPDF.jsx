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
        fontSize: 14,
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
        padding: 4,
        marginBottom: 0,
        fontWeight: 700,
    },
    tableContainer: {
        marginBottom: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    headerCell: {
        backgroundColor: '#0DA9A6',
        color: '#fff',
        padding: 4,
        fontSize: 15,
        fontWeight: 700,
        textAlign: 'center',
        border: '1px solid #000',
        fontFamily: ' Helvetic',
    },
    cell: {
        padding: 3,
        fontSize: 13,
        border: '1px solid #000',
        minHeight: 25,
        fontFamily: ' Helvetic',
        fontWeight: 700,
    },
    halfCell: {
        width: '50%',
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
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>نموذج اعتماد مشروع/برنامج</Text>

            <View style={styles.tableContainer} wrap={false}>
                {/* Project name and owner */}
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>{form.ownerName?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>{form.projectName?.label || ''}</Text>
                    </View>

                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, styles.halfCell,]}>
                        <Text>{form.ownerName?.value || ''}</Text>
                    </View>

                    <View style={[styles.cell, styles.halfCell]}>
                        <Text>{form.projectName?.value || ''}</Text>
                    </View>

                </View>

                {/* Strategic objective and performance indicator */}
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>{form.performanceIndicator?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>{form.strategicObjective?.label || ''}</Text>
                    </View>

                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, styles.halfCell]}>
                        <Text>{form.performanceIndicator?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, styles.halfCell]}>
                        <Text>{form.strategicObjective?.value || ''}</Text>
                    </View>

                </View>

                {/* Previous and target readings */}
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>{form.targetReading?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, styles.halfCell]}>
                        <Text>{form.previousReading?.label || ''}</Text>
                    </View>

                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, styles.halfCell]}>
                        <Text>{form.targetReading?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, styles.halfCell]}>
                        <Text>{form.previousReading?.value || ''}</Text>
                    </View>

                </View>
            </View>
            <View style={styles.tableContainer} wrap={false}>
                {/* Contact information header */}
                <View style={styles.tableRow}>
                    <View style={[styles.header, { width: '100%' }]}>
                        <Text>بيانات التواصل</Text>
                    </View>
                </View>

                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.networkPhone?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.phone?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.email?.label || ''}</Text>
                    </View>
                </View>

                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.networkPhone?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.phone?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.email?.value || ''}</Text>
                    </View>
                </View>

            </View>
            {/* Project main objective */}
            <View style={styles.tableContainer} wrap={false}>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '73%' }]}>
                        <Text>{form.mainProjectObjective?.value || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '27%' }]}>
                        <Text>{form.mainProjectObjective?.label || ''}</Text>
                        {/* <Text>للمشروع/البرنامج</Text> */}
                    </View>
                </View>

                {/* Implementation period */}
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '73%', flexDirection: 'row', justifyContent: 'flex-end' }]}>
                        <Text >{form.endDate?.value || ''} </Text>
                        <Text> إلى</Text>
                        <Text >|</Text>
                        <Text>{form.startDate?.value || ''} </Text>
                        <Text> من</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '27%' }]}>
                        <Text>{form.startDate?.label || ''}</Text>
                    </View>
                </View>

                {/* Detailed project description */}
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '73%' }]}>
                        <Text>{form.detailedProjectDescription?.value || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '27%' }]}>
                        <Text>{form.detailedProjectDescription?.label || ''}</Text>
                        {/* <Text>يتضمن الأنشطة والمراحل التنفيذية</Text> */}
                    </View>
                </View>
            </View>
            {/* Supporting management, agency, and target group */}
            <View style={styles.tableContainer} wrap={false}>
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, { width: '31%' }]}>
                        <Text>{form.targetGroup?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '38%' }]}>
                        <Text>{form.supportingAgency?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '31%' }]}>
                        <Text>{form.supportingManagement?.label || ''}</Text>
                    </View>
                </View>
                <View style={[styles.tableRow]}>
                    <View style={[styles.cell, { width: '31%' }]}>
                        <Text>{form.targetGroup?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '38%' }]}>
                        <Text>{form.supportingAgency?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '31%' }]}>
                        <Text>{form.supportingManagement?.value || ''}</Text>
                    </View>
                </View>
            </View>
        </Page >

        {/* Page 2 */}
        < Page size="A4" style={styles.page} >
            {/* Team section */}

            <View style={styles.tableContainer} wrap={false}>
                < View style={styles.header} >
                    <Text>فريق العمل بالمشروع/البرنامج</Text>
                </View >
                <View style={styles.tableRow} >

                    <View style={[styles.headerCell, { width: '32%' }]}>
                        <Text>{form.workType?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '32%' }]}>
                        <Text>{form.position?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '32%' }]}>
                        <Text>{form.name?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '4%' }]}>
                        <Text>م</Text>

                    </View>
                </View>
                <View>
                    {/* Team members rows */}
                    {form.teamMembers && form.teamMembers.length > 0 ? (
                        form.teamMembers.map((member, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <View style={[styles.cell, { width: '32%' }]}>
                                    <Text>{member.workType?.value || ''}</Text>
                                </View>
                                <View style={[styles.cell, { width: '32%' }]}>
                                    <Text>{member.position?.value || ''}</Text>
                                </View>
                                <View style={[styles.cell, { width: '32%' }]}>
                                    <Text>{member.name?.value || ''}</Text>
                                </View>
                                <View style={[styles.cell, { width: '4%' }]}>
                                    <Text>{idx + 1}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        Array.from({ length: 4 }, (_, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <View style={[styles.cell, { width: '32%' }]}>
                                    <Text></Text>
                                </View>
                                <View style={[styles.cell, { width: '32%' }]}>
                                    <Text></Text>
                                </View>
                                <View style={[styles.cell, { width: '32%' }]}>
                                    <Text></Text>
                                </View>
                                <View style={[styles.cell, { width: '4%' }]}>
                                    <Text>{idx + 1}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </View>


            {/* Performance indicators */}
            <View style={styles.tableContainer} wrap={false} >
                <View style={[styles.header, { marginTop: 2 }]}>
                    <Text>مؤشرات الأداء الخاصة بالمشروع/البرنامج</Text>
                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.thirdIndicator?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.secondIndicator?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.firstIndicator?.label || ''}</Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.thirdIndicator?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.secondIndicator?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%' }]}>
                        <Text>{form.firstIndicator?.value || ''}</Text>
                    </View>
                </View>
            </View>

            {/* Potential challenges */}
            <View style={styles.tableContainer}  >
                <View style={styles.tableRow} wrap={false}>
                    <View style={[styles.cell, { width: '75%' }]}>
                        <Text>{form.potentialChallenges?.value || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25%' }]}>
                        <Text>{form.potentialChallenges?.label || ''}</Text>
                    </View>
                </View>

                {/* Proposed procedures */}
                <View style={styles.tableRow} wrap={false}>
                    <View style={[styles.cell, { width: '75%' }]}>
                        <Text>{form.uniqueProcedures?.value || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25%' }]}>
                        <Text>{form.uniqueProcedures?.label || ''}</Text>
                    </View>
                </View>


                {/* Project budget */}
                <View style={[styles.tableRow]} wrap={false}>

                    <View style={[styles.cell, { width: '75%' }]}>
                        <Text>{form.projectBudget?.value || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '25%' }]}>
                        <Text>{form.projectBudget?.label || ''}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.tableContainer} wrap={false}>
                {/* Authority approval */}
                <View style={[styles.header, { marginTop: 2 }]}>
                    <Text>اعتماد صاحب الصلاحية</Text>
                </View>

                <View style={styles.tableRow}>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.authoritySignature?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.authorityDate?.label || ''}</Text>
                    </View>
                    <View style={[styles.headerCell, { width: '33.33%' }]}>
                        <Text>{form.authorityName?.label || ''}</Text>
                    </View>
                </View>

                <View style={[styles.tableRow, { borderBottom: 'none' }]}>
                    <View style={[styles.cell, { width: '33.33%', minHeight: 40 }]}>
                        <Text>{form.authoritySignature?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%', minHeight: 40 }]}>
                        <Text>{form.authorityDate?.value || ''}</Text>
                    </View>
                    <View style={[styles.cell, { width: '33.33%', minHeight: 40 }]}>
                        <Text>{form.authorityName?.value || ''}</Text>
                    </View>
                </View>
            </View>
        </Page >
    </Document >
);

export default FormPDF;