import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header on later pages (Page 2 onwards)
        if self._pageNumber > 1:
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(36, A4[1] - 24, "Software Engineering & UML Modeling | Assignments 1 – 4")
            self.drawRightString(A4[0] - 36, A4[1] - 24, "Project: AI Mental Health & Mood Tracker")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.6)
            self.line(36, A4[1] - 28, A4[0] - 36, A4[1] - 28)

        # Footer on all pages
        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 24, "Student: Aditya Pawar | Academic Assignment Submission")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 36, 24, page_str)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.6)
        self.line(36, 34, A4[0] - 36, 34)
        
        self.restoreState()

def create_assignments_pdf():
    pdf_filename = "/Users/kanishksingh/Downloads/aditya pawar/Software_Engineering_Assignments_Aditya_Pawar.pdf"
    img_dir = "/Users/kanishksingh/Downloads/aditya pawar/diagrams"

    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=42
    )

    base_styles = getSampleStyleSheet()

    # Custom typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=base_styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#1E3A8A"),
        spaceAfter=3
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=base_styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#475569"),
        spaceAfter=8
    )

    sec_header_style = ParagraphStyle(
        'SecHeader',
        parent=base_styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#FFFFFF")
    )

    sub_sec_header = ParagraphStyle(
        'SubSecHeader',
        parent=base_styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=6,
        spaceAfter=3
    )

    q_title_style = ParagraphStyle(
        'QuestionTitle',
        parent=base_styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.2,
        leading=13,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=5,
        spaceAfter=2
    )

    ans_style = ParagraphStyle(
        'AnswerBody',
        parent=base_styles['Normal'],
        fontName='Helvetica',
        fontSize=8.6,
        leading=12.2,
        textColor=colors.HexColor("#334155"),
        spaceAfter=3
    )

    tbl_header_style = ParagraphStyle(
        'TblHeader',
        parent=base_styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.3,
        leading=11,
        textColor=colors.white
    )

    tbl_cell_style = ParagraphStyle(
        'TblCell',
        parent=base_styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B")
    )

    caption_style = ParagraphStyle(
        'ImgCaption',
        parent=base_styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        alignment=1, # Center
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=4,
        spaceAfter=6
    )

    def section_banner(title_text):
        p = Paragraph(f"<b>{title_text.upper()}</b>", sec_header_style)
        t = Table([[p]], colWidths=[523.27])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#1E3A8A")),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        return t

    story = []

    # ==========================================
    # PAGE 1 & 2: ASSIGNMENT 1
    # ==========================================
    story.append(Paragraph("Software Engineering & System Architecture", title_style))
    story.append(Paragraph("<b>Solved Assignments 1, 2, 3 & 4 with Comprehensive UML Project Modeling</b>", subtitle_style))

    meta_data = [
        [
            Paragraph("<b>Student Name:</b> Aditya Pawar", tbl_cell_style),
            Paragraph("<b>Course / Subject:</b> Software Engineering & Testing", tbl_cell_style)
        ],
        [
            Paragraph("<b>Project:</b> AI-Powered Mental Health & Well-being Companion", tbl_cell_style),
            Paragraph("<b>Technology Stack:</b> Python (Flask) / PHP, MySQL, OpenAI API", tbl_cell_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[261.6, 261.6])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    story.append(section_banner("Assignment 1: Project Details"))
    story.append(Spacer(1, 4))

    q_a1_p1 = [
        ("1. Describe your project.",
         "The project is an <b>AI-Powered Mental Health & Well-being Companion</b> (Mood & Journal Tracker). It is an interactive, privacy-focused web platform designed to support mental wellness through daily mood logging, written and voice journaling, standardized psychological questionnaires (stress, anxiety, happiness, loneliness), daily motivational quotes, real-time conversational AI emotional support (powered by OpenAI API), a directory of nearby verified therapists (via Google Maps API), and immediate SOS emergency crisis contact access."),
        
        ("2. Advantages of your project.",
         "• <b>24/7 Accessibility:</b> Instant, confidential emotional support and guided journaling available around the clock.<br/>"
         "• <b>Multimodal Journaling:</b> Accommodates both text reflections and audio voice recordings for flexible self-expression.<br/>"
         "• <b>Crisis Readiness:</b> Provides direct one-tap access to local emergency hotlines and nearby mental health clinics.<br/>"
         "• <b>Actionable Visual Analytics:</b> Generates trend charts that help users recognize emotional triggers and progress over time."),

        ("3. How do you gather the requirements of your project?",
         "• <b>Psychological Literature & Clinical Scales:</b> Researched standardized psychological assessment tools including PHQ-9 (depression) and GAD-7 (anxiety).<br/>"
         "• <b>User Surveys & Field Interviews:</b> Surveyed individuals regarding emotional tracking habits, mental health stigma, and data privacy expectations.<br/>"
         "• <b>Competitor & App Benchmarking:</b> Analyzed features of leading applications like Woebot, Moodfit, and Daylio.<br/>"
         "• <b>Counselor Consultations:</b> Engaged with student counselors to establish safe boundaries for AI-generated guidance."),

        ("4. How and where do you implement your project?",
         "• <b>Development Environment:</b> Developed locally on VS Code using a local Apache/Flask web server and MySQL database server.<br/>"
         "• <b>Implementation Architecture:</b> Built following a clean 3-Tier architecture: <b>Presentation Layer</b> (HTML5, CSS3, JavaScript), <b>Application Layer</b> (Python Flask / PHP REST API endpoints), and <b>Data Layer</b> (MySQL relational database), interfaced with external cloud APIs."),

        ("5. Which software you used in your project?",
         "• <b>IDE & Tools:</b> Visual Studio Code, Git, Postman API Tester, phpMyAdmin.<br/>"
         "• <b>Frontend Technologies:</b> HTML5, CSS3, JavaScript (ES6+), Tailwind CSS.<br/>"
         "• <b>Backend Environment:</b> Python 3.10+ (Flask framework) / PHP 8.x.<br/>"
         "• <b>Database:</b> MySQL Community Server 8.0.<br/>"
         "• <b>Third-Party Cloud APIs:</b> OpenAI API (Chat Completions) and Google Maps Platform API (Places & Geolocation)."),

        ("6. What methodology is used for the project?",
         "<b>Agile (Scrum) Methodology:</b> The project was developed across two-week iterative sprints: Sprint 1 (User Auth & Database Schema), Sprint 2 (Mood & Journal Modules), Sprint 3 (Voice Recording & OpenAI Chatbot), and Sprint 4 (Therapist Locator & Emergency SOS). This approach ensured continuous validation and rapid feature delivery."),

        ("7. What is the hardware or software of the project?",
         "• <b>Hardware Requirements:</b><br/>"
         "&nbsp;&nbsp;– <i>Server/Developer:</i> Multi-core processor (Intel Core i3/i5 or Apple Silicon), 8 GB+ RAM, 256 GB SSD, microphone for voice notes.<br/>"
         "&nbsp;&nbsp;– <i>Client:</i> Any desktop, laptop, tablet, or smartphone with a microphone and internet connection.<br/>"
         "• <b>Software Requirements:</b> Windows 10/11, macOS, or Linux OS; modern web browser (Google Chrome, Edge, Safari); Python 3.10+ / PHP 8; MySQL 8.0.")
    ]

    for q, a in q_a1_p1:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, ans_style))

    story.append(PageBreak())

    # Page 2: Assignment 1 (Q8 to Q14)
    story.append(section_banner("Assignment 1: Project Details (Continued)"))
    story.append(Spacer(1, 4))

    q_a1_p2 = [
        ("8. What is your role in the project?",
         "<b>Full-Stack Developer & System Architect:</b> Responsible for the complete end-to-end delivery: gathering requirements, designing UML diagrams and MySQL relational schemas, developing responsive web interfaces, coding backend business logic and REST endpoints, integrating OpenAI and Google Maps APIs, and performing functional test validation."),

        ("9. Explain the data flow of your application.",
         "1. <b>User Authentication:</b> User submits login credentials $\\rightarrow$ Web App forwards payload to Server $\\rightarrow$ Server verifies password hash in MySQL $\\rightarrow$ User session token generated and returned.<br/>"
         "2. <b>Mood & Journal Logging:</b> User enters mood score, written reflection, or voice note $\\rightarrow$ HTTP POST to Server $\\rightarrow$ Database record inserted $\\rightarrow$ Dashboard analytics engine updates visual charts.<br/>"
         "3. <b>AI Companion Conversation:</b> User sends message in AI chat $\\rightarrow$ Server forwards message with conversational context to OpenAI API $\\rightarrow$ AI generates empathetic response $\\rightarrow$ Returned and rendered in chat view.<br/>"
         "4. <b>Emergency Support Flow:</b> User triggers Emergency Help $\\rightarrow$ Web App immediately presents emergency hotlines and calls Google Maps API with user coordinates to display nearby clinics."),

        ("10. What are the entities in your project?",
         "• <code>User</code>: <code>userId, name, email, password</code> (Signup and authentication)<br/>"
         "• <code>Mood</code>: <code>moodId, userId, mood, date, time</code> (Daily mood levels and timestamps)<br/>"
         "• <code>Journal</code>: <code>journalId, userId, text, date</code> (Reflective journal entries)<br/>"
         "• <code>VoiceNote</code>: <code>voiceId, userId, audioPath, date, duration</code> (Stored audio notes)<br/>"
         "• <code>Questionnaire</code>: <code>questionId, userId, stressScore, anxietyScore, happinessScore, lonelinessScore, date</code><br/>"
         "• <code>Quote</code>: <code>quoteId, quote, author</code> (Inspirational daily quotes)<br/>"
         "• <code>AI_Friend</code>: Methods for <code>chat(), suggestTips(), breathingGuide(), journalingPrompts()</code><br/>"
         "• <code>Therapist</code>: <code>therapistId, name, phone, address, latitude, longitude</code> (Local practitioner directory)<br/>"
         "• <code>EmergencyContact</code>: <code>id, name, phone, type</code> (SOS helpline numbers)"),

        ("11. What is the drawback of your system?",
         "• <b>Not a Medical Diagnostic Tool:</b> Cannot replace certified clinical psychiatric evaluation, therapy, or medicinal prescription.<br/>"
         "• <b>Connectivity & API Dependence:</b> AI conversational capabilities and map lookups require continuous internet connectivity and external API uptime.<br/>"
         "• <b>Self-Reporting Bias:</b> Accuracy of analytical insights relies on consistent, truthful user self-reporting."),

        ("12. How do you test your application?",
         "• <b>Unit Testing:</b> Verified individual backend logic (e.g., authentication hashing, questionnaire score aggregations, input sanitization).<br/>"
         "• <b>Integration Testing:</b> Tested end-to-end data pipelines connecting frontend web forms, backend endpoints, MySQL, and OpenAI API.<br/>"
         "• <b>Black-Box & UI Testing:</b> Validated form validations, audio microphone capture, and cross-browser responsiveness across screen sizes.<br/>"
         "• <b>User Acceptance Testing (UAT):</b> Conducted trials with sample users to assess UI clarity, conversational empathy, and navigation."),

        ("13. From where do you get reference, guide for your project work?",
         "• Academic research articles on cognitive behavioral therapy (CBT) and mobile mental health informatics.<br/>"
         "• Official API and developer documentation: OpenAI Platform docs, Python Flask / PHP manuals, MySQL 8.0 Reference, MDN Web Docs.<br/>"
         "• Academic project mentor and faculty guidelines, alongside peer reviews."),

        ("14. In the future, what changes will you make in your application?",
         "• <b>Acoustic Emotion Recognition:</b> Implement machine learning models to detect emotional distress directly from voice note audio tone.<br/>"
         "• <b>Smartwatch/Wearable Sync:</b> Integrate with smart bands to correlate physiological data (heart rate, HRV, sleep) with logged moods.<br/>"
         "• <b>Teletherapy Telehealth Module:</b> Introduce secure, end-to-end encrypted video appointments with certified psychologists.<br/>"
         "• <b>Offline Mode Support:</b> Convert to a Progressive Web App (PWA) with local storage and automatic background synchronization.")
    ]

    for q, a in q_a1_p2:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, ans_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 3: ASSIGNMENT 2 (Q1-Q3 + MASTER ARCHITECTURE SHEET)
    # ==========================================
    story.append(section_banner("Assignment 2: UML (Unified Modeling Language)"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. What is UML?", q_title_style))
    story.append(Paragraph("<b>Unified Modeling Language (UML)</b> is a standardized, general-purpose visual modeling language in software engineering managed by the Object Management Group (OMG). It offers a standard graphical vocabulary to visualize, specify, construct, and document the structure and behavior of object-oriented software systems.", ans_style))

    story.append(Paragraph("2. What is the use of UML?", q_title_style))
    story.append(Paragraph("• <b>Visual Blueprinting:</b> Enables system architects and developers to conceptualize software models and database relationships before writing code.<br/>"
                           "• <b>Cross-Functional Communication:</b> Creates an unambiguous common language understood by developers, testers, analysts, and project sponsors.<br/>"
                           "• <b>Early Flaw Detection:</b> Reveals architectural bottlenecks, unhandled use cases, and logic gaps in early development phases.<br/>"
                           "• <b>System Documentation & Maintainability:</b> Serves as reliable documentation that eases maintenance, refactoring, and team onboarding.", ans_style))

    story.append(Paragraph("3. Explain types of UML diagram with example?", q_title_style))
    story.append(Paragraph("UML diagrams are divided into two fundamental classifications:<br/>"
                           "1. <b>Structural Diagrams (Static Modeling):</b> Represent the static building blocks of a system that remain fixed over time.<br/>"
                           "&nbsp;&nbsp;– <i>Class Diagram:</i> Displays classes, attributes, methods, and relationships (inheritance, association).<br/>"
                           "&nbsp;&nbsp;– <i>Component Diagram:</i> Depicts organizational relationships between physical software modules, components, and APIs.<br/>"
                           "&nbsp;&nbsp;– <i>Deployment Diagram:</i> Maps software components to physical hardware execution nodes and networks.<br/>"
                           "2. <b>Behavioral Diagrams (Dynamic Modeling):</b> Depict the dynamic flow of control, state transitions, and interactions over time.<br/>"
                           "&nbsp;&nbsp;– <i>Use Case Diagram:</i> Maps interactions between human/external actors and system functions inside system boundaries.<br/>"
                           "&nbsp;&nbsp;– <i>Sequence Diagram:</i> Captures chronological time-ordered message passing between interacting objects.<br/>"
                           "&nbsp;&nbsp;– <i>Activity Diagram:</i> Models procedural workflows, decision logic, and parallel operations like a flowchart.", ans_style))

    story.append(Spacer(1, 4))
    story.append(Paragraph("4. Draw UML Diagrams of your project.", sub_sec_header))
    story.append(Paragraph("Figure 2.0 provides the consolidated master reference architecture containing all 5 UML diagrams (Use Case, Class, Activity, Sequence, and Component) created for the <b>AI Mental Health & Well-being Companion</b>. Individual diagrams are detailed on subsequent pages.", ans_style))

    all_img_path = os.path.join(img_dir, 'all_diagrams.png')
    if os.path.exists(all_img_path):
        story.append(Image(all_img_path, width=520, height=330))
        story.append(Paragraph("Figure 2.0: Master Architectural UML Sheet (Consolidated System Models)", caption_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 4: 4.1 USE CASE DIAGRAM
    # ==========================================
    story.append(section_banner("Assignment 2: UML Modeling — 4.1 Use Case Diagram"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>4.1 Use Case Diagram Overview & Analysis</b>", sub_sec_header))
    story.append(Paragraph("The Use Case Diagram captures the interactions between the primary actor (<code>User</code>) and system services within the <i>Mental Health & Well-being System</i> boundary. Each use case communicates with the central <code>Database</code> for storage and retrieval.", ans_style))

    uc_img = os.path.join(img_dir, '1_use_case.png')
    if os.path.exists(uc_img):
        story.append(Image(uc_img, width=380, height=395))
        story.append(Paragraph("Figure 2.1: Use Case Diagram of the Mental Health & Well-being Application", caption_style))

    uc_desc = [
        [Paragraph("<b>Actor</b>", tbl_header_style), Paragraph("<b>Key Use Cases Handled</b>", tbl_header_style), Paragraph("<b>Backend Integration</b>", tbl_header_style)],
        [
            Paragraph("<b>User</b><br/>(Client / End-User)", tbl_cell_style),
            Paragraph("• Sign Up / Login<br/>• Track Mood & Daily Journal<br/>• Voice Journal & Questionnaire<br/>• AI Friend Chat & View Dashboard<br/>• Daily Quotes & Mood-Based Activities<br/>• Nearby Therapist & Emergency Help", tbl_cell_style),
            Paragraph("All user inputs are authenticated, validated, and persisted into the relational database. AI Chat routes through OpenAI API, and Therapist Search queries Google Maps API.", tbl_cell_style)
        ]
    ]
    t_uc = Table(uc_desc, colWidths=[100, 240, 183.27])
    t_uc.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_uc)

    story.append(PageBreak())

    # ==========================================
    # PAGE 5: 4.2 CLASS DIAGRAM
    # ==========================================
    story.append(section_banner("Assignment 2: UML Modeling — 4.2 Class Diagram"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>4.2 Class Diagram Overview & Entity Relationships</b>", sub_sec_header))
    story.append(Paragraph("The Class Diagram illustrates the object-oriented structure of the software. It specifies class attributes, methods, visibility access modifiers, and cardinality multiplicity (e.g., 1 User has * Moods, * Journals, * VoiceNotes, and * Questionnaires).", ans_style))

    class_img = os.path.join(img_dir, '2_class.png')
    if os.path.exists(class_img):
        story.append(Image(class_img, width=470, height=395))
        story.append(Paragraph("Figure 2.2: Class Diagram showing Attributes, Methods, and Associations", caption_style))

    class_desc = [
        [Paragraph("<b>Class Name</b>", tbl_header_style), Paragraph("<b>Key Attributes</b>", tbl_header_style), Paragraph("<b>Primary Methods & Multiplicity</b>", tbl_header_style)],
        [Paragraph("<b>User</b>", tbl_cell_style), Paragraph("userId, name, email, password", tbl_cell_style), Paragraph("+ signup(), + login() (1 to many with tracking records)", tbl_cell_style)],
        [Paragraph("<b>Mood / Journal / VoiceNote</b>", tbl_cell_style), Paragraph("moodId, journalId, voiceId, date, time, text, audioPath, duration", tbl_cell_style), Paragraph("+ addMood(), + addJournal(), + addVoiceNote()", tbl_cell_style)],
        [Paragraph("<b>Questionnaire</b>", tbl_cell_style), Paragraph("questionId, stressScore, anxietyScore, happinessScore, lonelinessScore", tbl_cell_style), Paragraph("+ addResponse() (Stores normalized wellness assessment scores)", tbl_cell_style)],
        [Paragraph("<b>AI_Friend / Services</b>", tbl_cell_style), Paragraph("quoteId, therapistId, latitude, longitude, phone, contact id", tbl_cell_style), Paragraph("+ chat(), + suggestTips(), + breathingGuide(), + viewDetails(), + callNow()", tbl_cell_style)]
    ]
    t_class = Table(class_desc, colWidths=[110, 193.27, 220])
    t_class.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_class)

    story.append(PageBreak())

    # ==========================================
    # PAGE 6: 4.3 ACTIVITY DIAGRAM
    # ==========================================
    story.append(section_banner("Assignment 2: UML Modeling — 4.3 Activity Diagram"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>4.3 Activity Diagram Workflow & Logic</b>", sub_sec_header))
    story.append(Paragraph("The Activity Diagram models the operational control flow: Start $\\rightarrow$ Authentication $\\rightarrow$ Dashboard $\\rightarrow$ User selects an activity $\\rightarrow$ System saves data $\\rightarrow$ Analytics are refreshed $\\rightarrow$ Condition check for crisis support $\\rightarrow$ Termination.", ans_style))

    act_img = os.path.join(img_dir, '3_activity.png')
    if os.path.exists(act_img):
        story.append(Image(act_img, width=255, height=555))
        story.append(Paragraph("Figure 2.3: Activity Diagram showing Operational Flow and Decision Logic", caption_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 7: 4.4 SEQUENCE DIAGRAM
    # ==========================================
    story.append(section_banner("Assignment 2: UML Modeling — 4.4 Sequence Diagram"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>4.4 Sequence Diagram Chronological Message Flow</b>", sub_sec_header))
    story.append(Paragraph("The Sequence Diagram depicts the time-ordered message exchange among 5 participating lifelines: <code>User</code>, <code>Web App</code>, <code>Server</code>, <code>Database</code>, and <code>AI Service (OpenAI API)</code>.", ans_style))

    seq_img = os.path.join(img_dir, '4_sequence.png')
    if os.path.exists(seq_img):
        story.append(Image(seq_img, width=460, height=415))
        story.append(Paragraph("Figure 2.4: Sequence Diagram of Authentication, Mood Logging, and AI Chat", caption_style))

    seq_desc = [
        [Paragraph("<b>Phase / Flow</b>", tbl_header_style), Paragraph("<b>Message Sequence (1 to 17)</b>", tbl_header_style)],
        [
            Paragraph("<b>1. Authentication</b>", tbl_cell_style),
            Paragraph("1. Login Request $\\rightarrow$ 2. Verify User $\\rightarrow$ 3. Check Credentials $\\rightarrow$ 4. User Data $\\rightarrow$ 5. Login Success $\\rightarrow$ 6. Dashboard Data returned to User.", tbl_cell_style)
        ],
        [
            Paragraph("<b>2. Save Mood</b>", tbl_cell_style),
            Paragraph("7. Save Mood $\\rightarrow$ 8. Store Mood $\\rightarrow$ 9. Insert Mood in DB $\\rightarrow$ 10. Success $\\rightarrow$ 11. Save Success returned to User.", tbl_cell_style)
        ],
        [
            Paragraph("<b>3. AI Interaction</b>", tbl_cell_style),
            Paragraph("12. Send Message $\\rightarrow$ 13. Forward Message $\\rightarrow$ 14. Send to AI Service $\\rightarrow$ 15. AI Response $\\rightarrow$ 16. Return Response $\\rightarrow$ 17. Show Reply in Chat UI.", tbl_cell_style)
        ]
    ]
    t_seq = Table(seq_desc, colWidths=[120, 403.27])
    t_seq.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_seq)

    story.append(PageBreak())

    # ==========================================
    # PAGE 8: 4.5 COMPONENT DIAGRAM
    # ==========================================
    story.append(section_banner("Assignment 2: UML Modeling — 4.5 Component Diagram"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>4.5 Component Diagram Architectural Tiers</b>", sub_sec_header))
    story.append(Paragraph("The Component Diagram visualizes the physical breakdown of the software into autonomous, loosely coupled modules across client, application, database, and cloud service layers.", ans_style))

    comp_img = os.path.join(img_dir, '5_component.png')
    if os.path.exists(comp_img):
        story.append(Image(comp_img, width=470, height=415))
        story.append(Paragraph("Figure 2.5: Component Diagram showcasing Modular Multi-Tier Architecture", caption_style))

    comp_desc = [
        [Paragraph("<b>Architectural Layer</b>", tbl_header_style), Paragraph("<b>Components & Sub-Modules Included</b>", tbl_header_style), Paragraph("<b>Primary Responsibility</b>", tbl_header_style)],
        [
            Paragraph("<b>Client Tier</b>", tbl_cell_style),
            Paragraph("Web Browser (HTML5, CSS3, JavaScript)", tbl_cell_style),
            Paragraph("Renders UI, handles audio recording and forms.", tbl_cell_style)
        ],
        [
            Paragraph("<b>Application Tier</b>", tbl_cell_style),
            Paragraph("Web Application (PHP / Python Flask):<br/>• User Module &nbsp;• Mood Module<br/>• Journal Module • Chatbot Module<br/>• Analytics Module • Therapist Module", tbl_cell_style),
            Paragraph("Executes business logic, authenticates requests, processes analytics, and connects to data/APIs.", tbl_cell_style)
        ],
        [
            Paragraph("<b>Data & Cloud Tier</b>", tbl_cell_style),
            Paragraph("• Database (MySQL)<br/>• External APIs (OpenAI, Google Maps)", tbl_cell_style),
            Paragraph("Persists application state; provides AI natural language reasoning and therapist geolocation.", tbl_cell_style)
        ]
    ]
    t_comp = Table(comp_desc, colWidths=[110, 220, 193.27])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_comp)

    story.append(PageBreak())

    # ==========================================
    # PAGE 9: ASSIGNMENT 3
    # ==========================================
    story.append(section_banner("Assignment 3: Software Development Life Cycle (SDLC)"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("1. What is Project Life Cycle and its Main Characteristics?", q_title_style))
    story.append(Paragraph("<b>Definition:</b> The Project Life Cycle encompasses the formal sequence of phases through which a software project transitions from inception to project close: <b>Initiation $\\rightarrow$ Planning $\\rightarrow$ Execution $\\rightarrow$ Monitoring & Controlling $\\rightarrow$ Project Closure</b>.<br/>"
                           "<b>Main Characteristics:</b><br/>"
                           "1. <b>Distinct Phase Boundaries:</b> Every phase features explicit prerequisites, entrance criteria, milestone work products, and exit sign-offs.<br/>"
                           "2. <b>Staffing & Expenditure Curve:</b> Costs and human resources begin low, reach peak intensity during coding and integration, and drop rapidly toward delivery.<br/>"
                           "3. <b>Uncertainty & Risk Profile:</b> Risk and ambiguity are at their highest at project initiation and decrease progressively as requirements and architectures freeze.<br/>"
                           "4. <b>Cost of Modification:</b> Altering specifications is inexpensive early in planning, but becomes exponentially costly once coding, testing, and deployment commence.", ans_style))

    story.append(Paragraph("2. Explain the following SDLC models:", q_title_style))

    sdlc_models = [
        ("i) Waterfall Model",
         "A linear sequential SDLC model where development proceeds monotonically downward through distinct phases: Requirements $\\rightarrow$ Design $\\rightarrow$ Implementation $\\rightarrow$ Testing $\\rightarrow$ Deployment $\\rightarrow$ Maintenance. Each phase must finish completely before the next commences.<br/>"
         "• <i>Strengths:</i> High structure, simple milestone tracking, and extensive formal documentation.<br/>"
         "• <i>Weaknesses:</i> Extremely rigid; late defect discovery; impossible to accommodate shifting requirements.<br/>"
         "• <i>Best Application:</i> Small projects with fixed scope and thoroughly understood requirements."),

        ("ii) Iterative Model",
         "Develops a partial working baseline of the system first and incrementally enhances functionality across repeated cyclical iterations until the full system is completed.<br/>"
         "• <i>Strengths:</i> Delivers working software early; enables stakeholder feedback to shape subsequent cycles.<br/>"
         "• <i>Weaknesses:</i> Demands vigilant architecture governance; risk of feature creep and scope ballooning.<br/>"
         "• <i>Best Application:</i> Large-scale software systems where fundamental objectives are defined but details evolve."),

        ("iii) Spiral Model",
         "A risk-driven meta-model combining iterative prototyping with Waterfall discipline. It progresses through 4 repeating quadrants: (1) Determine Objectives, (2) Identify & Resolve Risks via prototypes, (3) Develop & Verify, and (4) Plan Next Iteration.<br/>"
         "• <i>Strengths:</i> World-class risk management; prevents disastrous project failures.<br/>"
         "• <i>Weaknesses:</i> Costly; demands rare risk assessment expertise; unsuitable for small or low-budget projects.<br/>"
         "• <i>Best Application:</i> Mission-critical, high-uncertainty, large enterprise software."),

        ("iv) V-shaped Model (Verification & Validation)",
         "An extension of the Waterfall model where each development (Verification) phase is executed with a corresponding testing (Validation) phase planned in parallel:<br/>"
         "&nbsp;&nbsp;– Requirements Analysis $\\leftrightarrow$ Acceptance Testing<br/>"
         "&nbsp;&nbsp;– System Architecture Design $\\leftrightarrow$ System Testing<br/>"
         "&nbsp;&nbsp;– Module / Component Design $\\leftrightarrow$ Integration Testing<br/>"
         "&nbsp;&nbsp;– Coding $\\leftrightarrow$ Unit Testing<br/>"
         "• <i>Strengths:</i> Early test case design; high discipline; excellent bug prevention.<br/>"
         "• <i>Weaknesses:</i> Inflexible to mid-project requirement revisions; lacks early prototype capability.<br/>"
         "• <i>Best Application:</i> High-integrity systems (e.g., medical devices, avionics, defense software)."),

        ("v) Agile Model",
         "A collaborative, iterative, and incremental philosophy based on the Agile Manifesto. It delivers functional software in short, timeboxed sprints (1–4 weeks), emphasizing customer collaboration, adaptability, and working software over rigid documentation.<br/>"
         "• <i>Strengths:</i> Highly responsive to changing client needs; rapid time-to-market; continuous feedback.<br/>"
         "• <i>Weaknesses:</i> Less formal documentation; requires high client commitment; scope can expand without strict backlog grooming.<br/>"
         "• <i>Best Application:</i> Dynamic modern web/mobile applications with evolving user requirements.")
    ]

    for m_title, m_desc in sdlc_models:
        story.append(Paragraph(f"<b>{m_title}</b>", sub_sec_header))
        story.append(Paragraph(m_desc, ans_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 10: ASSIGNMENT 4 (PART 1)
    # ==========================================
    story.append(section_banner("Assignment 4: Software Testing, SCM & Quality Assurance"))
    story.append(Spacer(1, 4))

    q_a4_p1 = [
        ("1] Define Software Testing?",
         "Software Testing is the systematic engineering process of executing a software application under specified conditions to uncover bugs and defects, verify that the system satisfies all documented functional and non-functional requirements, and validate that it fulfills user needs and quality benchmarks."),

        ("2] What is Risk identification?",
         "Risk identification is the proactive initial stage of risk management wherein project, technical, operational, and commercial threats (such as scope churn, unrealistic deadlines, key developer attrition, security flaws, and third-party service downtime) are systematically identified, categorized, and documented in a risk register."),

        ("3] What is SCM (Software Configuration Management)?",
         "SCM is an engineering discipline that controls, tracks, and manages modifications to software artifacts (source code, build scripts, requirements, database schemas, test cases) across the SDLC. It ensures traceability, repeatable releases, and system integrity across software versions."),

        ("4] Define Debugging.",
         "Debugging is the diagnostic problem-solving process of detecting, isolating, analyzing, and resolving the underlying root cause of a defect, crash, or bug discovered during software testing or production execution."),

        ("5] Explain Configuration Audit.",
         "A Configuration Audit is an independent review to ensure that a configuration baseline meets all specified requirements and is ready for deployment. It comprises two audits:<br/>"
         "• <b>Functional Configuration Audit (FCA):</b> Verifies that the software product functions strictly in accordance with its software requirement specifications (SRS).<br/>"
         "• <b>Physical Configuration Audit (PCA):</b> Verifies that all required files, documentation, release notes, and configuration artifacts are physically present in the release package.")
    ]

    for q, a in q_a4_p1:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, ans_style))

    story.append(Spacer(1, 3))
    story.append(Paragraph("6] Differentiate Between Black Box Testing and White Box Testing?", q_title_style))
    bb_wb_data = [
        [Paragraph("<b>Comparison Parameter</b>", tbl_header_style), Paragraph("<b>Black Box Testing</b>", tbl_header_style), Paragraph("<b>White Box Testing</b>", tbl_header_style)],
        [Paragraph("<b>Core Focus</b>", tbl_cell_style), Paragraph("Validates external software behavior and compliance with functional specifications.", tbl_cell_style), Paragraph("Validates internal code logic, data flow, structure, and branch paths.", tbl_cell_style)],
        [Paragraph("<b>Code Visibility</b>", tbl_cell_style), Paragraph("Source code is hidden; tester acts as an end user.", tbl_cell_style), Paragraph("Source code is completely visible and scrutinized.", tbl_cell_style)],
        [Paragraph("<b>Performed By</b>", tbl_cell_style), Paragraph("Independent Software Testers, QA Engineers, and End Users.", tbl_cell_style), Paragraph("Software Developers and specialized Automation Engineers.", tbl_cell_style)],
        [Paragraph("<b>Programming Knowledge</b>", tbl_cell_style), Paragraph("Not required.", tbl_cell_style), Paragraph("Mandatory (deep knowledge of code syntax and structure).", tbl_cell_style)],
        [Paragraph("<b>Primary Techniques</b>", tbl_cell_style), Paragraph("Equivalence Partitioning, Boundary Value Analysis (BVA), Decision Tables, State Transition.", tbl_cell_style), Paragraph("Statement Coverage, Branch/Decision Coverage, Condition Coverage, Path Coverage.", tbl_cell_style)],
        [Paragraph("<b>Typical Testing Level</b>", tbl_cell_style), Paragraph("System Testing, Functional Testing, Acceptance Testing (UAT).", tbl_cell_style), Paragraph("Unit Testing, Component Testing, Integration Testing.", tbl_cell_style)]
    ]
    t_bb_wb = Table(bb_wb_data, colWidths=[110, 206.6, 206.6])
    t_bb_wb.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_bb_wb)

    story.append(PageBreak())

    # ==========================================
    # PAGE 11: ASSIGNMENT 4 (PART 2)
    # ==========================================
    story.append(section_banner("Assignment 4: Software Testing, SCM & Quality Assurance (Continued)"))
    story.append(Spacer(1, 4))

    q_a4_p2 = [
        ("7] What Do You Mean By Metrics?",
         "Software Metrics are standard quantitative measurements used to assess, track, and optimize the quality, productivity, and performance of software products and development processes.<br/>"
         "• <b>Product Metrics:</b> Measure software attributes directly (e.g., Lines of Code - LOC, Cyclomatic Complexity, Defect Density).<br/>"
         "• <b>Process Metrics:</b> Measure development efficiency (e.g., Defect Removal Efficiency - DRE, Mean Time to Detect - MTTD, Lead Time).<br/>"
         "• <b>Project Metrics:</b> Measure project trajectory (e.g., Schedule Variance, Cost Variance, Test Pass Rate %)."),

        ("8] What Do You Mean By Version Control?",
         "Version Control (or Source Code Management) is a system (e.g., <b>Git</b>, Subversion) that records incremental revisions made to codebases over time. It allows engineering teams to examine audit logs of historical edits, roll back to prior stable commits, compare line-by-line differences, and collaborate concurrently through branching and merging without overwriting each other's work."),

        ("9] Explain Object Oriented Software Engineering (OOSE)?",
         "Object Oriented Software Engineering (OOSE) is a development methodology that conceives software systems as networks of interacting, autonomous <b>objects</b> encapsulating both internal data attributes and functional behaviors. It leverages four cornerstone Object-Oriented principles:<br/>"
         "• <b>Abstraction:</b> Exposes only essential interfaces while concealing implementation intricacies.<br/>"
         "• <b>Encapsulation:</b> Bundles data and methods securely within class boundaries to prevent unauthorized mutation.<br/>"
         "• <b>Inheritance:</b> Establishes hierarchical relationships enabling code reuse and specialization.<br/>"
         "• <b>Polymorphism:</b> Enables entities to take on different behaviors dynamically via method overloading and overriding.<br/>"
         "OOSE fosters high modularity, high cohesion, low coupling, and enhanced software reusability."),

        ("10] Explain Various Types of Testing in details.",
         "Software testing is broadly categorized into <b>Functional</b> and <b>Non-Functional</b> testing tiers:<br/>"
         "1. <b>Unit Testing:</b> Verifies the correctness of individual functions, methods, or isolated modules (using frameworks like PyTest, JUnit).<br/>"
         "2. <b>Integration Testing:</b> Verifies interface compatibility and seamless data transfer between interconnected modules.<br/>"
         "3. <b>System Testing:</b> Evaluates the complete, integrated software build against the comprehensive business requirements.<br/>"
         "4. <b>Acceptance Testing (UAT):</b> Executed by end users or clients to confirm the software is ready for production rollout.<br/>"
         "5. <b>Regression Testing:</b> Re-executing existing test suites after code changes to confirm prior features remain unbroken.<br/>"
         "6. <b>Performance & Load Testing:</b> Assesses application latency, memory consumption, throughput, and stability under heavy concurrent traffic.<br/>"
         "7. <b>Security Testing:</b> Identifies vulnerabilities, SQL injection risks, authentication bypasses, and data encryption flaws.")
    ]

    for q, a in q_a4_p2:
        story.append(Paragraph(q, q_title_style))
        story.append(Paragraph(a, ans_style))

    story.append(Spacer(1, 3))
    story.append(Paragraph("11] Differentiate Between Automated Testing and Manual Testing.", q_title_style))
    man_auto_data = [
        [Paragraph("<b>Comparison Parameter</b>", tbl_header_style), Paragraph("<b>Manual Testing</b>", tbl_header_style), Paragraph("<b>Automated Testing</b>", tbl_header_style)],
        [Paragraph("<b>Execution Mode</b>", tbl_cell_style), Paragraph("Carried out manually by human testers navigating the application step-by-step.", tbl_cell_style), Paragraph("Executed automatically via test automation scripts, frameworks, and tools.", tbl_cell_style)],
        [Paragraph("<b>Execution Speed</b>", tbl_cell_style), Paragraph("Slow, time-consuming, and labor-intensive.", tbl_cell_style), Paragraph("Significantly faster; can run thousands of tests rapidly.", tbl_cell_style)],
        [Paragraph("<b>Human Error & Fatigue</b>", tbl_cell_style), Paragraph("Prone to human error, missed steps, and fatigue during repetitive runs.", tbl_cell_style), Paragraph("Zero fatigue; results are consistent, exact, and repeatable.", tbl_cell_style)],
        [Paragraph("<b>Cost Efficiency</b>", tbl_cell_style), Paragraph("Lower initial cost; high recurring cost per test execution.", tbl_cell_style), Paragraph("Higher initial setup and tool cost; very low cost per run over time.", tbl_cell_style)],
        [Paragraph("<b>Ideal Use Cases</b>", tbl_cell_style), Paragraph("Exploratory testing, UI/UX evaluation, and ad-hoc usability testing.", tbl_cell_style), Paragraph("Regression testing, load/stress testing, and continuous integration (CI/CD).", tbl_cell_style)],
        [Paragraph("<b>Popular Tools</b>", tbl_cell_style), Paragraph("Postman (manual API calls), Bugzilla, Jira, TestRail.", tbl_cell_style), Paragraph("Selenium, Playwright, Cypress, JUnit, PyTest, JMeter.", tbl_cell_style)]
    ]
    t_man_auto = Table(man_auto_data, colWidths=[110, 206.6, 206.6])
    t_man_auto.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_man_auto)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF build successful! Output saved at:", pdf_filename)

if __name__ == "__main__":
    create_assignments_pdf()
