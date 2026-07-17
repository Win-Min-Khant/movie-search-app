# 🎬 Movie Search App

A React + TypeScript movie discovery app that lets users search for movies using **The Movie Database (TMDB) API**, with a trending searches feature powered by **Appwrite**.

## Features

- 🔍 Search for movies in real time with debounced input
- 🎞️ Browse popular movies by default
- 📈 Trending searches tracker — the most-searched movies are logged and ranked using Appwrite
- ⚡ Built with Vite for a fast dev experience
- 🎨 Styled with Tailwind CSS

## Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **TMDB API** — movie data
- **Appwrite (TablesDB)** — trending search tracking
- **react-use** — debounce hook

## Getting Started

### Prerequisites

- Node.js installed
- A [TMDB API key](https://www.themoviedb.org/settings/api)
- An [Appwrite Cloud](https://cloud.appwrite.io) project with a database and table set up for tracking search counts

### Installation

1. Clone the repo

   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   Copy `.env.example` to `.env` and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
   VITE_APPWRITE_TABLE_ID=your_appwrite_table_id
   ```

   > **Note:** Make sure your Appwrite `Client` endpoint in `appWrite.ts` matches your project's region (e.g. `https://fra.cloud.appwrite.io/v1`), found under **Appwrite Console → Settings → General**. Also add `localhost` as a Web Platform under **Project Settings → Platforms**, and grant `Any` role Create/Read/Update permissions on your table.

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Appwrite Table Schema

Your Appwrite table should have the following columns:

| Column       | Type    |
| ------------ | ------- |
| searchTerm   | text  |
| count        | integer |
| movie_id     | integer |
| poster_url   | text  |

## Project Structure

```
src/
├── components/
│   ├── MovieCard.tsx
│   ├── Search.tsx
│   └── Spinner.tsx
├── types/
│   └── movie.ts
├── appWrite.ts
├── App.tsx
└── main.tsx
```

## Acknowledgements

Based on the movie search project tutorial by [JavaScript Mastery](https://www.jsmastery.pro/).

## License

This project is open source and available for learning purposes.