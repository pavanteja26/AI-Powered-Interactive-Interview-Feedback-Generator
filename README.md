# AI-Powered Interview Feedback Generator for Automated Candidate Assessment

This project is a high-fidelity, full-stack AI interview simulation platform designed as a final-year academic project. It strictly follows the methodology and architecture described in the research paper.

## 🚀 System Architecture
The system is built on a modular four-layer architecture:
1. **Presentation Layer**: React.js (Vite) + Tailwind CSS + Framer Motion.
2. **Application Layer**: Node.js + Express.js REST API.
3. **Persistence Layer**: MongoDB (Cloud/Local) + IndexedDB (Local Browser).
4. **Intelligence Layer**: Google Gemini 2.0 (Question Synthesis) + Mistral Small (Semantic Evaluation).

## 🛠️ Six-Module Workflow
1. **Candidate Setup**: Profile ingestion and role parameterization.
2. **Dynamic Question Generation**: Context-aware LLM synthesis based on role/experience.
3. **Speech-to-Text Processing**: Real-time verbal capture via Web Speech API.
4. **NLP Semantic Analysis**: Deep analysis of technical accuracy and terminology.
5. **LLM Evaluation Engine**: Hybrid rule-based + AI scoring algorithm.
6. **Audit Report Synthesis**: Generation of analytical dashboards and performance roadmaps.

## 📊 Scoring Methodology
Final candidate score is computed using the Research Paper's weighted formula:
**Final Score = 0.4(TS) + 0.2(CQ) + 0.15(LF) + 0.15(RR) + 0.1(CF)**
- **TS**: Technical Skills
- **CQ**: Communication Quality
- **LF**: Logical Flow
- **RR**: Response Relevance
- **CF**: Confidence

## ⚙️ Setup & Installation
1. **Clone the project** and open in VS Code.
2. **Backend Setup**:
   - `cd backend`
   - `npm install`
   - Create a `.env` file with:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     GEMINI_API_KEY=your_key
     MISTRAL_API_KEY=your_key
     ```
   - `node server.js`
3. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## 🏫 VIVA Preparation
- Refer to the **Architecture** and **Workflow** pages in the app for live diagrams.
- The evaluation logic uses a **Zero-Trust Grading System** (Draconian) to ensure professional standards.
- Fallback mode ensures the demo works even if APIs fail.

---
*Created by [Candidate Name] for Final Year Project Review 2026.*
