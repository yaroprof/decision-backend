# Decision Insight Backend

The backend API for the AI-Powered Decision Journal, built with Node.js, Express, and MongoDB. It handles user authentication, decision analysis via Groq's LLM, and personalized decision history. This repository supports the [Decision Insight Frontend](https://github.com/yaroprof/decision-frontend.git).

## Features
- **User Authentication**: Secure registration and login with JWT.
- **Decision Analysis**: Analyzes decisions using Groq's LLM, returning category, cognitive biases, and missed alternatives.
- **Personalized History**: Stores and retrieves user-specific decision history.
- **REST API**: Endpoints for authentication and decision management.

## Prerequisites
- Node.js (v16.x or higher)
- MongoDB (local or MongoDB Atlas)
- Groq API Key

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yaroprof/decision-backend.git
   cd decision-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root with:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   GROQ_API_KEY=<your-groq-api-key>
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Running
- Run `npm run dev` to start the server at `http://localhost:5000`.
- Test endpoints with Postman or the frontend.

## API Endpoints
- `POST /api/auth/register`: Register a user (`email`, `password`)
- `POST /api/auth/login`: Log in a user (`email`, `password`)
- `GET /api/messages`: Fetch user-specific decision history (JWT required)
- `POST /api/messages`: Submit a decision for analysis (JWT and `message` required)

## Deployment
- Deploy on Render.
  - Add environment variables (`MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`) in platform settings.
  - Steps for Render:
    1. Push to GitHub.
    2. Create a Web Service in Render and link the repository.
    3. Add environment variables in Render's dashboard.
- Configure CORS to allow frontend requests (e.g., `http://localhost:3000` or deployed URL).
- **Demo**: [Add deployed backend URL here]

## Dependencies
- `express`
- `mongoose`
- `jsonwebtoken`
- `bcryptjs`
- `axios`
- `cors`
- `dotenv`

## Project Structure
- `/routes`: API routes (`authRoutes.js`, `messageRoutes.js`)
- `/models`: Mongoose schemas (`User.js`, `Message.js`)
- `/authMiddleware`: Authentication middleware
- `index.js`: Main server file

## Known Issues
- **MongoDB**: Ensure `MONGO_URI` is valid and MongoDB is accessible.
- **Groq API**: Provide a valid `GROQ_API_KEY` in `.env`.
- **CORS**: Update `cors` middleware to allow frontend origin.

## Related
- Frontend: [Decision Insight Frontend](https://github.com/yaroprof/decision-frontend.git)

## Contributing
Submit issues or pull requests to improve the project. Discuss major changes via issues first.

## License
MIT License