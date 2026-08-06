# AI Resume Analyzer

A web app that analyzes your resume using AI and gives you actionable feedback — ATS compatibility score, section-by-section breakdowns, and specific tips to improve your chances of landing interviews.

Upload a PDF, optionally paste a job description, and get a detailed review in seconds.

## How It Works

1. Sign in through Puter (handles auth, file storage, and key-value storage)
2. Upload your resume as a PDF
3. Optionally add a job title and description for tailored feedback
4. The app extracts text from the PDF client-side, sends it to Groq's API (LLaMA 3.3 70B), and returns structured feedback
5. View your results on a dedicated review page — resume preview on one side, AI feedback on the other

## Tech Stack

- **Framework**: React Router v8 (SSR mode)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Auth & Storage**: Puter.js (authentication, cloud file storage, key-value store)
- **AI**: Groq API (LLaMA 3.3 70B Versatile)
- **PDF Handling**: pdfjs-dist for client-side text extraction and image conversion

## Project Structure

```
app/
├── routes/
│   ├── home.tsx          # Dashboard with past resume submissions
│   ├── upload.tsx        # Upload form and analysis trigger
│   ├── resume.tsx        # Review page (resume preview + feedback)
│   ├── Auth.tsx          # Puter authentication
│   └── api.analyze.ts   # Server-side API route that calls Groq
├── components/
│   ├── Summary.tsx       # Overall feedback summary
│   ├── ATS.tsx           # ATS score and improvement tips
│   ├── Details.tsx       # Detailed section-by-section review
│   ├── navbar.tsx        # Navigation bar
│   ├── FileUploader.tsx  # Drag-and-drop PDF uploader
│   └── resumecard.tsx    # Resume card for the dashboard
├── lib/
│   ├── puter.ts          # Zustand store wrapping Puter.js APIs
│   ├── pdf2img.ts        # PDF to image conversion + text extraction
│   └── util.ts           # Helpers (UUID generation, file size formatting)
constants/
└── index.ts              # AI prompt templates and response format
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Groq API key ([get one here](https://console.groq.com/keys))

### Setup

```bash
npm install
```

Create a `.env` file in the root:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key for resume analysis |

## License

MIT
