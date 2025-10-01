# API Documentation - Ricky Gym

Base URL: `http://localhost:5000/api`

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

---

## Authentication

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "fullName": "John Doe" // optional
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### POST /auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "profilePhotoUrl": "url_to_photo"
  }
}
```

### GET /auth/me
Get current authenticated user.

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "profilePhotoUrl": "url_to_photo",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Users

### GET /users/profile/:userId?
Get user profile. If userId is not provided, returns current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "profilePhotoUrl": "url_to_photo",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "statistics": {
    "totalCheckins": 25,
    "monthsActive": 3,
    "lastCheckin": "2024-01-15"
  }
}
```

### PUT /users/profile
Update current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Smith",
  "username": "johnsmith"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johnsmith",
    "fullName": "John Smith",
    "profilePhotoUrl": "url_to_photo"
  }
}
```

### POST /users/profile/photo
Upload profile photo.

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `photo`: Image file (JPEG, PNG, GIF, WebP, max 5MB)

**Response (200):**
```json
{
  "message": "Profile photo uploaded successfully",
  "photoUrl": "url_to_uploaded_photo"
}
```

### GET /users/search?query=<search>
Search for users by username or full name.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `query`: Search term (minimum 2 characters)

**Response (200):**
```json
{
  "users": [
    {
      "id": 2,
      "username": "janedoe",
      "fullName": "Jane Doe",
      "profilePhotoUrl": "url_to_photo"
    }
  ]
}
```

---

## Check-ins

### POST /checkins
Create a new check-in for today.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `notes`: Optional notes (text)
- `photo`: Optional image file
- `checkinDate`: Optional date (YYYY-MM-DD), defaults to today

**Response (201):**
```json
{
  "message": "Check-in successful",
  "checkin": {
    "id": 1,
    "userId": 1,
    "checkinDate": "2024-01-15",
    "checkinTime": "14:30:00",
    "photoUrl": "url_to_photo",
    "notes": "Great workout!",
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
}
```

### GET /checkins/user/:userId?
Get check-ins for a user. If userId is not provided, returns current user's check-ins.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate`: Filter start date (YYYY-MM-DD)
- `endDate`: Filter end date (YYYY-MM-DD)
- `limit`: Number of results (default: 30, max: 100)
- `offset`: Pagination offset (default: 0)

**Response (200):**
```json
{
  "checkins": [
    {
      "id": 1,
      "userId": 1,
      "checkinDate": "2024-01-15",
      "checkinTime": "14:30:00",
      "photoUrl": "url_to_photo",
      "notes": "Great workout!",
      "createdAt": "2024-01-15T14:30:00.000Z"
    }
  ]
}
```

### GET /checkins/stats/:userId?
Get check-in statistics. If userId is not provided, returns current user's stats.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period`: Time period (all, year, month, week)

**Response (200):**
```json
{
  "period": "month",
  "statistics": {
    "totalCheckins": 25,
    "uniqueDays": 20,
    "firstCheckin": "2024-01-01",
    "lastCheckin": "2024-01-15",
    "avgPerDay": 0.83
  },
  "byDayOfWeek": [
    { "day": "Monday", "count": 4 },
    { "day": "Tuesday", "count": 3 }
  ]
}
```

### DELETE /checkins/:checkinId
Delete a check-in (only your own check-ins).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Check-in deleted successfully"
}
```

---

## Friends

### POST /friends/request
Send a friend request.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "friendId": 2
}
```

**Response (201):**
```json
{
  "message": "Friend request sent",
  "friendship": {
    "id": 1,
    "userId": 1,
    "friendId": 2,
    "status": "pending",
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
}
```

### PUT /friends/request/:friendshipId
Respond to a friend request (accept or reject).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "accepted" // or "rejected"
}
```

**Response (200):**
```json
{
  "message": "Friend request accepted",
  "friendship": {
    "id": 1,
    "userId": 2,
    "friendId": 1,
    "status": "accepted"
  }
}
```

### GET /friends
Get list of accepted friends.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "friends": [
    {
      "friendshipId": 1,
      "user": {
        "id": 2,
        "username": "janedoe",
        "fullName": "Jane Doe",
        "profilePhotoUrl": "url_to_photo"
      }
    }
  ]
}
```

### GET /friends/pending
Get pending friend requests (requests sent to you).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "requests": [
    {
      "friendshipId": 2,
      "user": {
        "id": 3,
        "username": "bobsmith",
        "fullName": "Bob Smith",
        "profilePhotoUrl": "url_to_photo"
      },
      "createdAt": "2024-01-15T14:30:00.000Z"
    }
  ]
}
```

### DELETE /friends/:friendshipId
Remove a friend or cancel a friend request.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Friend removed successfully"
}
```

---

## Leaderboard

### GET /leaderboard
Get leaderboard rankings.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period`: Time period (all, year, month, week) - default: month
- `friendsOnly`: Show only friends (true/false) - default: false
- `limit`: Number of results (default: 50, max: 100)

**Response (200):**
```json
{
  "period": "month",
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "id": 1,
        "username": "johndoe",
        "fullName": "John Doe",
        "profilePhotoUrl": "url_to_photo"
      },
      "checkinCount": 25,
      "uniqueDays": 20
    }
  ]
}
```

### GET /leaderboard/group-stats
Get aggregated statistics for your friend group.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period`: Time period (all, year, month, week) - default: month

**Response (200):**
```json
{
  "period": "month",
  "groupStatistics": {
    "activeMembers": 5,
    "totalCheckins": 120,
    "avgCheckinsPerUser": 24.0
  }
}
```

---

## Error Codes

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider adding rate limiting middleware.

## Notes

- All timestamps are in UTC
- Dates should be in ISO 8601 format (YYYY-MM-DD)
- File uploads limited to 5MB
- JWT tokens expire after 7 days (configurable)
