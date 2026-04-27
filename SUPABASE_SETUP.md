# Supabase Database Integration Guide

Your project has been successfully migrated to use **Supabase** for database management! Here's what you need to do to get it running.

## 1. Prerequisites

- A [Supabase](https://supabase.com) account (free tier works)
- Your Supabase project URL and API keys

## 2. Environment Setup

Create a `.env` file in the `server/` directory with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=your-jwt-secret-key
PORT=3000
```

> Find `SUPABASE_URL` and `SUPABASE_ANON_KEY` in your Supabase dashboard under **Settings → API**.

## 3. Database Schema Setup

### Option A: Manual SQL Setup
1. Go to your Supabase dashboard
2. Navigate to the **SQL Editor**
3. Create a new query and copy the contents of `server/db/schema.sql`
4. Execute the query

### Option B: Use the Schema File
Run the SQL from `server/db/schema.sql` in the Supabase SQL editor:

```sql
-- The schema.sql file is located at: server/db/schema.sql
```

**Tables created:**
- `users` - User accounts with authentication data
- `exercise_types` - Types of exercises (Running, Walking, etc.)
- `activities` - User activity logs

## 4. Install Dependencies

```bash
cd server
npm install
```

## 5. Seed the Database (Optional)

To populate initial data (admin user, exercise types):

```bash
npm run seed
```

This will:
- Create a default admin user
- Create a trainer user
- Add standard exercise types (Running, Walking, Cycling, etc.)

> **Note:** The seed script uses the same credentials in the code. For production, use Supabase's user authentication system.

## 6. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run at `http://localhost:3000`

## 7. Key Changes from JSON Storage

### Model Functions are Now Async

All database operations now return `Promise` objects:

```javascript
// Old (JSON):
const user = model.getById(userId)

// New (Supabase):
const user = await model.getById(userId)
```

### Snake Case → Camel Case Conversion

Supabase uses `snake_case` for columns, but the API returns `camelCase`:

```javascript
// Database: user.full_name, exercise_types.default_calories_per_minute
// API Response: user.fullName, exerciseType.defaultCaloriesPerMinute
```

This is handled automatically by helper functions in `models/supabase.ts`

## 8. API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create new user account
- `POST /api/v1/auth/login` - Login with username/password
- `GET /api/v1/auth/me` - Get current user (requires token)

### Users
- `GET /api/v1/users` - List all users (requires auth)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user (admin only)
- `PATCH /api/v1/users/:id` - Update user (admin only)
- `DELETE /api/v1/users/:id` - Delete user (admin only)
- `POST /api/v1/users/friends` - Add friend
- `DELETE /api/v1/users/friends/:friendId` - Remove friend

### Exercise Types
- `GET /api/v1/exercise-types` - List all exercise types
- `GET /api/v1/exercise-types/:id` - Get exercise type by ID

### Activities
- `GET /api/v1/activities` - List all activities (admin only)
- `GET /api/v1/activities/me` - Get current user's activities
- `GET /api/v1/activities/user/:userId` - Get user's activities
- `GET /api/v1/activities/:id` - Get activity by ID
- `POST /api/v1/activities` - Create new activity
- `PATCH /api/v1/activities/:id` - Update activity
- `DELETE /api/v1/activities/:id` - Delete activity

## 9. Troubleshooting

### "No tables found" error
- Ensure you've run the schema.sql file in Supabase
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct

### "Connection timeout"
- Verify your Supabase project is running
- Check internet connection
- Ensure firewall allows Supabase connections

### "Authentication failed"
- Verify JWT_SECRET matches what's used in your login flow
- Check that tokens are being sent with `Authorization: Bearer <token>`

### 401 Unauthorized errors
- Ensure token is valid and not expired (expires in 30 days)
- Check that the Authorization header format is: `Bearer <token>`

## 10. Client-Side Setup

The client is already configured to use the backend API. Just ensure:

1. `client/src/api/session.ts` has the correct API base URL
2. Update `vite.config.ts` proxy settings if needed

## 11. Production Deployment

For Render.yaml deployment:
1. Add environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `JWT_SECRET`
2. The database schema must already exist in your Supabase project
3. Deploy as usual - the server will connect to your Supabase instance

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase API Reference](https://supabase.com/docs/reference)
- Check the model files in `server/models/` for implementation examples
