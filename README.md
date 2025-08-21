# 🍲 Recipe Data Collection & API Development


It parses recipe data from JSON, stores it in a database, exposes
RESTful APIs, and provides a **React frontend** to view, search, and
filter recipes.

------------------------------------------------------------------------

## 📌 Tech Stack

-   **Frontend**: React + Material UI\
-   **Backend**: Node.js (Express)\
-   **Database**: Mysql

------------------------------------------------------------------------

## ⚙️ Features

### Backend (API)

-   Parse and clean JSON recipe data\
-   Store in database (`recipes` collection/table)\
-   RESTful APIs:
    1.  `GET /api/recipes` → Fetch all recipes (paginated, sorted by
        rating)\
    2.  `GET /api/recipes/search` → Search recipes by title, cuisine,
        rating, total_time, calories\
-   Handles `NaN` values (stored as `null`)\
-   Pagination & limit support (`?page=1&limit=15`)

### Frontend (React)

-   Recipes displayed in a **table** with:
    -   Title (truncated if too long)\
    -   Cuisine\
    -   Rating (⭐ star style)\
    -   Total Time\
    -   Serves\
-   **Row click** → Opens a right-side drawer with:
    -   Title & Cuisine in header\
    -   Description\
    -   Total Time (expandable to show Cook Time & Prep Time)\
    -   Nutrition (calories, fat, protein, etc.)\
    -   Ingredients & Instructions\
-   **Cell-level filters** for title, cuisine, rating, total_time,
    serves\
-   **Pagination** with customizable rows (15--50)\
-   **Fallback UI**:
    -   "No recipes found. Please try adjusting filters."\
    -   "No data available."

------------------------------------------------------------------------

## 🗄️ Database Setup


##MySql

``` sql
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  cuisine VARCHAR(100),
  title VARCHAR(255),
  rating FLOAT,
  prep_time INTEGER,
  cook_time INTEGER,
  total_time INTEGER,
  description TEXT,
  nutrients JSONB,
  serves VARCHAR(50)
);
```

------------------------------------------------------------------------

## ▶️ Running the Project

### 1. Clone Repo

``` bash
git clone https://github.com/0101Neeraj/recipe-app.git
cd recipes
```

### 2. Backend Setup

``` bash
cd backend
npm install
npm run seed
npm start 
```

Runs on `http://localhost:5000`

### 3. Frontend Setup

``` bash
cd frontend
npm install
npm install @emotion/react @emotion/styled
npm install cors morgan
npm start
```

Runs on `http://localhost:3000`

------------------------------------------------------------------------

## 🛠️ API Testing

You can test with **Postman** .

### Get All Recipes

``` bash
GET http://localhost:5000/api/recipes?page=1&limit=10
```

**Response:**

``` json
{
  "page": 1,
  "limit": 10,
  "total": 50,
  "data": [
    {
      "id": 1,
      "title": "Sweet Potato Pie",
      "cuisine": "Southern Recipes",
      "rating": 4.8,
      "prep_time": 15,
      "cook_time": 100,
      "total_time": 115,
      "description": "Shared from a Southern recipe...",
      "nutrients": {
        "calories": "389 kcal",
        "carbohydrateContent": "48 g",
        "cholesterolContent": "78 mg",
        "fiberContent": "3 g",
        "proteinContent": "5 g",
        "saturatedFatContent": "10 g",
        "sodiumContent": "254 mg",
        "sugarContent": "28 g",
        "fatContent": "21 g"
      },
      "serves": "8 servings"
    }
  ]
}
```
<img width="1920" height="1080" alt="Screenshot (125)" src="https://github.com/user-attachments/assets/94ee8f47-6afa-4442-a2ac-964cf860a001" />



### Search Recipes

``` bash
GET http://localhost:5000/api/recipes/search?title=pie&rating=>=4.5
```

**Response:**

``` json
{
  "data": [
    {
      "id": 1,
      "Contient": "North America",
      "Country_State": "US",
      "title": "Sweet Potato Pie",
      "cuisine": "Southern Recipes",
      "rating": 4.8,
      "total_time": 115
    }
  ]
}
```

<img width="1920" height="1080" alt="Screenshot (126)" src="https://github.com/user-attachments/assets/d0f66c6d-c66f-441c-87d4-d22503361f3f" />


------------------------------------------------------------------------

## 📂 Repository Structure

    .
    ├── backend/
    │   ├── server.js
    │   ├── routes/
    │   ├── models/
    │   ├── scripts/importData.js
    │   └── package.json
    ├── frontend/
    │   ├── src/
    │   ├── public/
    │   └── package.json
    ├── US_recipes.json
    ├── README.md
    └── db_schema.sql

------------------------------------------------------------------------

<img width="1920" height="1080" alt="Screenshot (127)" src="https://github.com/user-attachments/assets/8647d39a-efff-4e35-b9c4-09953b0357ca" />




