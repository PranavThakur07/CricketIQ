# 🏆 CricketIQ: AI-Powered Cricket Intelligence Platform

**CricketIQ** is an advanced, production-ready AI cricket analytics and intelligence platform designed for the **GDG Noida Agentic Premier League 2026 Hackathon**. The application transforms raw cricketing statistics into high-energy, fan-friendly insights, probability projections, over-by-over momentum indicators, and generative AI match simulations.

---

## 🚀 Tech Stack

### Frontend (React + Vite)
- **Framework:** React 18 (Vite Scaffolding)
- **Styling:** Tailwind CSS (Custom Dark Stadium Night Palette)
- **Routing:** React Router v6
- **Icons:** Lucide React

### Backend (FastAPI + Python)
- **Framework:** FastAPI
- **WebServer:** Uvicorn
- **Validation:** Pydantic v2
- **Config:** Pydantic Settings
- **AI Integration:** Google Gemini API (via `google-genai` with active high-fidelity mock engines)

---

## ⚡ Key Intelligence Engines

### 1. 📊 Dashboard Landing
- A central mission control showing system analytics, active simulation states, and a real-time live match ticker simulating active scoreboard transitions. Includes recent AI match alerts from historical matchups.

### 2. 📈 Momentum Intelligence
- A custom-rendered, interactive over-by-over SVG line chart graphing team momentum index swings (+10 to -10). Selecting an over displays dynamic score updates and boundary logs.

### 3. 💬 AI Match Analyst
- An advanced chat dashboard powered by Gemini Flash models. Ask technical matchup queries, query cricket theory, or select from predefined templates to review historical batting/spin matchups.

### 4. 🔮 Win Predictor
- An interactive calculator that takes target, scores, overs completed, format, and venue parameters to compute live win probabilities, overlaying a visual gauge dial and Gemini's tactical match breakdown.

### 5. 🌟 Fantasy Assistant
- Formulates optimal 11-player roster lineups. Calibrate the risk-reward slider (from Conservative to High Risk) to dynamically refresh metrics and reveal high-leverage "differential gold" picks.

### 6. 🔄 Alternate Universe Simulator
- Spin up alternative timelines on historical matches (e.g. "What if MS Dhoni batted at #3 in the 2019 WC Semi?") to immediately generate simulated scorecards, turning points, and AI-narrated commentaries.

---

## 📁 Repository Architecture

```text
CricketIQ/
├── frontend/                     # React + Vite Application
│   ├── package.json              # Dependency manifests
│   ├── tailwind.config.js        # Stadium night color theme configurations
│   ├── postcss.config.js         # PostCSS plugins
│   ├── index.html                # Custom title & viewport tags
│   └── src/
│       ├── main.jsx              # Entry mounting
│       ├── App.jsx               # Router configs
│       ├── index.css             # Google Fonts imports & custom utilities
│       ├── components/           # UI shells
│       │   ├── Layout.jsx        # Navigation shell
│       │   ├── Sidebar.jsx       # Navigation drawer NavLinks
│       │   └── Topbar.jsx        # Headers & live score simulator tickers
│       └── pages/                # Intelligence panels
│           ├── Dashboard.jsx
│           ├── Momentum.jsx
│           ├── Analyst.jsx
│           ├── Predictor.jsx
│           ├── Fantasy.jsx
│           └── Simulator.jsx
└── backend/                      # Python FastAPI Application
    ├── requirements.txt          # Python package list
    ├── .env.example              # Template config
    ├── .env                      # Active config (port, host, API key)
    └── app/
        ├── __init__.py           # Package indicator
        ├── main.py               # CORS setup & router mounting
        ├── config.py             # Pydantic environment configurations
        ├── routes/               # Modular API endpoint routers
        │   ├── analytics.py      # Momentum charts endpoints
        │   ├── prediction.py     # Live probability calculators
        │   ├── simulator.py      # Universal simulators
        │   └── analyst.py        # Gemini chatbot endpoints
        ├── services/             # Third-party adapters
        │   └── gemini.py         # Gemini API client & intelligent fallbacks
        ├── analytics/            # Mathematics helpers
        │   └── metrics.py        # Win probability formulas
        └── models/               # Data verification layer
            └── schemas.py        # Pydantic IO models
```

---

## 🛠️ Installation & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python 3.10+](https://www.python.org/)

---

### Step 1: Start the Backend Server

1. Open a terminal and navigate into the `backend/` folder:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. (Optional) Configure your live Gemini API Key in the active `.env` file:
   ```env
   GEMINI_API_KEY=your-actual-api-key-here
   ```
   *Note: If no API key is specified, the server automatically defaults to CricketIQ's high-fidelity Mock Engine so the platform is completely operational for evaluation.*

6. Launch the FastAPI server:
   ```bash
   python app/main.py
   ```
   The backend API docs will compile and become accessible at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

### Step 2: Start the Frontend Application

1. Open a new terminal window and navigate into the `frontend/` folder:
   ```bash
   cd frontend
   ```

2. Install Node packages:
   ```bash
   npm install
   ```

3. Boot up the Vite dev server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - **[http://localhost:5173](http://localhost:5173)**

The frontend will load immediately, connecting dynamically to the local FastAPI port to serve data across all 6 sub-intelligence screens!

---

## 🏆 Hackathon Submission Standards
- **Clean Architecture:** Complete separation of concerns between presentation and computation.
- **Robust Mock Fallback:** High-fidelity analytics fallbacks for instant review without mandatory API key provision.
- **Micro-Animations:** Stadium glow outlines, dynamic SVGs, and transition effects.
