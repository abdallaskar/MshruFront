// import {
//     Document,
//     Page,
//     Text,
//     View,
//     StyleSheet,
//     Font,
//     Image,
// } from '@react-pdf/renderer';

// import CairoLight from '../assets/fonts/Cairo-Light.ttf';
// import CairoRegular from '../assets/fonts/Cairo-Regular.ttf';
// import CairoMedium from '../assets/fonts/Cairo-Medium.ttf';
// import CairoBold from '../assets/fonts/Cairo-Bold.ttf';

// // Register Cairo font from Google Fonts
// Font.register({
//     family: 'Cairo',
//     fonts: [
//         { src: CairoLight, fontWeight: 300 },
//         { src: CairoRegular, fontWeight: 400 },
//         { src: CairoMedium, fontWeight: 500 },
//         { src: CairoBold, fontWeight: 700 },
//     ],
// });

// // Combined styles for both cover page and form pages
// const styles = StyleSheet.create({
//     // Original form styles
//     page: {
//         fontFamily: 'Cairo',
//         fontSize: 12,
//         padding: 15,
//         direction: 'rtl',
//         textAlign: 'right',
//         fontWeight: 400,
//     },
//     header: {
//         fontFamily: 'Cairo',
//         fontSize: 14,
//         textAlign: 'center',
//         color: '#fff',
//         backgroundColor: '#15445A',
//         padding: 6,
//         marginBottom: 0,
//         fontWeight: 700,
//     },
//     tableContainer: {
//         border: '1px solid #000',
//         marginBottom: 0,
//     },
//     tableRow: {
//         flexDirection: 'row',
//         borderBottom: '1px solid #000',
//     },
//     headerCell: {
//         backgroundColor: '#0DA9A6',
//         color: '#fff',
//         padding: 4,
//         fontSize: 11,
//         fontWeight: 700,
//         textAlign: 'center',
//         borderRight: '1px solid #000',
//         fontFamily: 'Cairo',
//     },
//     cell: {
//         padding: 8,
//         fontSize: 10,
//         borderRight: '1px solid #000',
//         minHeight: 25,
//         fontFamily: 'Cairo',
//         fontWeight: 400,
//     },
//     halfCell: {
//         width: '50%',
//     },
//     teamTable: {
//         marginTop: 10,
//         border: '1px solid #000',
//     },
//     teamHeaderRow: {
//         flexDirection: 'row',
//         backgroundColor: '#0DA9A6',
//         borderBottom: '1px solid #000',
//     },
//     teamCell: {
//         padding: 6,
//         fontSize: 10,
//         borderRight: '1px solid #000',
//         textAlign: 'center',
//         color: '#fff',
//         fontWeight: 700,
//         fontFamily: 'Cairo',
//         backgroundColor: '#0DA9A6',
//     },
//     teamDataCell: {
//         padding: 6,
//         fontSize: 9,
//         borderRight: '1px solid #000',
//         borderBottom: '1px solid #000',
//         minHeight: 20,
//         fontFamily: 'Cairo',
//         fontWeight: 400,
//     },

//     // Styled cover page styles (from main PDF)
//     coverPageStyled: {
//         fontFamily: 'Cairo',
//         direction: 'rtl',
//         position: 'relative',
//         backgroundColor: '#ffffff',
//     },
//     coverPageContainer: {
//         position: 'relative',
//         height: '100%',
//         width: '100%',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     // Background with gradient overlay
//     backgroundContainer: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         zIndex: 1,
//     },
//     backgroundImage: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         opacity: 0.3,
//     },
//     gradientOverlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         background: 'linear-gradient(135deg, rgba(64, 224, 208, 0.8) 0%, rgba(32, 178, 170, 0.8) 100%)',
//     },
//     // Logo positioning
//     logoContainer: {
//         position: 'absolute',
//         top: 30,
//         right: 30,
//         zIndex: 3,
//         display: 'flex',
//         alignItems: 'center',
//         gap: 15,
//     },
//     logo: {
//         width: 80,
//         height: 80,
//     },
//     logoText: {
//         fontSize: 14,
//         fontWeight: 600,
//         color: '#2c5282',
//         textAlign: 'right',
//         lineHeight: 1.3,
//     },
//     // Main content container
//     contentContainer: {
//         position: 'relative',
//         zIndex: 2,
//         textAlign: 'center',
//         paddingHorizontal: 40,
//         paddingVertical: 60,
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         borderRadius: 15,
//         boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
//         maxWidth: 500,
//         margin: 'auto',
//     },
//     // Main title
//     mainTitle: {
//         fontSize: 28,
//         fontWeight: 700,
//         color: '#1a365d',
//         marginBottom: 20,
//         textAlign: 'center',
//         lineHeight: 1.4,
//     },
//     // Subtitle
//     subtitle: {
//         fontSize: 18,
//         fontWeight: 600,
//         color: '#2d3748',
//         marginBottom: 30,
//         textAlign: 'center',
//         lineHeight: 1.5,
//     },
//     // Project details section
//     detailsSection: {
//         marginTop: 40,
//         paddingTop: 25,
//         borderTop: '2px solid #e2e8f0',
//     },
//     projectDetailRow: {
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 15,
//         alignItems: 'center',
//     },
//     detailLabel: {
//         fontSize: 14,
//         fontWeight: 600,
//         color: '#e53e3e',
//         minWidth: 120,
//         textAlign: 'right',
//     },
//     detailValue: {
//         fontSize: 14,
//         fontWeight: 400,
//         color: '#2d3748',
//         textAlign: 'right',
//         flex: 1,
//     },
//     // Year badge
//     yearBadge: {
//         position: 'absolute',
//         bottom: 40,
//         left: '50%',
//         transform: 'translateX(-50%)',
//         backgroundColor: '#e53e3e',
//         color: 'white',
//         paddingVertical: 12,
//         paddingHorizontal: 25,
//         borderRadius: 25,
//         fontSize: 16,
//         fontWeight: 700,
//         zIndex: 3,
//     },
//     // Bottom department info
//     departmentInfo: {
//         position: 'absolute',
//         bottom: 15,
//         right: 20,
//         fontSize: 10,
//         color: '#4a5568',
//         textAlign: 'right',
//         zIndex: 3,
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         padding: 8,
//         borderRadius: 5,
//     },
// });

// const FormPDF = ({ form }) => (
//     <Document>
//         {/* Styled Cover Page */}
//         {/* <Page size="A4" orientation="landscape" style={styles.coverPageStyled}>
//             <View style={styles.coverPageContainer}>
                
//                 <View style={styles.backgroundContainer}>
                   
//                     <Image
//                         style={styles.backgroundImage}
//                         src="https://t4.ftcdn.net/jpg/10/48/75/41/360_F_1048754142_Ps5yb6DiNHNTFB0BArgx0iFIdEK28WCU.jpg"
//                     />
                 
//                     <View style={styles.gradientOverlay} />
//                 </View>

               
//                 <View >
//                     <Image
//                         style={styles.logo}
//                         src="https://upload.wikimedia.org/wikipedia/ar/thumb/2/20/MOELogo.svg/1920px-MOELogo.svg.png"
//                     />
//                 </View>

               
//                 <View >
//                     <Text style={styles.coverTitle}>بناء (المشاريع/البرامج) وحوكمتها</Text>

//                     <Text style={styles.coverInfo}>الإدارة العامة للتعليم بمنطقة القصيم</Text>
//                     <Text style={styles.coverInfo}>إدارة التطوير والتحول</Text>
//                     <Text style={styles.coverInfo}>قسم المشاريع والتحول المؤسسي</Text>

//                     <View style={{ marginTop: 40, border: '2px solid #000', padding: 20, width: '80%' }}>
//                         <Text style={styles.coverSubtitle}>اسم (المشروع/البرنامج)</Text>
//                         <Text style={[styles.coverInfo, { minHeight: 30, textAlign: 'center' }]}>
//                             {form.projectName || ''}
//                         </Text>
//                         <Text style={styles.coverSubtitle}>مالك (المشروع/البرنامج ) (إدارة/قسم)</Text>
//                         <Text style={[styles.coverInfo, { minHeight: 30, textAlign: 'center' }]}>
//                             {form.ownerName || ''}
//                         </Text>
//                     </View>
//                     <Text style={styles.coverSubtitle}>سنة تعبئة النموذج 2025م</Text>
//                 </View>

               
//                 <Text style={styles.yearBadge}>
//                     سنة تعبئة النموذج ٢٠٢٥ م
//                 </Text>

             
//                 <Text style={styles.departmentInfo}>
//                     إدارة التطوير والتحول - قسم المشاريع والتحول المؤسسي
//                 </Text>
//             </View>
//         </Page> */}

//         {/* Page 1 - Form Content */}
//         <Page size="A4" orientation="landscape" style={styles.page}>
//             <Text style={styles.header}>نموذج اعتماد مشروع/برنامج</Text>

//             <View style={styles.tableContainer}>
//                 {/* Project name and owner */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.headerCell, styles.halfCell]}>
//                         <Text>اسم المشروع/البرنامج</Text>
//                     </View>
//                     <View style={[styles.headerCell, styles.halfCell, { borderRight: 'none' }]}>
//                         <Text>مالك المشروع/البرنامج (إدارة/قسم)</Text>
//                     </View>
//                 </View>
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, styles.halfCell]}>
//                         <Text>{form.projectName || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, styles.halfCell, { borderRight: 'none' }]}>
//                         <Text>{form.ownerName || ''}</Text>
//                     </View>
//                 </View>

//                 {/* Strategic objective and performance indicator */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.headerCell, styles.halfCell]}>
//                         <Text>الهدف الاستراتيجي</Text>
//                     </View>
//                     <View style={[styles.headerCell, styles.halfCell, { borderRight: 'none' }]}>
//                         <Text>مؤشر الأداء المستهدف</Text>
//                     </View>
//                 </View>
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, styles.halfCell]}>
//                         <Text>{form.strategicObjective || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, styles.halfCell, { borderRight: 'none' }]}>
//                         <Text>{form.performanceIndicator || ''}</Text>
//                     </View>
//                 </View>

//                 {/* Previous and target readings */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.headerCell, styles.halfCell]}>
//                         <Text>القراءة السابقة للمؤشر</Text>
//                     </View>
//                     <View style={[styles.headerCell, styles.halfCell, { borderRight: 'none' }]}>
//                         <Text>القراءة المستهدفة للمؤشر</Text>
//                     </View>
//                 </View>
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, styles.halfCell]}>
//                         <Text>{form.previousReading || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, styles.halfCell, { borderRight: 'none' }]}>
//                         <Text>{form.targetReading || ''}</Text>
//                     </View>
//                 </View>

//                 {/* Contact information header */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.header, { width: '100%', borderRight: 'none' }]}>
//                         <Text>بيانات التواصل</Text>
//                     </View>
//                 </View>

//                 <View style={styles.tableRow}>
//                     <View style={[styles.headerCell, { width: '33.33%' }]}>
//                         <Text>الهاتف الشبكي</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '33.33%' }]}>
//                         <Text>الجوال</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '33.33%', borderRight: 'none' }]}>
//                         <Text>البريد الإلكتروني الوزاري</Text>
//                     </View>
//                 </View>

//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, { width: '33.33%' }]}>
//                         <Text>{form.networkPhone || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, { width: '33.33%' }]}>
//                         <Text>{form.mobile || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, { width: '33.33%', borderRight: 'none' }]}>
//                         <Text>{form.email || ''}</Text>
//                     </View>
//                 </View>

//                 {/* Project main objective */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, { width: '74.66%' }]}>
//                         <Text>{form.mainProjectObjective || ''}</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '25.33%', borderRight: 'none' }]}>
//                         <Text>الهدف الرئيسي للمشروع/البرنامج</Text>
//                     </View>
//                 </View>

//                 {/* Implementation period */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, { width: '74.66%' }]}>
//                         <Text>{form.implementationPeriod || ''}</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '25.33%', borderRight: 'none' }]}>
//                         <Text>فترة التنفيذ</Text>
//                     </View>
//                 </View>

//                 {/* Detailed project description */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, { width: '74.66%' }]}>
//                         <Text>{form.detailedProjectDescription || ''}</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '25.33%', borderRight: 'none' }]}>
//                         <Text>الوصف التفصيلي للمشروع/البرنامج</Text>
//                         <Text>يتضمن الأنشطة والمراحل التنفيذية</Text>
//                     </View>
//                 </View>

//                 {/* Supporting management, agency, and target group */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.headerCell, { width: '31%' }]}>
//                         <Text>الفئة/الجهة المستهدفة</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '38%' }]}>
//                         <Text>الجهة الداعمة (من خارج إدارة التعليم) شراكات إن وجدت</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '31%', borderRight: 'none' }]}>
//                         <Text>الإدارة المساندة (من داخل إدارة التعليم) إن وجدت</Text>
//                     </View>
//                 </View>
//                 <View style={[styles.tableRow, { borderBottom: 'none' }]}>
//                     <View style={[styles.cell, { width: '31%' }]}>
//                         <Text>{form.targetGroup || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, { width: '38%' }]}>
//                         <Text>{form.supportingAgency || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, { width: '31%', borderRight: 'none' }]}>
//                         <Text>{form.supportingManagement || ''}</Text>
//                     </View>
//                 </View>
//             </View>
//         </Page>

//         {/* Page 2 - Team and Additional Info */}
//         <Page size="A4" orientation="landscape" style={styles.page}>
//             {/* Team section */}
//             <View style={styles.header}>
//                 <Text>فريق العمل بالمشروع/البرنامج</Text>
//             </View>

//             <View style={styles.teamTable}>
//                 <View style={styles.teamHeaderRow}>
//                     <View style={[styles.teamCell, { width: '32%' }]}>
//                         <Text>جهة العمل</Text>
//                     </View>
//                     <View style={[styles.teamCell, { width: '32%' }]}>
//                         <Text>الوظيفة</Text>
//                     </View>
//                     <View style={[styles.teamCell, { width: '32%' }]}>
//                         <Text>الاسم</Text>
//                     </View>
//                     <View style={[styles.teamCell, { width: '4%', borderRight: 'none' }]}>
//                         <Text>م</Text>
//                     </View>
//                 </View>

//                 {/* Team members rows */}
//                 {form.teamMembers && form.teamMembers.length > 0 ? (
//                     form.teamMembers.map((member, idx) => (
//                         <View key={idx} style={styles.tableRow}>
//                             <View style={[styles.teamDataCell, { width: '32%' }, { borderBottom: 'none' }]}>
//                                 <Text>{member.workType || ''}</Text>
//                             </View>
//                             <View style={[styles.teamDataCell, { width: '32%' }, { borderBottom: 'none' }]}>
//                                 <Text>{member.position || ''}</Text>
//                             </View>
//                             <View style={[styles.teamDataCell, { width: '32%' }, { borderBottom: 'none' }]}>
//                                 <Text>{member.name || ''}</Text>
//                             </View>
//                             <View style={[styles.teamDataCell, { width: '4%' }, { borderBottom: 'none' }, { borderRight: 'none' }]}>
//                                 <Text>{idx + 1}</Text>
//                             </View>
//                         </View>
//                     ))
//                 ) : (
//                     Array.from({ length: 4 }, (_, idx) => (
//                         <View key={idx} style={styles.tableRow}>
//                             <View style={[styles.teamDataCell, { width: '32%' }]}>
//                                 <Text></Text>
//                             </View>
//                             <View style={[styles.teamDataCell, { width: '32%' }]}>
//                                 <Text></Text>
//                             </View>
//                             <View style={[styles.teamDataCell, { width: '32%' }]}>
//                                 <Text></Text>
//                             </View>
//                             <View style={[styles.teamDataCell, { width: '4%', borderRight: 'none' }]}>
//                                 <Text>{idx + 1}</Text>
//                             </View>
//                         </View>
//                     ))
//                 )}
//             </View>

//             {/* Performance indicators */}
//             <View style={[styles.header, { marginTop: 8 }]}>
//                 <Text>مؤشرات الأداء الخاصة بالمشروع/البرنامج</Text>
//             </View>

//             <View style={styles.tableContainer}>
//                 <View style={styles.tableRow}>
//                     <View style={[styles.headerCell, { width: '33.33%' }]}>
//                         <Text>المؤشر الثالث:</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '33.33%' }]}>
//                         <Text>المؤشر الثاني:</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '33.33%', borderRight: 'none' }]}>
//                         <Text>المؤشر الأول:</Text>
//                     </View>
//                 </View>
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, { width: '33.33%' }]}>
//                         <Text>{form.performanceIndicators?.[2]?.indicator || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, { width: '33.33%' }]}>
//                         <Text>{form.performanceIndicators?.[1]?.indicator || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, { width: '33.33%', borderRight: 'none' }]}>
//                         <Text>{form.performanceIndicators?.[0]?.indicator || ''}</Text>
//                     </View>
//                 </View>

//                 {/* Potential challenges */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, { width: '75%' }]}>
//                         <Text>{form.potentialChallenges || ''}</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '25%', borderRight: 'none' }]}>
//                         <Text>الصعوبات/التحديات المحتملة</Text>
//                     </View>
//                 </View>

//                 {/* Proposed procedures */}
//                 <View style={styles.tableRow}>
//                     <View style={[styles.cell, { width: '75%' }]}>
//                         <Text>{form.proposedProcedures || ''}</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '25%', borderRight: 'none' }]}>
//                         <Text>الإجراءات المقترحة للتعامل معها</Text>
//                     </View>
//                 </View>

//                 {/* Project budget */}
//                 <View style={[styles.tableRow, { borderBottom: 'none' }]}>
//                     <View style={[styles.cell, { width: '75%' }]}>
//                         <Text>{form.projectBudget || ''}</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '25%', borderRight: 'none' }]}>
//                         <Text>الموازنة التقديرية للمشروع/البرنامج</Text>
//                     </View>
//                 </View>
//             </View>

//             {/* Authority approval */}
//             <View style={[styles.header, { marginTop: 8 }]}>
//                 <Text>اعتماد صاحب الصلاحية</Text>
//             </View>

//             <View style={styles.tableContainer}>
//                 <View style={styles.tableRow}>
//                     <View style={[styles.headerCell, { width: '33.33%' }]}>
//                         <Text>التوقيع</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '33.33%' }]}>
//                         <Text>التاريخ</Text>
//                     </View>
//                     <View style={[styles.headerCell, { width: '33.33%', borderRight: 'none' }]}>
//                         <Text>الاسم</Text>
//                     </View>
//                 </View>

//                 <View style={[styles.tableRow, { borderBottom: 'none' }]}>
//                     <View style={[styles.cell, { width: '33.33%', minHeight: 40 }]}>
//                         <Text>{form.authoritySignature || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, { width: '33.33%', minHeight: 40 }]}>
//                         <Text>{form.authorityDate || ''}</Text>
//                     </View>
//                     <View style={[styles.cell, { width: '33.33%', minHeight: 40, borderRight: 'none' }]}>
//                         <Text>{form.authorityName || ''}</Text>
//                     </View>
//                 </View>
//             </View>
//         </Page>
//     </Document>
// );

// export default FormPDF;