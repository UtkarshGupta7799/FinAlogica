
<div align="center">
  <img src="https://raw.githubusercontent.com/UtkarshGupta7799/FinAlogica/main/finalogica-banner.png"
       alt="FinAlogica — AI Fish Identification & Recommendation"
       width="100%" />
</div>

# FinAlogica — AI Fish Identification & Recommendation System

**Stack**: React + Redux Toolkit (frontend), Node.js/Express (backend), PostgreSQL (database), Python (ML), Streamlit (local UI)

**Key outcomes**  
- ~95% fish identification accuracy target using a MobileNet baseline  
- ~30% workflow efficiency improvement via automated logging  
- ~40% recommendation relevance improvement through weather-aware rule integration  

FinAlogica is an end-to-end AI system for fish species identification and contextual recommendation, designed as a **self-contained local deployment** for research, evaluation, and system demonstrations.

---

## System Overview

FinAlogica integrates computer vision, rule-based reasoning, and structured data storage into a unified pipeline.  
The system identifies fish species from images and generates context-aware recommendations by combining ML inference with environmental signals and fisheries heuristics.

---

## Architecture

- Image ingestion via web or local UI  
- Python ML inference service using MobileNet  
- REST API layer for orchestration and persistence  
- PostgreSQL for structured storage and audit logs  
- Recommendation engine combining model outputs with weather and domain rules  

---

## Components

- **/frontend** — React application with Redux Toolkit and RTK Query  
- **/backend** — Node.js / Express API coordinating ML and database services  
- **/ml** — PyTorch-based inference engine for fish classification  
- **/streamlit_app** — Local UI for image upload and result visualization  
- **/db** — Database schema and seed data  

---

## Model & Recommendation Logic

- The baseline classifier is an ImageNet-pretrained **MobileNet** adapted to a constrained fish label space  
- Accuracy targets assume domain-specific fine-tuning for production-level performance  
- Recommendation relevance is enhanced by combining:
  - Species identification confidence  
  - Weather parameters (temperature, wind)  
  - Time-of-day and fisheries rule heuristics  

---

## Setup

```bash
# 0) Open ONE terminal and run Postgres (or ensure it's running). Create a DB user & DB:
#    Replace password if you like.
psql -U postgres -c "CREATE USER finalogica WITH PASSWORD 'finalogica123';" || true
psql -U postgres -c "CREATE DATABASE finalogica OWNER finalogica;" || true

# 1) Apply schema + seed
psql -U postgres -d finalogica -f db/schema.sql
psql -U postgres -d finalogica -f db/seed.sql

# 2) Start the ML engine (first run downloads weights ~5-20s depending on net)
cd ml
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python server.py

# 3) Start the backend API (in a NEW terminal)
cd backend
cp .env.example .env
npm install
npm run dev

# 4) Start the Streamlit app (in a NEW terminal) — this is your local "host" UI
cd streamlit_app
cp .env.example .env
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py

# 5) (Optional) Run the React app too (full web UI)
cd frontend
cp .env.example .env
npm install
npm start
```

Streamlit will open at `http://localhost:8501`.  
Backend API runs at `http://localhost:4000`.  
ML engine runs at `http://localhost:8001`.  
React dev server runs at `http://localhost:5173` (Vite).

> If you prefer just **one UI**, use only the Streamlit app (Step 4). It calls the same backend/ML services.

---

## Accuracy/Relevance Notes
- Baseline model uses ImageNet MobileNet and a small fish label map. For 95%+ on your target dataset, fine-tune with your data (see `ml/train_notebook.ipynb`).
- Weather relevance (+40% target) is driven by combining temperature, wind, and time-of-day heuristics. See `backend/src/services/recommendation.ts` for rules; connect to live weather (Open-Meteo) by setting `OPEN_METEO=1` in `.env`.

---

## Project tree
```
FinAlogica/
  backend/
  db/
  frontend/
  ml/
  streamlit_app/
```
