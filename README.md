# MindCheck AI

MindCheck AI is a full-stack mental health screening app.

- Frontend: React + Vite + Tailwind CSS
- Backend: Flask API
- Model: Scikit-learn text classifier with TF-IDF

## Project Structure

- frontend/
- backend/
  - app.py
  - train_model.py
  - data/dataset.xlsx
  - models/model.pkl
  - models/tfidf.pkl

## 1) Run Backend

From the backend folder:

```powershell
cd backend
python -m pip install -r requirements.txt
python train_model.py
python app.py
```

API endpoint:

- POST http://127.0.0.1:5000/predict

## 2) Run Frontend

From the frontend folder:

```powershell
cd frontend
npm install
npm run dev
```

Open:

- http://127.0.0.1:5173

## Notes

- The quiz answers are converted into natural language text before prediction.
- Prediction classes are: Normal, Anxiety, Depression.
- The backend returns confidence score when available.

## 3) Deploy Backend On Render

This repository includes [render.yaml](render.yaml) and [backend/Dockerfile](backend/Dockerfile).

### Steps

1. Push this project to GitHub.
2. In Render, click **New +** -> **Blueprint**.
3. Connect the repository and deploy.
4. Render will create `mindcheck-ai-backend` using:

- Runtime: `docker`
- Docker context: `backend`
- Dockerfile: `backend/Dockerfile`

During Docker image build, model artifacts are generated with [backend/train_model.py](backend/train_model.py), so the container starts ready for inference.

## 4) Deploy Frontend On Netlify

This repository includes [netlify.toml](netlify.toml) configured for Vite and SPA routing.

### Steps

1. In Netlify, click **Add new site** -> **Import an existing project**.
2. Connect the same GitHub repository.
3. Netlify will read settings from [netlify.toml](netlify.toml):

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

4. In Netlify site settings, add environment variable:

- `VITE_API_BASE_URL=https://<your-render-backend>.onrender.com`

5. Redeploy the frontend.

The frontend reads this variable in [frontend/src/pages/QuizPage.jsx](frontend/src/pages/QuizPage.jsx).

## Deployment Files Added

- [render.yaml](render.yaml)
- [backend/Dockerfile](backend/Dockerfile)
- [backend/.dockerignore](backend/.dockerignore)
- [backend/runtime.txt](backend/runtime.txt)
- [netlify.toml](netlify.toml)
- [frontend/.env.example](frontend/.env.example)
