# 🚀 Complete Render Deployment Guide

This guide details the step-by-step process of deploying your microservices architecture web application to [Render](https://render.com).

## 🏗 Architecture Overview

Your application uses:
- **Frontend**: Vite React App
- **Gateway**: Apollo GraphQL API Gateway
- **Microservices** (7): User, Profile, Availability, Matching, Session, Notification, Messaging
- **Databases**: PostgreSQL (Prisma ORM)
- **Message Broker**: Kafka

---

## 🛠 Step 1: External Managed Services Setup

Render natively provides managed PostgreSQL, but it doesn't provide managed Kafka. Before deploying code, you need to provision these infrastructure components.

### 1.1 Setup PostgreSQL DB (Render)
Render allows creating a PostgreSQL instance. You can use one database instance and create multiple logical schema/databases or just use a single database with different table prefixes.
1. Go to your Render Dashboard > **New** > **PostgreSQL**.
2. Name it (e.g., `software-db`).
3. Under **Connections**, copy the **Internal Database URL** and **External Database URL**.
4. *Tip:* Depending on your Prisma setup, you might need to append multiple connection schemas, or if you prefer, you can provision external databases via Supabase or Neon to easily get 7 isolated databases.

### 1.2 Setup Kafka (Upstash or Confluent Cloud)
Since Render doesn't offer native Kafka:
1. Create a free Kafka Serverless cluster on [Upstash](https://upstash.com/) or [Confluent Cloud](https://confluent.cloud/).
2. Grab the Bootstrap server URL (e.g., `broker.upstash.io:9092`) and your SASL credentials (Username/Password).
3. Format the broker URL to keep handy for the environment variables.

---

## 🔒 Step 2: Deploy Backend Microservices (Private Services)

Render has "Private Services" which are perfect for microservices. They aren't exposed to the public internet, ensuring security. The Gateway will communicate with them internally.

For **EACH** of your 7 services (`user-service`, `profile-service`, `availability-service`, `matching-service`, `session-service`, `notification-service`, `messaging-service`), perform the following steps:

1. Click **New** > **Web Service** (Wait, Render recently changed how Private Services work, they are now created from the "New" button > "Private Service"). Choose **Private Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name**: e.g., `user-service`
   - **Root Directory**: `services/user-service` (Replace with the respective folder)
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
     *(Adjust start command if you use `npm run start:prod`)*
4. **Environment Variables**:
   - `PORT`: Define the specific port or leave it blank (Render injects `PORT` automatically, but your code must use `process.env.PORT`).
   - `DATABASE_URL`: Add the PostgreSQL connection string specific to this service.
   - `KAFKA_BROKER`: Paste your external Kafka connection URL.
   - *Any Kafka SASL credentials* (if your code uses `KAFKA_USERNAME` and `KAFKA_PASSWORD`).

*NOTE: Copy the **Internal Service URL** (e.g., `http://user-service:10000`) for each service once created. You will need them for the Gateway.*

---

## 🌐 Step 3: Deploy the API Gateway (Web Service)

The Gateway MUST be a Web Service because the Frontend needs to access it publicly.

1. Click **New** > **Web Service**.
2. Configure:
   - **Name**: e.g., `api-gateway`
   - **Root Directory**: `gateway`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Environment Variables**:
   Paste the internal URLs you copied from the Private Services:
   - `PORT`: `4000` (Optional, Render overrides this)
   - `USER_SERVICE_URL`: Internall URL of User Service (e.g., `http://user-service:10000`)
   - `PROFILE_SERVICE_URL`: Internal URL of Profile Service
   - `AVAILABILITY_SERVICE_URL`: Internal URL of Availability Service
   - `MATCHING_SERVICE_URL`: Internal URL of Matching Service
   - `SESSION_SERVICE_URL`: Internal URL of Session Service
   - `NOTIFICATION_SERVICE_URL`: Internal URL of Notification Service
   - `MESSAGING_SERVICE_URL`: Internal URL of Messaging Service

Once deployed, copy the Gateway's public URL (e.g., `https://api-gateway-xxx.onrender.com`).

---

## 🖥 Step 4: Deploy the Frontend (Static Site)

The Vite React app should be deployed as a static site for best performance and cost (free).

1. Click **New** > **Static Site**.
2. Configure:
   - **Name**: e.g., `frontend-client`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (Vite's default output folder)
3. **Environment Variables**:
   - `VITE_GRAPHQL_URI`: Set this to your Gateway's public URL followed by `/graphql` (e.g., `https://api-gateway-xxx.onrender.com/graphql`).
4. **Routing Settings** (Crucial for React Router):
   - Under **Redirects/Rewrites**, add a rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`

---

## 💡 Rendering Using `render.yaml` (Infrastructure as Code) - Recommended

Instead of clicking through the UI for 9 different services, Render allows you to add a `render.yaml` (Blueprint) file to your repository root `software_hidden/render.yaml`. 

Here is a template you can use:

```yaml
databases:
  - name: shared-postgres
    databaseName: software_db
    user: db_user

services:
  # Gateway - Public
  - type: web
    name: api-gateway
    env: node
    rootDir: gateway
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: USER_SERVICE_URL
        value: http://user-service:10000
      # ... add other service URLs ...

  # Microservices - Private
  - type: pserv
    name: user-service
    env: node
    rootDir: services/user-service
    buildCommand: npm install && npx prisma generate && npx prisma migrate deploy
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: shared-postgres
          property: connectionString
      - key: KAFKA_BROKER
        value: "YOUR_UPSTASH_OR_CONFLUENT_URL"

  # (Repeat the pserv block for the remaining 6 microservices)

  # Frontend - Static Site
  - type: web
    name: frontend
    env: static
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_GRAPHQL_URI
        fromService:
          type: web
          name: api-gateway
          envVarKey: RENDER_EXTERNAL_URL
          property: value
```

To use the Blueprint:
1. Create `render.yaml` using the structure above.
2. Push to GitHub.
3. In Render Dashboard, click **New > Blueprint** and select your repository. Render will automatically spin up the database, all private services, gateway, and frontend!
