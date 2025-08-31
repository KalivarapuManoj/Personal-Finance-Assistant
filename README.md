# Personal-Finance-Assistant

A simple full-stack Personal Finance Management app built with **React** (frontend) and **Node.js/Express** (backend) with **MongoDB** as the database. This app allows users to track expenses and incomes, add transactions manually or via receipt uploads, and view summaries.

---

## Features

- Add, update, delete transactions
- Upload POS receipts to automatically extract expenses
- Filter transactions by date
- View transaction summaries
- Dark/light mode support (if implemented)

---

## Tech Stack

- **Frontend:** React, React Router, Context API, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **APIs:** OCR.Space API for receipt text extraction, OpenAI API for parsing receipt text
- **Other:** Multer for file uploads, dotenv for environment variables

---

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB
- NPM or Yarn
- API keys:
  - OCR.Space API Key
  - OpenAI API Key

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/KalivarapuManoj/Personal-Finance-Assistant.git
cd Personal-Finance-Assistant
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a .env file in the backend folder:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
OCR_SPACE_API_KEY=your_ocr_space_api_key
OPENAI_API_KEY=your_openai_api_key
```

Start the backend server :

```bash
npm start
```

The backend will run on http://localhost:5000.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

## Frontend

The frontend will run on: [http://localhost:5173](http://localhost:5173)

---

## Usage

1. Open the app in your browser: [http://localhost:5173](http://localhost:5173)
2. Add transactions manually via the **Transaction Form**.
3. Upload receipts via the **Upload Receipt** button — the system will parse and add expenses automatically.
4. Filter transactions by date.
5. View summaries of your expenses.

---

## Notes

- Make sure MongoDB is running and the connection URI is correct.
- OCR and AI parsing require valid API keys.
- Uploaded receipts are temporarily stored in `backend/uploads/` and deleted after processing.
- Transactions are displayed in descending order by date.
