# 📚 BookFinder - Backend

A smart book recommendation system that uses AI to find the perfect books based on your preferences.

## 🎯 Project Overview

BookFinder is an intelligent book recommendation engine that analyzes your reading preferences and suggests books you'll love. This is the **backend** service that powers the recommendation system.

**How it works:**
1. User provides tags describing what they want to read (e.g., "mystery", "philosophical", "dark atmosphere")
2. The Gemini AI generates personalized book recommendations
3. Google Books API enriches the recommendations with detailed metadata (covers, descriptions, ratings, etc.)
4. The backend returns a curated list of books with AI-generated reasons explaining why each book matches the user's preferences

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js + Express 5.2** | REST API server framework |
| **TypeScript 5.9** | Type-safe development with ES2022 target |
| **Google Generative AI (Gemini 2.5 Flash)** | AI-powered book recommendations |
| **Google Books API** | Book metadata enrichment (titles, authors, covers, descriptions, ratings) |
| **Axios** | HTTP client for API requests |
| **CORS** | Cross-origin resource sharing configuration |
| **tsx** | TypeScript execution for development |
| **dotenv** | Environment variable management |

---

## 📋 Project Structure

```
src/
├── server.ts                 # Express app initialization & server setup
├── controllers/
│   └── BookController.ts    # Request handling for book recommendations
├── services/
│   ├── GeminiService.ts     # Gemini AI integration for recommendations
│   └── GoogleBooksService.ts # Google Books API integration
└── routes/
    └── index.ts            # API route definitions
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- API Keys:
  - Google Generative AI key (Gemini)
  - Google Books API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bookfinder-back
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
PORT=
GOOGLE_API_KEY=
ENABLED_CORS=
```

- `PORT`: Server port
- `GOOGLE_API_KEY`: Your Google Cloud API key for both Gemini and Google Books APIs
- `ENABLED_CORS`: Semicolon-separated list of allowed origins

### Running the Project

**Development mode** (with hot reload):
```bash
npm run dev:api
```

**Production build**:
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### POST `/recommend`

Get personalized book recommendations based on user preferences.

**Request:**
```json
{
  "tags": ["mystery", "psychological thriller", "dark atmosphere"]
}
```

**Response:**
```json
[
  {
    "title": "The Silent Patient",
    "authors": ["Alex Michaelides"],
    "description": "A shocking psychological thriller...",
    "pageCount": 336,
    "averageRating": 4.2,
    "thumbnail": "https://...",
    "previewLink": "https://...",
    "reason": "Combines psychological depth with mystery elements you're looking for"
  }
]
```

**Parameters:**
- `tags` (required): Array of strings describing desired book characteristics

**Error Handling:**
- `400`: Missing or invalid tags parameter
- `429`: API quota exceeded (rate limiting)
- `500`: Internal server error

---

## 🔌 How It Works

### Recommendation Flow

```
User Input (Tags)
       ↓
Gemini AI Service
  (generates recommendations)
       ↓
Google Books Service
  (enriches with metadata)
       ↓
Response with enriched data
```

### Key Components

**GeminiService**
- Uses Gemini 2.5 Flash model with JSON response format
- Generates 5 fiction book recommendations per request
- Returns structured data: title, author, and reason for recommendation
- Implements safety settings for content filtering

**GoogleBooksService**
- Searches Google Books API for matching titles and authors
- Extracts: title, authors, description, page count, rating, cover image
- Falls back to Gemini data if book not found in Google Books
- Prioritizes Portuguese language results

**BookController**
- Orchestrates the recommendation pipeline
- Validates input parameters
- Enriches Gemini recommendations with Google Books data
- Returns comprehensive book information to the client

---

## 🔑 Environment Configuration

All sensitive data is managed through environment variables:

```env
# Server Configuration
PORT=

# Google Cloud APIs
GOOGLE_API_KEY=

# CORS Configuration (semicolon-separated origins)
ENABLED_CORS=
```

---

## 📦 Available Scripts

```bash
npm run dev:api      # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production build
npm test             # Run tests (not yet implemented)
```

---

## 🎨 Features

✅ AI-powered book recommendations using Google Gemini  
✅ Rich book metadata from Google Books API  
✅ Intelligent fallback mechanisms  
✅ TypeScript for type safety  
✅ CORS support for frontend integration  
✅ Error handling with meaningful messages  
✅ Environment-based configuration  
✅ JSON API responses  

---

## 🛡️ Error Handling

The backend includes robust error handling for:
- **Missing/Invalid tags**: Returns 400 with descriptive message
- **API quota exceeded**: Returns 429 with user-friendly message
- **Book not found**: Falls back to Gemini-provided data with placeholder image
- **Server errors**: Returns 500 with error details in logs

---

## 📝 License

MIT License