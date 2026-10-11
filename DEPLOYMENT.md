# 🚀 TARA Enterprise PromptOps Platform — Deployment Guide

This guide covers two production deployment strategies:
1. **Modern Cloud SaaS Stack (Recommended for Enterprise SaaS)**: Vercel (Frontend) + Railway/AWS (Backend & AI Service) + Neon (pgvector) + Upstash (Redis).
2. **Unified Docker Deployment (Single Server / VPS)**: Deploy the entire multi-container stack in 1 command using Docker Compose.

---

## Strategy 1: Modern Cloud SaaS Deployment (Free / Low Cost & Scalable)

```
┌─────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
│  Vercel / Edge  │ ----> │ Railway / AWS Backend  │ ----> │ Neon PostgreSQL (pgvector)
│    (Frontend)   │       │   (Spring Boot 3)      │       │ Upstash Redis (Cache)│
└─────────────────┘       └───────────┬────────────┘       └──────────────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │ Railway / AWS AI Service│
                          │   (Python FastAPI)     │
                          └────────────────────────┘
```

### Step 1: Deploy PostgreSQL with pgvector (Neon / Supabase)
1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a new PostgreSQL 16 project named `tara-promptops`.
3. In the SQL Editor, enable pgvector:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
4. Copy the connection string:
   ```
   postgresql://tara_admin:<PASSWORD>@<HOST>/tara_promptops?sslmode=require
   ```

### Step 2: Deploy Redis (Upstash)
1. Go to [Upstash.com](https://upstash.com) and create a free serverless Redis database.
2. Note your `UPSTASH_REDIS_REST_URL` and standard Redis connection host/port/password.

### Step 3: Deploy Frontend to Vercel (1-Click)
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository:
   👉 **`Trimurthulu44/TARA-Enterprise-PromptOps-Platform`**
3. Framework Preset: **Vite**
4. Root Directory: `./` (root)
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**. Vercel will build and give you an instant global URL (e.g., `https://tara-promptops.vercel.app`)!

---

### Step 4: Deploy Java Spring Boot Backend (Railway / Render / AWS)

#### Option A: Railway (Easiest)
1. Go to [Railway.app](https://railway.app) and create a new project.
2. Select **"Deploy from GitHub repo"** -> `Trimurthulu44/TARA-Enterprise-PromptOps-Platform`.
3. Set the **Root Directory** to `/backend`.
4. Configure Environment Variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<YOUR_NEON_HOST>:5432/tara_promptops?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: `<YOUR_NEON_USER>`
   - `SPRING_DATASOURCE_PASSWORD`: `<YOUR_NEON_PASSWORD>`
   - `SPRING_DATA_REDIS_HOST`: `<YOUR_UPSTASH_REDIS_HOST>`
   - `TARA_AI_SERVICE_URL`: `https://<YOUR_AI_SERVICE_URL>`
5. Railway will automatically detect Java 21, build via Maven, and deploy the REST API.

---

### Step 5: Deploy Python FastAPI AI Service (Railway / Render)
1. In Railway, click **New Service** -> **GitHub Repo**.
2. Set Root Directory to `/ai-service`.
3. Configure Environment Variables:
   - `OPENAI_API_KEY`: `sk-...`
   - `ANTHROPIC_API_KEY`: `sk-ant-...`
4. Railway builds the Python environment via `requirements.txt` and starts `uvicorn main:app`.

---

## Strategy 2: Unified Docker Compose Deployment (Single VPS / Cloud Server)

Deploy on any Ubuntu/Debian VPS (AWS EC2, DigitalOcean, Linode, Hetzner):

### 1. SSH into your VPS
```bash
ssh user@your-server-ip
```

### 2. Install Docker & Docker Compose
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 3. Clone the Repository
```bash
git clone https://github.com/Trimurthulu44/TARA-Enterprise-PromptOps-Platform.git
cd TARA-Enterprise-PromptOps-Platform
```

### 4. Configure Environment Variables
Create a `.env` file:
```bash
cat << 'EOF' > .env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
TARA_TENANT_ID=infosys-corp
EOF
```

### 5. Start the Complete Stack
```bash
docker compose up -d --build
```

### 6. Verify Container Health
```bash
docker compose ps
```

All 5 services will spin up:
- **Frontend & Nginx**: `http://your-server-ip:3000` (or port 80)
- **Spring Boot 3 API**: `http://your-server-ip:8080/v1/prompts`
- **Swagger Documentation**: `http://your-server-ip:8080/swagger-ui.html`
- **FastAPI AI Service**: `http://your-server-ip:8000/docs`
- **PostgreSQL 16 (pgvector)**: port 5432
- **Redis 7**: port 6379

---

## Setting Up HTTPS & Custom Domain with Nginx & Certbot

To attach a domain (e.g., `tara-ops.com`):

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tara-ops.com -d api.tara-ops.com
```

Certbot will automatically obtain and configure a free SSL certificate from Let's Encrypt with auto-renewal.

---

## Summary of Ports & Endpoints

| Component | Port | Endpoint URL | Description |
| :--- | :--- | :--- | :--- |
| **Web Frontend** | `80 / 3000` | `http://localhost:3000` | React 19 UI, Dashboards, PQS Studio |
| **Spring Boot API** | `8080` | `http://localhost:8080/v1/prompts` | Core Gateway REST API |
| **Swagger UI** | `8080` | `http://localhost:8080/swagger-ui.html` | Interactive OpenAPI documentation |
| **AI Service** | `8000` | `http://localhost:8000/docs` | FastAPI Swagger & Embeddings |
| **PostgreSQL** | `5432` | `localhost:5432` | PostgreSQL 16 with pgvector extension |
| **Redis** | `6379` | `localhost:6379` | Token bucket rate limiting & cache |
