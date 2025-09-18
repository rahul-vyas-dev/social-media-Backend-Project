# Backend API Project

This repository contains the backend code for a **video-sharing and social media platform**.  
It is built with **Node.js, Express.js, and MongoDB**, and provides **RESTful APIs** for user management, video uploads, comments, likes, playlists, subscriptions, tweets, and email validation.

---

## Features

- **User Management** – Registration, authentication (JWT), profile management
- **Video Uploads** – Upload, stream, and manage videos (**Multer + Cloudinary**)
- **Comments & Likes** – Add comments and likes to videos
- **Playlists** – Create and manage playlists
- **Subscriptions** – Subscribe/unsubscribe to channels
- **Tweets** – Post and manage short tweets
- **File Uploads** – Handled via Multer middleware
- **Cloud Storage** – Integrated with Cloudinary
- **Email Validation** – Validates email addresses using [Abstract API](https://mailmeteor.com/tools/email-reputation)
  ```js
  https://emailreputation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${email}
  ```
- **Error Handling** – Custom ApiError and ApiResponse classes

---

## Project Structure

```
src/
  app.js                # Main Express app setup
  constants.js          # Application constants
  index.js              # Entry point
  controllers/          # Route controllers for each feature
    comment.controller.js
    like.controller.js
    playlist.controller.js
    subscription.controller.js
    tweet.controller.js
    user.controller.js
    video.controller.js
  db/
    index.js            # Database connection setup
  middlewares/          # Custom Express middlewares
    auth.middleware.js
    emailValidator.middleware.js
    multer.middleware.js
  models/               # Mongoose models for MongoDB
    comment.model.js
    like.model.js
    playlist.model.js
    subscription.model.js
    tweet.model.js
    user.model.js
    video.model.js
  routes/               # API route definitions
    comment.routes.js
    like.routes.js
    playlist.routes.js
    subscription.routes.js
    tweet.routes.js
    user.routes.js
    video.routes.js
  utils/                # Utility classes and functions
    ApiError.js
    ApiResponse.js
    asyncHandler.js
    Cloudinary.js
public/
  temp/                 # Temporary files (e.g., uploads)
```

---

## Technologies Used

- **Node.js** (JavaScript runtime)
- **Express.js** (backend framework)
- **MongoDB + Mongoose** (database & ORM)
- **Multer** (file upload handling)
- **Cloudinary** (media storage)
- **JWT** (authentication & authorization)
- **Bcrypt** (password hashing)
- **Dotenv** (environment variable management)
- **Nodemon** (development server auto-restart)
- **mailmeteor** (email validation)

---

## Installation & Setup

### 1. Clone the repository

```sh
git clone https://github.com/rahul-vyas-dev/social-media-Backend-Project
cd social-media-Backend-Project
```

### 2. Install dependencies

```sh
npm install
```

> You don’t need to run `npm init` since this project already includes a `package.json` with `"type": "module"` set.

### 3. Environment Configuration

You must create a `.env` file in the root directory.  
A sample configuration is provided in **`.env.sample`**.

### 4. Run the server

Development mode (auto-reload with nodemon):

```sh
npm run dev
```

Production mode:

```sh
node src/index.js
```

---

## API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

| Endpoint                 | Description                                |
| ------------------------ | ------------------------------------------ |
| `/api/v1/users`          | User operations (register, login, profile) |
| `/api/v1/videos`         | Video upload & management                  |
| `/api/v1/comments`       | Comment operations                         |
| `/api/v1/likes`          | Like/unlike videos                         |
| `/api/v1/playlists`      | Playlist CRUD                              |
| `/api/v1/subscriptions`  | Subscribe/unsubscribe users                |
| `/api/v1/tweets`         | Tweet CRUD                                 |
| `/api/v1/email/validate` | Validate email addresses                   |

---

## Development Scripts

From `package.json`:

```sh
npm run dev   # Start backend in development mode with nodemon
npm start     # Start normally with Node.js (if added)
```

---

## Contributing

1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to your fork
5. Create a Pull Request

---

## License

This project is licensed under the **MIT License**.

---

## Quick Start

Now anyone can:

1. **Clone** → `git clone`
2. **Install** → `npm install`
3. **Configure** → `.env` (check `.env.sample` for reference)
4. **Run** → `npm run dev` or `node src/index.js`

### Developer Notes

This project took me a good amount of time and effort to build. During development, I:

- Carefully structured the backend from scratch.
- Implemented and tested **every route** one by one.
- Learned a lot about Node.js, Express, MongoDB, and integrations like Cloudinary and Abstract API.
- Focused on **clean error handling** and modular code organization.

I’m proud of the learning journey this project represents
