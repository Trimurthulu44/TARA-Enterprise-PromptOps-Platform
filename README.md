# TARA — Enterprise PromptOps Platform

<div align="center">
  <img src="public/tara-logo.png" alt="TARA Logo" width="120" />
  <h3>Prompts are the new source code.</h3>
  <p>Manage, analyze, evaluate, optimize, secure, version, score, and govern prompts across organizations before they reach any LLM.</p>
</div>

---

## 🌟 Overview

**TARA is not an AI chatbot.**

TARA is an **Enterprise PromptOps Platform** that sits between developers and AI models (ChatGPT, Claude, Gemini, Copilot, Cursor, internal enterprise chatbots). Instead of writing prompts from scratch or storing them haphazardly in Slack and Notion, developers use TARA to discover, evaluate, optimize, and deploy the highest-performing prompts with deterministic confidence.

### Unique Enterprise Feature
When integrated into corporate assistants (e.g. Infosys Internal AI Assistant):
1. The chatbot provides a **`✨ Prompt Assistant`** action button.
2. The developer enters their intent: *"I need a Spring Boot REST API authentication prompt"*.
3. TARA performs semantic `pgvector` search over the private enterprise repository.
4. TARA ranks and returns the Top 3 prompts based on **Prompt Quality Score (PQS)**, historical success rate, and security clearance.
5. The developer selects one, and it is automatically inserted into the chatbot.

---

## 🚀 Key Features

- **Prompt Quality Score (PQS 0–100)**: Evaluates prompts against 26 weighted indicators across Accuracy, Security, LLM Judge consensus, Clarity, Reusability, Cost Efficiency, Predicted Latency, and Regression Stability.
- **"Tara your friend" AI Assistant**: A dedicated interactive companion helping developers navigate workspaces, run security scans, and integrate APIs.
- **AI Prompt Optimizer**: AST and semantic restructuring injecting anti-jailbreak guardrails, deterministic JSON schemas, and XML context isolation delimiters.
- **Enterprise Governance & RBAC**: Department-level ownership, multi-stage approval workflows (`PENDING_REVIEW` -> `APPROVED_FOR_PRODUCTION`), and immutable SOC2-compliant cryptographic audit trails.
- **Prompt Injection & Leakage Scanner**: Proactive heuristic and semantic validation preventing instruction overrides, system prompt extraction, and PII leakage.
- **Regression Testing Suite**: Automated test harnesses validating prompts against model updates (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro).
- **Developer API & SDKs**: Sub-50ms REST API gateway with official starters for Java 21 Spring Boot 3, Python 3.12 FastAPI, and TypeScript.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 / Vite / TypeScript
- **Styling**: Tailwind CSS (Clean white theme inspired by Stripe, Linear, Notion, Vercel)
- **Visualizations**: Recharts, Canvas Confetti
- **Icons**: Lucide React

### Backend
- **Core**: Java 21, Spring Boot 3.3.4
- **Security**: Spring Security 6, Stateless JWT, OAuth2
- **Data & Vector**: Spring Data JPA, PostgreSQL 16, pgvector, Redis 7
- **AI Integration**: Spring AI, OpenAPI (Swagger 3)

### AI Intelligence Service
- **Framework**: Python 3.12, FastAPI
- **Embeddings & LLM**: Sentence Transformers (`all-MiniLM-L6-v2`), LiteLLM, LangGraph, LangChain

### Infrastructure
- **Containers**: Docker, Docker Compose, Nginx Reverse Proxy
- **CI/CD**: GitHub Actions

---

## 🏁 Quickstart

### 1. Frontend Development Server
```bash
npm install
npm run dev
```

### 2. Full Enterprise Docker Compose Stack
```bash
docker compose up -d
```

### 3. Build & Production Bundle
```bash
npm run build
```

---

## 👨‍💻 Author

**Created by Valteti Trimurthulu**  
GitHub: [@Trimurthulu44](https://github.com/Trimurthulu44)

---

## 📄 License
Enterprise Commercial License © 2026 TARA Platforms Inc.
