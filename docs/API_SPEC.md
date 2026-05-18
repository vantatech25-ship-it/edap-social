# API Specification: EDAP Social

## 1. REST API

### Authentication
- `POST /api/auth/register` - Register a new account.
- `POST /api/auth/login` - Authenticate and receive access/refresh tokens.
- `POST /api/auth/refresh` - Refresh access token.
- `POST /api/auth/logout` - Invalidate sessions.

### Users & Profiles
- `GET /api/users/:id` - Fetch user profile.
- `PUT /api/users/me` - Update profile details (bio, avatar).
- `POST /api/users/:id/follow` - Follow user or send friend request.
- `DELETE /api/users/:id/follow` - Unfollow or remove friend.
- `POST /api/users/:id/block` - Block a user.
- `GET /api/users/:id/connections?cursor=xyz` - List followers/friends (Cursor-based pagination).
- `GET /api/users/me/export` - Export user data (POPIA).

### Feed & Posts
- `GET /api/feed?sort=ranked|chronological&cursor=xyz` - Get personalized news feed via cursor pagination.
- `POST /api/posts` - Create a new post.
- `GET /api/posts/:id` - Get specific post details.
- `PUT /api/posts/:id` - Edit post.
- `DELETE /api/posts/:id` - Delete post.
- `POST /api/posts/:id/react` - Add reaction to post.

### Comments
- `GET /api/posts/:id/comments?cursor=xyz` - List comments (Cursor-based).
- `POST /api/posts/:id/comments` - Add a comment.
- `DELETE /api/comments/:id` - Delete comment.

### Messaging (REST Fallbacks/History)
- `GET /api/messages/threads?cursor=xyz` - List chat threads for current user.
- `GET /api/messages/threads/:id?cursor=xyz` - Get messages in a thread (Cursor-based).

### Groups & Pages
- `POST /api/groups` - Create a group.
- `GET /api/groups/:id` - Get group details.
- `POST /api/groups/:id/join` - Join group / request access.
- `GET /api/groups/:id/feed?cursor=xyz` - Get group-specific post feed.

### Notifications
- `GET /api/notifications?cursor=xyz` - Get user notifications (Cursor-based).
- `PUT /api/notifications/read` - Mark notifications as read.

### Search
- `GET /api/search?q=query&type=users|posts|groups&cursor=xyz` - Global search.

### Admin & Moderation
- `POST /api/reports` - Report content/user.
- `GET /api/admin/reports` - List moderation queue.
- `POST /api/admin/reports/:id/action` - Resolve report (suspend, delete, warn).

---

## 2. Real-Time Events (WebSocket - Socket.IO)

### Connection & Auth
- **Handshake:** Must include JWT in `auth` payload (`{ token: '...' }`). Handshake is rejected if token is invalid or expired.

### Emitted Events (Client to Server)
- `message:send` - Send a new message to a thread (`{ threadId, content, mediaUrl }`).
- `typing:start` - User started typing in a thread (`{ threadId }`).
- `typing:stop` - User stopped typing (`{ threadId }`).
- `notifications:subscribe` - Optional, used if client wants to join specific notification rooms manually.

### Received Events (Server to Client)
- `message:receive` - Incoming message payload.
- `typing:status` - Broadcasts typing indicator to thread participants.
- `notification:new` - Real-time alert for follow/like/comment.
- `error` - WebSocket error handling (e.g., unauthorized actions).
