# Stage 1

# Campus Notification Platform - REST API Design

## Overview

The Campus Notification Platform enables students to receive real-time updates regarding:

- Placements
- Events
- Results
- Announcements

The system supports:

- Notification management
- Read/unread tracking
- Filtering
- Real-time delivery

---

# Base URL

```http
/api/v1
```

---

# Common Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

Note: Authentication is assumed pre-authorized as per evaluation instructions.

---

# Notification Object Schema

```json
{
  "id": "string",
  "title": "string",
  "message": "string",
  "type": "placement | event | result | announcement",
  "priority": "low | medium | high",
  "isRead": false,
  "createdAt": "ISO Date",
  "updatedAt": "ISO Date"
}
```

---

# Core Features Supported

1. Fetch all notifications
2. Fetch notification by ID
3. Create notification
4. Mark notification as read
5. Delete notification
6. Filter notifications
7. Real-time notifications

---

# 1. Fetch All Notifications

## Endpoint

```http
GET /api/v1/notifications
```

## Query Parameters

```http
?page=1
&limit=10
&type=placement
&isRead=false
```

## Sample Response

```json
{
  "success": true,
  "count": 2,
  "notifications": [
    {
      "id": "n101",
      "title": "Placement Drive",
      "message": "TCS drive scheduled tomorrow",
      "type": "placement",
      "priority": "high",
      "isRead": false,
      "createdAt": "2026-05-16T10:00:00Z"
    }
  ]
}
```

---

# 2. Fetch Notification By ID

## Endpoint

```http
GET /api/v1/notifications/:id
```

## Sample Response

```json
{
  "success": true,
  "notification": {
    "id": "n101",
    "title": "Placement Drive",
    "message": "TCS drive scheduled tomorrow",
    "type": "placement",
    "priority": "high",
    "isRead": false
  }
}
```

---

# 3. Create Notification

## Endpoint

```http
POST /api/v1/notifications
```

## Request Body

```json
{
  "title": "Semester Results Published",
  "message": "Results are available on portal",
  "type": "result",
  "priority": "high"
}
```

## Sample Response

```json
{
  "success": true,
  "message": "Notification created successfully",
  "notificationId": "n102"
}
```

---

# 4. Mark Notification as Read

## Endpoint

```http
PATCH /api/v1/notifications/:id/read
```

## Sample Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

# 5. Delete Notification

## Endpoint

```http
DELETE /api/v1/notifications/:id
```

## Sample Response

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

# 6. Filter Notifications

## Endpoint

```http
GET /api/v1/notifications/filter
```

## Query Parameters

```http
?type=placement
&priority=high
```

## Sample Response

```json
{
  "success": true,
  "notifications": []
}
```

---

# Real-Time Notification Design

## Recommended Technology

- WebSockets using Socket.IO

## Workflow

1. Client establishes WebSocket connection
2. Server sends notifications instantly
3. Frontend listens for events
4. UI updates in real time

---

# WebSocket Event Structure

## Event Name

```text
new_notification
```

## Event Payload

```json
{
  "id": "n120",
  "title": "Amazon Hiring",
  "message": "Amazon drive starts at 2 PM",
  "type": "placement",
  "priority": "high"
}
```

---

# Error Response Structure

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Notification not found"
  }
}
```

---

# Logging Middleware Integration

The application uses reusable logging middleware throughout the system.

Logging is performed for:

- API requests
- API responses
- Notification creation
- Notification deletion
- Errors
- Warnings
- Real-time notification delivery
- Server startup events

## Example Logging Call

```javascript
await Log(
  "backend",
  "info",
  "notification-controller",
  "Notification created successfully"
);
```

---

# Scalability Considerations

- Pagination support
- Modular REST API design
- Real-time communication using WebSockets
- Reusable logging middleware
- Consistent JSON structures