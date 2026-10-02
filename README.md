# SignWyz

SignWyz is a web application that uses AI to help users understand legal documents such as contracts, terms and conditions, and privacy policies.

Instead of reading a document and only looking for possible risks, SignWyz also highlights favorable terms and benefits that a user may gain from the document.

## Features

* User registration and sign in
* JWT-based authentication
* Upload and analysis of documents
* Support for PDF and text documents
* Contract, Terms & Conditions, Privacy Policy, and other document types
* AI-powered document analysis using Google Gemini
* Risk identification:

  * High risk
  * Medium risk
  * Low risk
* Identification of favorable terms and benefits
* Explanation of why a finding matters
* Suggestions about what the user should review
* Saved document analyses
* Personal document history
* User profile management
* Profile avatar upload and removal
* Dark mode

## How It Works

1. Create an account or sign in.
2. Upload or provide a document for analysis.
3. Select the type of document.
4. SignWyz sends the document for AI analysis.
5. The application identifies potential risks, obligations, and favorable terms.
6. The results are presented in an easy-to-read format.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* PDF.js

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* JWT authentication

### AI

* Google Gemini

## Project Structure

```text
SignWyz/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   └── ...
│   ├── requirements.txt
│   └── uploads/
├── public/
├── src/
│   ├── components/
│   └── pages/
├── package.json
├── vite.config.js
└── README.md
```

## Running the Project Locally

### Frontend

From the project root:

```bash
npm install
npm run dev
```

The frontend runs on the Vite development server.

### Backend

From the backend directory:

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

The backend runs on:

```text
http://localhost:8000
```

### Environment Variables

The backend uses environment variables for configuration and API credentials.

Create a `.env` file inside the `backend` directory.

Do not commit `.env` or API keys to GitHub.

## Important Note

SignWyz is an AI-assisted document analysis tool. Its findings are intended to help users understand documents and identify areas that may deserve closer attention. The analysis is not a substitute for professional legal advice.

## Current Status

SignWyz is currently under active development.
