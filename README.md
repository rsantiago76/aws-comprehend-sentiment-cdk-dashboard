# AWS Comprehend Sentiment API + TypeScript Dashboard (CDK)

Serverless sentiment analysis API using **Amazon Comprehend** + **Lambda (Python)** behind **API Gateway**, deployed with **AWS CDK (TypeScript)**.
Includes a **React + TypeScript (Vite) dashboard** that calls the API.

## Architecture
API Gateway (REST) -> Lambda (Python) -> Amazon Comprehend

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/7b472ec6-767f-4f01-8c96-a6cf2b54aa4d" />


## Repo layout
- `infra/cdk/`  CDK app (TypeScript) that deploys API Gateway + Lambda + IAM
- `lambda/`     Python Lambda handler
- `dashboard/`  React + TypeScript UI (Vite) to call the API

---

## Prereqs
- AWS CLI configured (`aws configure`)
- Node.js 20+
- AWS CDK v2 (`npm i -g aws-cdk`)

---

## Deploy (CDK)
```bash
cd infra/cdk
npm install
npm run build
cdk bootstrap
cdk deploy
```

After deploy, CDK prints an output like:
- `SentimentApiUrl = https://xxxx.execute-api.us-east-1.amazonaws.com/prod`

Test the API (replace URL):
```bash
curl -s -X POST "https://xxxx.execute-api.us-east-1.amazonaws.com/prod/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text":"I love AWS"}'
```

---

## Run the Dashboard
```bash
cd dashboard
npm install
# set your API URL output from CDK:
echo "VITE_API_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/prod" > .env.local
npm run dev
```

Open: http://localhost:5173
