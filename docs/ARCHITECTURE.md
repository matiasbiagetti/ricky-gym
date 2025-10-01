# Architecture Overview - Ricky Gym

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   React Application                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │  Login/      │  │  Dashboard   │  │  Leaderboard │    │  │
│  │  │  Signup      │  │              │  │              │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │  ┌──────────────┐  ┌──────────────┐                      │  │
│  │  │  Profile     │  │  Components  │                      │  │
│  │  │              │  │  (Reusable)  │                      │  │
│  │  └──────────────┘  └──────────────┘                      │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │           Services Layer (API Calls)               │  │  │
│  │  │  - authService  - userService  - checkinService    │  │  │
│  │  │  - friendService  - leaderboardService             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express.js Backend Server                     │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐          │  │
│  │  │   CORS     │  │    Auth    │  │  Validator │          │  │
│  │  │            │  │  (JWT)     │  │            │          │  │
│  │  └────────────┘  └────────────┘  └────────────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Routes Layer                            │  │
│  │  /api/auth  /api/users  /api/checkins                     │  │
│  │  /api/friends  /api/leaderboard                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 Controllers Layer                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │    Auth      │  │    User      │  │   Checkin    │    │  │
│  │  │ Controller   │  │  Controller  │  │  Controller  │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │  ┌──────────────┐  ┌──────────────┐                      │  │
│  │  │   Friend     │  │ Leaderboard  │                      │  │
│  │  │  Controller  │  │  Controller  │                      │  │
│  │  └──────────────┘  └──────────────┘                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Utils & Services                         │  │
│  │  - Database Connection Pool                               │  │
│  │  - File Upload Handler (Multer)                           │  │
│  │  - S3 Integration                                          │  │
│  │  - Password Hashing (bcrypt)                               │  │
│  │  - Token Generation (JWT)                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              │ (pg driver)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    users     │  │   checkins   │  │ friendships  │          │
│  │              │  │              │  │              │          │
│  │  - id        │  │  - id        │  │  - id        │          │
│  │  - email     │  │  - user_id   │  │  - user_id   │          │
│  │  - password  │  │  - date      │  │  - friend_id │          │
│  │  - username  │  │  - photo_url │  │  - status    │          │
│  │  - full_name │  │  - notes     │  │              │          │
│  │  - photo_url │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Indexes & Constraints                     │  │
│  │  - Primary Keys on all tables                             │  │
│  │  - Foreign Keys for relationships                         │  │
│  │  - Unique constraints (email, username)                   │  │
│  │  - Indexes on frequently queried columns                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Optional)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS S3 / File Storage                       │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      Stored Files                          │  │
│  │  - Profile Photos (profile-photos/)                       │  │
│  │  - Check-in Photos (checkin-photos/)                      │  │
│  │                                                            │  │
│  │  Fallback: Local file system during development           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. User Sign Up
```
User → Frontend (Form) → API POST /auth/signup → Controller 
→ Hash Password (bcrypt) → Database INSERT → Generate JWT 
→ Return Token & User → Store in LocalStorage → Redirect to Dashboard
```

### 2. Daily Check-in
```
User → Frontend (Upload Photo & Notes) → API POST /checkins 
→ Validate Token → Upload to S3 → Database INSERT 
→ Return Check-in → Update UI → Refresh Statistics
```

### 3. View Leaderboard
```
User → Frontend → API GET /leaderboard?period=month 
→ Validate Token → Database Query (aggregated stats) 
→ Return Ranked List → Display with Rankings & Stats
```

### 4. Friend Request
```
User A → Search User B → API POST /friends/request 
→ Database INSERT (status: pending) → User B sees request 
→ User B accepts → API PUT /friends/request/:id 
→ Update status to 'accepted' → Both users now friends
```

## Security Layers

```
┌─────────────────────────────────────┐
│   1. HTTPS/TLS (Production)        │
├─────────────────────────────────────┤
│   2. CORS Protection                │
├─────────────────────────────────────┤
│   3. JWT Token Validation           │
├─────────────────────────────────────┤
│   4. Input Validation               │
│      (Express Validator)            │
├─────────────────────────────────────┤
│   5. SQL Injection Prevention       │
│      (Parameterized Queries)        │
├─────────────────────────────────────┤
│   6. Password Hashing               │
│      (bcrypt, salt rounds: 10)      │
├─────────────────────────────────────┤
│   7. File Upload Validation         │
│      (Type, Size limits)            │
└─────────────────────────────────────┘
```

## Technology Stack Summary

### Frontend Stack
- **Framework**: React 19.x
- **Router**: React Router v7
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Build Tool**: Vite 7.x
- **Styling**: Custom CSS (Mobile-first)

### Backend Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5.x
- **Database**: PostgreSQL 12+
- **ORM/Query**: pg (native driver)
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Cloud Storage**: AWS SDK (S3)
- **Validation**: Express Validator

### Database Stack
- **RDBMS**: PostgreSQL
- **Tables**: 3 (users, checkins, friendships)
- **Indexes**: 4+ for optimization
- **Triggers**: Auto-update timestamps
- **Constraints**: PKs, FKs, Unique constraints

## Deployment Architecture

```
┌─────────────────┐
│   Users/CDN     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend Host  │
│  (Vercel/       │
│   Netlify)      │
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐
│  Backend Host   │
│  (Heroku/       │
│   Railway)      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│   DB   │ │   S3   │
│ (RDS)  │ │Storage │
└────────┘ └────────┘
```

## Performance Considerations

1. **Database Indexes**: Added on frequently queried columns
2. **Query Optimization**: Aggregated queries for statistics
3. **Connection Pooling**: PostgreSQL connection pool (max: 20)
4. **File Size Limits**: 5MB for images
5. **Pagination**: Implemented on list endpoints
6. **Caching**: Client-side (localStorage for user data)

## Scalability Features

1. **Horizontal Scaling**: Stateless API design
2. **Database**: Indexed and normalized schema
3. **File Storage**: Cloud-based (S3) for distributed access
4. **Load Balancing**: Compatible with standard LBs
5. **Caching Layer**: Redis can be added easily
6. **CDN**: Static assets can be served via CDN

## Future Enhancement Opportunities

1. Real-time features with WebSockets
2. Push notifications
3. Social sharing features
4. Workout plans and tracking
5. Achievement badges
6. Mobile apps (React Native)
7. Analytics dashboard for admins
8. Team/Group challenges
9. Integration with fitness trackers
10. AI-powered insights
