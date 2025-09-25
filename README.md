# Food Reel Backend

Backend API for Food Reel — a platform to discover, save, and interact with food video reels.  
Built with Node.js, Express, and MongoDB.

---

## Features

- **User & Food Partner Authentication:** Register, login, JWT-based sessions.
- **Food Reels:** Create, fetch, like, save, and comment on food videos.
- **Food Partner Management:** Food partners can manage their profile and food items.
- **Comments & Likes:** Users can comment and like reels.
- **Save Reels:** Users can bookmark/save reels for later.
- **RESTful API:** Organized endpoints for all resources.
- **Middleware:** Auth protection for sensitive routes.
- **MongoDB Models:** For users, food partners, food items, likes, saves, comments.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- Multer (via `storage.service.js`) for file uploads
- dotenv for environment variables

---

## Project Structure

```
Backend/
  .env                  # Environment variables
  package.json
  server.js             # Entry point
  src/
    app.js              # Express app setup
    controllers/        # Route logic
      auth.controller.js
      food-partner.controller.js
      food.controller.js
    db/
      db.js             # MongoDB connection
    middlewares/
      auth.middleware.js
    models/             # Mongoose schemas
      user.model.js
      foodpartner.model.js
      food.model.js
      likes.model.js
      save.model.js
      comment.model.js
    routes/             # Express routers
      auth.routes.js
      food-partner.routes.js
      food.routes.js
    services/
      storage.service.js # File upload/storage logic
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashbarbate08/food-reel.git
   cd food-reel/Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/foodreel
     JWT_SECRET=your_jwt_secret
     ```
   - Add other keys as needed (e.g., for file storage).

4. **Start the server:**
   ```bash
   npm start
   ```
   - The server runs on `http://localhost:5000` by default.

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `POST /api/auth/partner/register` — Register food partner
- `POST /api/auth/partner/login` — Login food partner

### Food Reels

- `GET /api/food` — List all food reels
- `POST /api/food` — Create new food reel (partner only)
- `GET /api/food/:id` — Get single food reel
- `POST /api/food/:id/like` — Like a reel
- `POST /api/food/:id/save` — Save/bookmark a reel
- `GET /api/food/save` — Get saved reels for user
- `POST /api/food/:id/comment` — Add comment
- `GET /api/food/:id/comments` — Get comments

### Food Partner

- `GET /api/food-partner/:id` — Get partner profile
- `PUT /api/food-partner/:id` — Update partner profile
- `GET /api/food-partner/:id/foods` — Get partner's food reels

---

## Middleware

- **auth.middleware.js:** Protects routes, checks JWT, attaches user/partner to request.

---

## Models

- **user.model.js:** User schema
- **foodpartner.model.js:** Food partner schema
- **food.model.js:** Food reel schema
- **likes.model.js:** Likes tracking
- **save.model.js:** Saved/bookmarked reels
- **comment.model.js:** Comments on reels

---

## File Uploads

- Handled via `storage.service.js` (uses Multer).
- Configure storage destination and limits as needed.

---

## Development Tips

- Use [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud DB or run local MongoDB.
- Use tools like [Postman](https://www.postman.com/) for API testing.
- JWT secret should be strong and kept private.
- CORS: If connecting to frontend, enable CORS in `app.js`.

---

## License

MIT

---

**Made for food lovers & creators!**