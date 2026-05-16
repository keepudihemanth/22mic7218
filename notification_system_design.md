# Stage 1

# Campus Notification Platform - REST API Design

## Base URL

```http
/api/v1
```

## Common Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

---

# Notification Schema

```json
{
  "id": "string",
  "title": "string",
  "message": "string",
  "type": "placement | event | result | announcement",
  "priority": "low | medium | high",
  "isRead": false,
  "createdAt": "ISO Date"
}
```

---

# APIs

## Fetch Notifications

```http
GET /api/v1/notifications?page=1&limit=10
```

### Response

```json
{
  "success": true,
  "notifications": []
}
```

---

## Fetch Notification By ID

```http
GET /api/v1/notifications/:id
```

---

## Create Notification

```http
POST /api/v1/notifications
```

### Request

```json
{
  "title": "Placement Drive",
  "message": "TCS drive tomorrow",
  "type": "placement",
  "priority": "high"
}
```

---

## Mark As Read

```http
PATCH /api/v1/notifications/:id/read
```

---

## Delete Notification

```http
DELETE /api/v1/notifications/:id
```

---

# Real-Time Notification Design

Technology used:

- WebSockets using Socket.IO

Workflow:

```text
Backend → WebSocket Server → Frontend
```

Event:

```text
new_notification
```

---

# Logging Middleware Usage

```javascript
await Log(
  "backend",
  "info",
  "notification-controller",
  "Notification created successfully"
);
```

---

# Stage 2

# Database Selection

Recommended DB: MongoDB

## Reasons

- Flexible schema
- High scalability
- Fast read/write performance
- Suitable for real-time applications

---

# Notification Collection Schema

```json
{
  "_id": "ObjectId",
  "studentId": 1042,
  "title": "Placement Drive",
  "message": "TCS drive tomorrow",
  "notificationType": "Placement",
  "isRead": false,
  "createdAt": "ISO Date"
}
```

---

# Useful Indexes

```javascript
db.notifications.createIndex({ studentId: 1 });
db.notifications.createIndex({ createdAt: -1 });
db.notifications.createIndex({ notificationType: 1 });
```

---

# Scaling Problems

Possible issues:

- Slow queries
- Increased storage
- High concurrent traffic

Solutions:

- Indexing
- Pagination
- Redis caching
- Read replicas
- Archiving old notifications

---

# Sample Queries

## Fetch Notifications

```javascript
db.notifications.find({
  studentId: 1042,
  isRead: false
});
```

---

## Create Notification

```javascript
db.notifications.insertOne({
  studentId: 1042,
  title: "Placement Drive"
});
```

---

# Stage 3

# Query Optimization

## Existing Query

```sql
SELECT * FROM notifications
WHERE studentId = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

---

# Why Slow?

With 5,000,000 notifications:

- Full table scan occurs
- Sorting becomes expensive

Time Complexity:

```text
O(n)
```

---

# Optimization

## Composite Index

```sql
CREATE INDEX idx_notifications
ON notifications(studentId, isRead, createdAt);
```

Improved Complexity:

```text
O(log n)
```

---

# Should We Index Every Column?

No.

Too many indexes:

- Increase storage
- Slow inserts/updates
- Reduce write performance

Indexes should only exist for frequently queried columns.

---

# Placement Notification Query

```sql
SELECT DISTINCT studentId
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

# Stage 4

# Performance Improvements

## 1. Redis Caching

Store frequently accessed notifications in Redis.

Benefits:

- Faster response
- Reduced DB load

Tradeoff:

- Cache invalidation complexity

---

## 2. Pagination

```http
GET /api/v1/notifications?page=1&limit=20
```

Benefits:

- Smaller queries
- Faster loading

Tradeoff:

- Multiple API requests

---

## 3. WebSockets

Replace repeated polling with real-time push notifications.

Benefits:

- Real-time updates
- Lower API traffic

Tradeoff:

- Persistent socket connections

---

## 4. Read Replicas

Use replica DBs for read-heavy operations.

Benefits:

- Better scalability

Tradeoff:

- Increased infrastructure cost

---

# Stage 5

# Problems In Existing Implementation

Current approach:

- Sequential processing
- Slow for 50,000 students
- No retry mechanism
- Single point of failure
- Blocking email API calls

---

# Recommended Solution

Use:

- Queue-based architecture
- Worker services
- Retry mechanism
- Parallel processing

---

# Improved Flow

```text
HR → Queue → Workers → DB + WebSocket + Email
```

---

# Why Separate Email From DB Save?

Database save is critical and fast.

Email sending:

- Slow
- External dependency
- Failure-prone

Even if email fails, notification should still exist in the system.

---

# Revised Pseudocode

```text
function notify_all(student_ids, message):

    for student_id in student_ids:

        enqueue_job(student_id, message)


worker(job):

    save_to_db(job)

    push_to_app(job)

    enqueue_email_job(job)


email_worker(job):

    try:
        send_email(job)

    catch error:
        retry(job)
```

---

# Reliability Improvements

- Retry failed jobs
- Dead letter queue
- Parallel workers
- Distributed processing
- Logging middleware integration

---

# Logging Example

```javascript
await Log(
  "backend",
  "info",
  "notification-worker",
  "Notification processed successfully"
);
```
---

# Stage 6

# Priority Inbox Design

The Priority Inbox displays the top unread notifications based on:

1. Notification type weight
2. Notification recency

Priority order:

```text
Placement > Result > Event
```

More recent notifications receive higher scores.

---

# Approach

Each notification is assigned:

```text
Priority Score =
(Type Weight × 100) + Recency Score
```

The notifications are then:

1. Sorted by priority score
2. Top 10 notifications selected

---

# Efficient Maintenance of Top 10

To efficiently maintain top notifications as new notifications arrive:

- Use a Min Heap / Priority Queue
- Maintain only top 10 notifications in memory
- Insert new notifications dynamically
- Remove lowest priority notification when heap exceeds size 10

Time Complexity:

```text
O(log n)
```

for insertion.

This avoids sorting the entire dataset repeatedly.

---

# Technologies Used

- Node.js
- JavaScript
- Axios
- Priority-based sorting
- Protected API integration

---

# Logging Middleware Integration

```javascript
await Log(
  "backend",
  "info",
  "priority-inbox-service",
  "Top notifications generated successfully"
);
```