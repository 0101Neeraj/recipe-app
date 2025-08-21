# Recipe Fullstack (React + Node/Express + MySQL)

This repository contains a full-stack example for the Securin Assessment:
- **Backend**: Node.js + Express + Sequelize (MySQL)
- **Frontend**: React + Material UI
- **Database**: MySQL (recipes table, `nutrients` stored as JSON)

## Quick overview

- Start MySQL and create a database `recipesdb`.
- Run backend to sync models and seed sample data (or use provided seed script).
- Start frontend and open `http://localhost:3000`.

## Setup (local)

### 1) MySQL
Create the database and a user (example):
```sql
CREATE DATABASE recipesdb;
CREATE USER 'recipes_user'@'localhost' IDENTIFIED BY 'recipes_pass';
GRANT ALL PRIVILEGES ON recipesdb.* TO 'recipes_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2) Backend
```bash
cd backend
npm install
# configure .env or edit config in config/config.json
# Example .env variables:
# DB_NAME=recipesdb
# DB_USER=recipes_user
# DB_PASS=recipes_pass
# DB_HOST=127.0.0.1
npm run seed   # seeds sample data into MySQL
npm start
```
Server runs on port 5000 by default.

APIs:
- `GET /api/recipes?page=1&limit=10` - paginated, sorted by rating desc
- `GET /api/recipes/search?...` - search with query params (title, cuisine, rating, total_time, calories comparisons)

### 3) Frontend
```bash
cd frontend
npm install
npm start
```
Opens at `http://localhost:3000`.

## Notes
- The seed uses `sample_data/recipes.json` (one sample included). Replace with the full JSON to ingest more records.
- `nutrients` column stored as JSON in MySQL (via Sequelize `JSON` type).

Enjoy!