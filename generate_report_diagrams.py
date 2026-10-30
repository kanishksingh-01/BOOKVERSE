import os
os.environ['MPLCONFIGDIR'] = '/tmp/mpl'
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle

out_dir = '/Users/kanishksingh/Downloads/aditya pawar/diagrams'
os.makedirs(out_dir, exist_ok=True)

# -------------------------------------------------------------
# 1. DECISION TREE
# -------------------------------------------------------------
def create_decision_tree():
    fig, ax = plt.subplots(figsize=(8, 11), dpi=200)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)
    ax.axis('off')

    def draw_box(x, y, w, h, text, color='#FFFFFF', edge='#1E3A8A', lw=1.5):
        rect = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.1",
                              facecolor=color, edgecolor=edge, linewidth=lw)
        ax.add_patch(rect)
        ax.text(x, y, text, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#0F172A')

    def draw_arrow(x1, y1, x2, y2, label=''):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="#1E3A8A", lw=1.5))
        if label:
            ax.text((x1+x2)/2 + 0.2, (y1+y2)/2, label, fontsize=8.5, color='#475569', fontweight='bold')

    # Top: Start
    draw_arrow(5, 13.8, 5, 12.8)
    draw_box(5, 12.4, 3.4, 0.8, "Login / Register")

    # Split to Register & Login
    draw_arrow(4.2, 12.0, 2.5, 10.9)
    draw_arrow(5.8, 12.0, 7.5, 10.9)
    draw_box(2.5, 10.5, 2.8, 0.7, "Register")
    draw_box(7.5, 10.5, 2.8, 0.7, "Login")

    # Enter Details / Verify
    draw_arrow(2.5, 10.15, 2.5, 9.35)
    draw_box(2.5, 8.95, 3.0, 0.7, "Enter User Profile")

    draw_arrow(7.5, 10.15, 7.5, 9.35)
    draw_box(7.5, 8.95, 3.0, 0.7, "Verify Credentials")

    # Branch Login results
    draw_arrow(2.5, 8.6, 2.5, 7.6)
    draw_box(2.5, 7.2, 3.0, 0.7, "Account Created")

    draw_arrow(6.7, 8.6, 5.5, 7.6)
    draw_box(5.5, 7.2, 2.4, 0.7, "Login Failed")

    draw_arrow(8.3, 8.6, 8.8, 7.6)
    draw_box(8.8, 7.2, 2.6, 0.7, "Login Success")

    # Convergence to Dashboard
    draw_arrow(2.5, 6.85, 4.5, 5.75)
    draw_arrow(8.8, 6.85, 5.5, 5.75)
    draw_box(5, 5.4, 5.2, 0.8, "Track Mood, Journal, Quiz or Chat", color='#F1F5F9')

    draw_arrow(5, 5.0, 5, 4.2)
    draw_box(5, 3.8, 4.0, 0.8, "Analyze Emotional State", color='#E2E8F0')

    # Outcomes
    draw_arrow(4.2, 3.4, 2.2, 2.4)
    draw_arrow(5.0, 3.4, 5.0, 2.4)
    draw_arrow(5.8, 3.4, 7.8, 2.4)

    draw_box(2.2, 2.0, 3.0, 0.8, "Suggest Mood Activity\n& Daily Quotes")
    draw_box(5.0, 2.0, 2.8, 0.8, "AI Companion Advice\n& Breathing Guide")
    draw_box(7.8, 2.0, 3.0, 0.8, "Show Nearby Therapist\n& Emergency SOS")

    # Converge to End
    draw_arrow(2.2, 1.6, 4.2, 0.9)
    draw_arrow(5.0, 1.6, 5.0, 0.9)
    draw_arrow(7.8, 1.6, 5.8, 0.9)
    draw_box(5, 0.6, 2.4, 0.6, "End", color='#F8FAFC', edge='#0F172A')

    plt.tight_layout()
    fig.savefig(f'{out_dir}/decision_tree.png', bbox_inches='tight')
    plt.close(fig)
    print("Created decision_tree.png")

# -------------------------------------------------------------
# 2. ER DIAGRAM
# -------------------------------------------------------------
def create_er_diagram():
    fig, ax = plt.subplots(figsize=(10, 8), dpi=220)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Center: USER
    rect = patches.Rectangle((4.8, 4.4), 2.4, 1.2, edgecolor='#1E3A8A', facecolor='#EFF6FF', lw=2)
    ax.add_patch(rect)
    ax.text(6.0, 5.0, "USER", ha='center', va='center', fontsize=12, fontweight='bold', color='#1E3A8A')

    # Attributes of User
    def draw_ellipse(x, y, text, w=1.5, h=0.6, pk=False):
        el = patches.Ellipse((x, y), w, h, edgecolor='#1E3A8A', facecolor='#FFFFFF', lw=1.2)
        ax.add_patch(el)
        txt = f"underline{{{text}}}" if pk else text
        ax.text(x, y, text, ha='center', va='center', fontsize=7.5,
                fontweight='bold' if pk else 'normal', color='#0F172A')

    draw_ellipse(6.0, 6.3, "userId (PK)", 1.7, 0.6, True)
    ax.plot([6.0, 6.0], [5.6, 6.0], color='#1E3A8A', lw=1)

    draw_ellipse(4.4, 6.1, "email", 1.4, 0.5)
    ax.plot([5.0, 4.7], [5.6, 5.85], color='#1E3A8A', lw=1)

    draw_ellipse(7.6, 6.1, "name", 1.4, 0.5)
    ax.plot([7.0, 7.3], [5.6, 5.85], color='#1E3A8A', lw=1)

    draw_ellipse(6.0, 3.7, "password", 1.5, 0.5)
    ax.plot([6.0, 6.0], [4.4, 4.0], color='#1E3A8A', lw=1)

    # Relationships (Diamonds) & Entities
    # 1. MOOD (Top-Left)
    # Diamond
    ax.plot([3.0, 3.5, 3.0, 2.5, 3.0], [7.0, 7.5, 8.0, 7.5, 7.0], color='#1E3A8A', lw=1.5)
    ax.text(3.0, 7.5, "LOGS", ha='center', va='center', fontsize=8, fontweight='bold')
    ax.plot([5.2, 3.5], [5.6, 7.5], color='#1E3A8A', lw=1.2)
    ax.text(4.7, 6.3, "1", fontsize=9, fontweight='bold')

    # Entity: MOOD
    r_mood = patches.Rectangle((0.8, 7.0), 1.8, 1.0, edgecolor='#1E3A8A', facecolor='#F8FAFC', lw=1.5)
    ax.add_patch(r_mood)
    ax.text(1.7, 7.5, "MOOD", ha='center', va='center', fontsize=9.5, fontweight='bold')
    ax.plot([2.5, 2.6], [7.5, 7.5], color='#1E3A8A', lw=1.2)
    ax.text(2.65, 7.65, "M", fontsize=9, fontweight='bold')

    draw_ellipse(1.7, 8.7, "moodId (PK)", 1.6, 0.5, True)
    ax.plot([1.7, 1.7], [8.0, 8.45], color='#1E3A8A', lw=1)
    draw_ellipse(0.5, 8.4, "mood", 1.1, 0.45)
    ax.plot([1.0, 0.6], [8.0, 8.2], color='#1E3A8A', lw=1)
    draw_ellipse(2.8, 8.4, "date/time", 1.3, 0.45)
    ax.plot([2.4, 2.6], [8.0, 8.2], color='#1E3A8A', lw=1)

    # 2. JOURNAL (Bottom-Left)
    ax.plot([3.0, 3.5, 3.0, 2.5, 3.0], [2.2, 2.7, 3.2, 2.7, 2.2], color='#1E3A8A', lw=1.5)
    ax.text(3.0, 2.7, "WRITES", ha='center', va='center', fontsize=8, fontweight='bold')
    ax.plot([5.2, 3.5], [4.4, 2.7], color='#1E3A8A', lw=1.2)
    ax.text(4.7, 3.3, "1", fontsize=9, fontweight='bold')

    r_j = patches.Rectangle((0.8, 2.2), 1.8, 1.0, edgecolor='#1E3A8A', facecolor='#F8FAFC', lw=1.5)
    ax.add_patch(r_j)
    ax.text(1.7, 2.7, "JOURNAL", ha='center', va='center', fontsize=9.5, fontweight='bold')
    ax.plot([2.5, 2.6], [2.7, 2.7], color='#1E3A8A', lw=1.2)
    ax.text(2.65, 2.85, "M", fontsize=9, fontweight='bold')

    draw_ellipse(1.7, 1.4, "journalId (PK)", 1.7, 0.5, True)
    ax.plot([1.7, 1.7], [2.2, 1.65], color='#1E3A8A', lw=1)
    draw_ellipse(0.5, 1.6, "text", 1.1, 0.45)
    ax.plot([1.0, 0.6], [2.2, 1.8], color='#1E3A8A', lw=1)

    # 3. QUESTIONNAIRE (Top-Right)
    ax.plot([9.0, 9.5, 9.0, 8.5, 9.0], [7.0, 7.5, 8.0, 7.5, 7.0], color='#1E3A8A', lw=1.5)
    ax.text(9.0, 7.5, "TAKES", ha='center', va='center', fontsize=8, fontweight='bold')
    ax.plot([6.8, 8.5], [5.6, 7.5], color='#1E3A8A', lw=1.2)
    ax.text(7.3, 6.3, "1", fontsize=9, fontweight='bold')

    r_q = patches.Rectangle((9.8, 7.0), 2.0, 1.0, edgecolor='#1E3A8A', facecolor='#F8FAFC', lw=1.5)
    ax.add_patch(r_q)
    ax.text(10.8, 7.5, "QUESTIONNAIRE", ha='center', va='center', fontsize=8.5, fontweight='bold')
    ax.plot([9.5, 9.8], [7.5, 7.5], color='#1E3A8A', lw=1.2)
    ax.text(9.6, 7.65, "M", fontsize=9, fontweight='bold')

    draw_ellipse(10.8, 8.7, "questionId (PK)", 1.8, 0.5, True)
    ax.plot([10.8, 10.8], [8.0, 8.45], color='#1E3A8A', lw=1)
    draw_ellipse(9.6, 8.4, "stressScore", 1.4, 0.45)
    ax.plot([10.2, 9.8], [8.0, 8.2], color='#1E3A8A', lw=1)
    draw_ellipse(11.8, 8.4, "anxietyScore", 1.4, 0.45)
    ax.plot([11.4, 11.6], [8.0, 8.2], color='#1E3A8A', lw=1)

    # 4. THERAPIST / SOS (Bottom-Right)
    ax.plot([9.0, 9.5, 9.0, 8.5, 9.0], [2.2, 2.7, 3.2, 2.7, 2.2], color='#1E3A8A', lw=1.5)
    ax.text(9.0, 2.7, "RECEIVES", ha='center', va='center', fontsize=8, fontweight='bold')
    ax.plot([6.8, 8.5], [4.4, 2.7], color='#1E3A8A', lw=1.2)
    ax.text(7.3, 3.3, "1", fontsize=9, fontweight='bold')

    r_t = patches.Rectangle((9.8, 2.2), 2.0, 1.0, edgecolor='#1E3A8A', facecolor='#F8FAFC', lw=1.5)
    ax.add_patch(r_t)
    ax.text(10.8, 2.7, "THERAPIST / SOS", ha='center', va='center', fontsize=8.5, fontweight='bold')
    ax.plot([9.5, 9.8], [2.7, 2.7], color='#1E3A8A', lw=1.2)
    ax.text(9.6, 2.85, "M", fontsize=9, fontweight='bold')

    draw_ellipse(10.8, 1.4, "therapistId (PK)", 1.8, 0.5, True)
    ax.plot([10.8, 10.8], [2.2, 1.65], color='#1E3A8A', lw=1)
    draw_ellipse(9.6, 1.6, "address/loc", 1.4, 0.45)
    ax.plot([10.2, 9.8], [2.2, 1.8], color='#1E3A8A', lw=1)
    draw_ellipse(11.8, 1.6, "phone", 1.2, 0.45)
    ax.plot([11.4, 11.6], [2.2, 1.8], color='#1E3A8A', lw=1)

    plt.tight_layout()
    fig.savefig(f'{out_dir}/er_diagram.png', bbox_inches='tight')
    plt.close(fig)
    print("Created er_diagram.png")

# -------------------------------------------------------------
# 3. OBJECT DIAGRAM
# -------------------------------------------------------------
def create_object_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 10), dpi=220)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 12)
    ax.axis('off')

    def draw_obj(x, y, w, h, title, lines):
        rect = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="square,pad=0.0",
                              facecolor='#FFFFFF', edgecolor='#1E3A8A', linewidth=1.5)
        ax.add_patch(rect)
        # Title bar line
        header_h = 0.5
        ax.plot([x - w/2, x + w/2], [y + h/2 - header_h, y + h/2 - header_h], color='#1E3A8A', lw=1.2)
        ax.text(x, y + h/2 - header_h/2, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#1E3A8A')
        # Content
        line_text = "\n".join(lines)
        ax.text(x - w/2 + 0.15, y + h/2 - header_h - 0.15, line_text, ha='left', va='top', fontsize=8, color='#0F172A', linespacing=1.3)

    # Top: User Instance
    draw_obj(5.0, 10.2, 4.4, 2.0, "user1 : User", [
        "userId = 101",
        "name = \"Aditya Pawar\"",
        "email = \"aditya.pawar@istu.ac.in\"",
        "password = \"••••••••\""
    ])

    # Connecting arrows
    ax.annotate('', xy=(2.5, 7.8), xytext=(4.0, 9.2), arrowprops=dict(arrowstyle="->", color="#1E3A8A", lw=1.5))
    ax.annotate('', xy=(7.5, 7.8), xytext=(6.0, 9.2), arrowprops=dict(arrowstyle="->", color="#1E3A8A", lw=1.5))

    # Middle Left: Mood Instance
    draw_obj(2.5, 6.7, 4.0, 2.0, "mood1 : Mood", [
        "moodId = 201",
        "userId = 101",
        "mood = \"Optimistic\"",
        "date = \"2026-10-30\"",
        "time = \"10:30 AM\""
    ])

    # Middle Right: Journal Instance
    draw_obj(7.5, 6.7, 4.0, 2.0, "journal1 : Journal", [
        "journalId = 301",
        "userId = 101",
        "text = \"Prepared my SE report today.\"",
        "date = \"2026-10-30\""
    ])

    # Connecting arrows
    ax.annotate('', xy=(2.5, 3.8), xytext=(2.5, 5.7), arrowprops=dict(arrowstyle="->", color="#1E3A8A", lw=1.5))
    ax.annotate('', xy=(7.5, 3.8), xytext=(7.5, 5.7), arrowprops=dict(arrowstyle="->", color="#1E3A8A", lw=1.5))

    # Bottom Left: Questionnaire Instance
    draw_obj(2.5, 2.6, 4.0, 2.2, "quiz1 : Questionnaire", [
        "questionId = 401",
        "userId = 101",
        "stressScore = 2 (Low)",
        "anxietyScore = 1 (Normal)",
        "happinessScore = 8 (High)",
        "date = \"2026-10-30\""
    ])

    # Bottom Right: Therapist Instance
    draw_obj(7.5, 2.6, 4.0, 2.2, "therapist1 : Therapist", [
        "therapistId = 501",
        "name = \"Dr. Sunita Kulkarni\"",
        "phone = \"+91 98220 12345\"",
        "address = \"Wagholi, Pune - 412207\"",
        "latitude = 18.5793",
        "longitude = 73.9806"
    ])

    plt.tight_layout()
    fig.savefig(f'{out_dir}/object_diagram.png', bbox_inches='tight')
    plt.close(fig)
    print("Created object_diagram.png")

# -------------------------------------------------------------
# 4. DATA FLOW DIAGRAM (DFD)
# -------------------------------------------------------------
def create_dfd_diagram():
    fig, ax = plt.subplots(figsize=(7, 10.5), dpi=220)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 13)
    ax.axis('off')

    def draw_entity(x, y, w, h, text):
        rect = patches.Rectangle((x - w/2, y - h/2), w, h, facecolor='#FFFFFF', edgecolor='#0F172A', lw=2)
        ax.add_patch(rect)
        ax.text(x, y, text, ha='center', va='center', fontsize=11, fontweight='bold', color='#0F172A')

    def draw_process(x, y, w, h, num, text):
        rect = FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.1",
                              facecolor='#EFF6FF', edgecolor='#1E3A8A', lw=1.8)
        ax.add_patch(rect)
        full_text = f"{num}. {text}"
        ax.text(x, y, full_text, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#1E3A8A')

    def draw_store(x, y, w, h, text):
        # Open ended rectangle
        ax.plot([x - w/2, x + w/2], [y + h/2, y + h/2], color='#1E3A8A', lw=2)
        ax.plot([x - w/2, x + w/2], [y - h/2, y - h/2], color='#1E3A8A', lw=2)
        ax.plot([x - w/2, x - w/2], [y - h/2, y + h/2], color='#1E3A8A', lw=2)
        ax.text(x, y, text, ha='center', va='center', fontsize=10, fontweight='bold', color='#1E3A8A')

    def draw_arrow(x1, y1, x2, y2, label=''):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="#1E3A8A", lw=1.5))
        if label:
            ax.text((x1+x2)/2 + 0.15, (y1+y2)/2, label, fontsize=8, color='#334155', fontweight='bold')

    # External Entity: User
    draw_entity(5, 12.0, 2.8, 0.8, "USER")

    # Process 1: Authentication
    draw_arrow(5, 11.6, 5, 10.7, "Credentials")
    draw_process(5, 10.2, 5.2, 0.8, "1", "User Authentication\n(Register / Login)")

    # Process 2: Mood & Journal Processing
    draw_arrow(5, 9.8, 5, 8.9, "Daily Entries")
    draw_process(5, 8.4, 5.2, 0.8, "2", "Mood & Journal Logging\n(Text & Voice Recordings)")

    # Process 3: Questionnaire Assessment
    draw_arrow(5, 8.0, 5, 7.1, "Responses")
    draw_process(5, 6.6, 5.2, 0.8, "3", "Mental Health Assessment\n(PHQ-9 / GAD-7 Scoring)")

    # Process 4: AI Emotional Support
    draw_arrow(5, 6.2, 5, 5.3, "Chat Messages")
    draw_process(5, 4.8, 5.2, 0.8, "4", "AI Companion Chatbot\n(OpenAI API Reasoning)")

    # Process 5: Therapist & SOS
    draw_arrow(5, 4.4, 5, 3.5, "SOS Request")
    draw_process(5, 3.0, 5.2, 0.8, "5", "Therapist Locator & SOS\n(Google Maps API)")

    # Data Store: MySQL Database
    draw_arrow(5, 2.6, 5, 1.6, "Persist Data")
    draw_store(5, 1.0, 4.4, 0.9, "D1: MySQL Database")

    plt.tight_layout()
    fig.savefig(f'{out_dir}/dfd_diagram.png', bbox_inches='tight')
    plt.close(fig)
    print("Created dfd_diagram.png")

# -------------------------------------------------------------
# 5. UI SCREENS
# -------------------------------------------------------------
def create_ui_screens():
    # Screen 1: Dashboard
    fig, ax = plt.subplots(figsize=(9, 5.5), dpi=220)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')

    # Browser Frame
    bg = patches.Rectangle((0.2, 0.2), 11.6, 7.6, facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.5)
    ax.add_patch(bg)

    # Navbar
    nav = patches.Rectangle((0.2, 6.9), 11.6, 0.9, facecolor='#1E3A8A')
    ax.add_patch(nav)
    ax.text(0.6, 7.35, "MindCare AI  |  Personal Wellness Companion", color='#FFFFFF', fontsize=11, fontweight='bold', va='center')
    ax.text(10.8, 7.35, "Aditya Pawar ▼", color='#93C5FD', fontsize=9.5, fontweight='bold', va='center')

    # Hero Card
    hero = patches.Rectangle((0.6, 5.2), 10.8, 1.4, facecolor='#EFF6FF', edgecolor='#BFDBFE', lw=1)
    ax.add_patch(hero)
    ax.text(0.9, 6.1, "Welcome back, Aditya! 👋", fontsize=12, fontweight='bold', color='#1E3A8A')
    ax.text(0.9, 5.65, "\"Peace begins with a single conscious breath.\" – Daily Mindfulness Quote", fontsize=8.5, color='#475569', fontstyle='italic')

    # Mood Selector Buttons
    ax.text(0.6, 4.8, "How are you feeling right now?", fontsize=10, fontweight='bold', color='#0F172A')
    moods = [("😄 Great", "#DCFCE7", "#166534"), ("😊 Calm", "#E0F2FE", "#075985"), ("😐 Neutral", "#F1F5F9", "#475569"),
             ("😔 Anxious", "#FEF3C7", "#92400E"), ("😫 Stressed", "#FEE2E2", "#991B1B")]
    for i, (m_txt, bg_c, fg_c) in enumerate(moods):
        bx = patches.Rectangle((0.6 + i*2.2, 3.8), 2.0, 0.7, facecolor=bg_c, edgecolor=fg_c, lw=1)
        ax.add_patch(bx)
        ax.text(0.6 + i*2.2 + 1.0, 4.15, m_txt, ha='center', va='center', fontsize=8.5, fontweight='bold', color=fg_c)

    # Cards: 3 Action Modules
    modules = [
        ("Daily Journal & Voice Note", "Record today's reflections or audio notes.", "#F8FAFC"),
        ("AI Friend Companion", "Chat with AI for coping exercises & guidance.", "#F0FDFA"),
        ("Nearby Therapist & Help", "Locate certified counseling clinics in Pune.", "#FEF2F2")
    ]
    for i, (title, desc, bg_c) in enumerate(modules):
        card = patches.Rectangle((0.6 + i*3.7, 0.6), 3.4, 2.7, facecolor=bg_c, edgecolor='#CBD5E1', lw=1)
        ax.add_patch(card)
        ax.text(0.6 + i*3.7 + 0.2, 3.0, title, fontsize=9.5, fontweight='bold', color='#1E3A8A')
        ax.text(0.6 + i*3.7 + 0.2, 2.4, desc, fontsize=8, color='#475569')
        btn = patches.Rectangle((0.6 + i*3.7 + 0.2, 1.0), 1.8, 0.5, facecolor='#1E3A8A')
        ax.add_patch(btn)
        ax.text(0.6 + i*3.7 + 1.1, 1.25, "Open Module →", ha='center', va='center', fontsize=7.5, color='#FFFFFF', fontweight='bold')

    plt.tight_layout()
    fig.savefig(f'{out_dir}/ui_dashboard.png', bbox_inches='tight')
    plt.close(fig)
    print("Created ui_dashboard.png")

    # Screen 2: AI Chat & Journal Module
    fig, ax = plt.subplots(figsize=(9, 5.5), dpi=220)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')

    bg2 = patches.Rectangle((0.2, 0.2), 11.6, 7.6, facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1.5)
    ax.add_patch(bg2)

    nav2 = patches.Rectangle((0.2, 6.9), 11.6, 0.9, facecolor='#1E3A8A')
    ax.add_patch(nav2)
    ax.text(0.6, 7.35, "MindCare AI  |  Interactive AI Companion & Journal", color='#FFFFFF', fontsize=11, fontweight='bold', va='center')

    # Left: Journal Entry Form
    j_card = patches.Rectangle((0.6, 0.6), 5.2, 6.0, facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(j_card)
    ax.text(0.9, 6.2, "Reflective Journal & Audio", fontsize=11, fontweight='bold', color='#1E3A8A')
    ax.text(0.9, 5.7, "Write your thoughts or record an audio note:", fontsize=8, color='#475569')

    txt_box = patches.Rectangle((0.9, 2.5), 4.6, 3.0, facecolor='#F8FAFC', edgecolor='#94A3B8', lw=1)
    ax.add_patch(txt_box)
    ax.text(1.1, 5.1, "I felt a bit overwhelmed with college assignments earlier,\nbut after taking a 10-minute walk, I felt recharged and\nfocused on finishing my Software Engineering report...",
            fontsize=7.5, color='#1E293B', va='top')

    # Mic / Save buttons
    mic_btn = patches.Rectangle((0.9, 1.2), 2.1, 0.6, facecolor='#DC2626')
    ax.add_patch(mic_btn)
    ax.text(1.95, 1.5, "🎙️ Record Voice Note", ha='center', va='center', fontsize=7.5, color='#FFFFFF', fontweight='bold')

    save_btn = patches.Rectangle((3.3, 1.2), 2.2, 0.6, facecolor='#1E3A8A')
    ax.add_patch(save_btn)
    ax.text(4.4, 1.5, "💾 Save Journal", ha='center', va='center', fontsize=7.5, color='#FFFFFF', fontweight='bold')

    # Right: AI Companion Chat
    chat_card = patches.Rectangle((6.2, 0.6), 5.2, 6.0, facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(chat_card)
    ax.text(6.5, 6.2, "AI Companion Chat", fontsize=11, fontweight='bold', color='#0F766E')

    # Chat Bubbles
    user_bubble = patches.Rectangle((7.5, 4.7), 3.6, 1.1, facecolor='#EFF6FF', edgecolor='#BFDBFE', lw=1)
    ax.add_patch(user_bubble)
    ax.text(7.7, 5.25, "Aditya: I am feeling slightly anxious about the\nupcoming project deadlines.", fontsize=7.5, color='#1E3A8A')

    ai_bubble = patches.Rectangle((6.5, 2.7), 4.6, 1.7, facecolor='#F0FDFA', edgecolor='#99F6E4', lw=1)
    ax.add_patch(ai_bubble)
    ax.text(6.7, 4.0, "MindCare AI:\nIt is completely natural to feel pressure before deadlines.\nLet's take a 4-7-8 breathing exercise together, or break\nyour tasks into 3 manageable micro-goals today. You've got this!",
            fontsize=7.5, color='#0F766E')

    # Input Box
    inp = patches.Rectangle((6.5, 1.0), 3.6, 0.7, facecolor='#F8FAFC', edgecolor='#94A3B8', lw=1)
    ax.add_patch(inp)
    ax.text(6.7, 1.35, "Type a message to your AI companion...", fontsize=7.5, color='#94A3B8', va='center')

    send_btn = patches.Rectangle((10.3, 1.0), 0.8, 0.7, facecolor='#0F766E')
    ax.add_patch(send_btn)
    ax.text(10.7, 1.35, "➤", ha='center', va='center', fontsize=9, color='#FFFFFF', fontweight='bold')

    plt.tight_layout()
    fig.savefig(f'{out_dir}/ui_modules.png', bbox_inches='tight')
    plt.close(fig)
    print("Created ui_modules.png")

if __name__ == '__main__':
    create_decision_tree()
    create_er_diagram()
    create_object_diagram()
    create_dfd_diagram()
    create_ui_screens()
