# Notification System Design

**Roll Number:** AP23110010010  
**Track:** Frontend  
**Date:** May 2, 2026

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Component Structure](#component-structure)
4. [Logging Strategy](#logging-strategy)
5. [API Integration](#api-integration)
6. [User Interface Design](#user-interface-design)
7. [Error Handling](#error-handling)
8. [Future Enhancements](#future-enhancements)

---

## System Overview

The Notification System is a React-based frontend application designed to display real-time notifications fetched from the Affordmed evaluation service. The system integrates comprehensive logging middleware to track user interactions, API calls, and error states.

### Key Features
- Real-time notification display with pagination
- Comprehensive logging of all significant events
- Material-UI based responsive design
- Error handling with user-friendly feedback
- Load more functionality for browsing historical notifications
- Color-coded notification types (info, warning, error, success)

---

## Architecture Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend                      │
│  ┌────────────────────────────────────────────┐    │
│  │           App Component (Main)              │    │
│  │  - State Management                         │    │
│  │  - Event Handlers                           │    │
│  │  - UI Rendering                             │    │
│  └────────────────────────────────────────────┘    │
│                      │                               │
│         ┌────────────┴────────────┐                │
│         │                         │                 │
│  ┌──────▼──────┐         ┌───────▼────────┐       │
│  │   API Layer  │         │ Logging Layer  │       │
│  │  (fetch API) │         │  (middleware)  │       │
│  └──────┬──────┘         └───────┬────────┘       │
└─────────┼─────────────────────────┼────────────────┘
          │                         │
          │                         │
    ┌─────▼─────────────────────────▼─────┐
    │   Affordmed Evaluation Service       │
    │  - /notifications (GET)              │
    │  - /logs (POST)                      │
    └──────────────────────────────────────┘
```

### Technology Stack

**Frontend Framework:**
- React 19.2.5 with Hooks (useState, useEffect)
- Vite 8.0.10 for build tooling and development server

**UI Library:**
- Material-UI (MUI) 9.0.0
  - Components: Button, Card, Typography, Container, CircularProgress, Alert, Chip, Stack
  - Emotion for styling (@emotion/react, @emotion/styled)

**Logging:**
- Custom logging middleware (TypeScript/JavaScript)
- Centralized log function with API integration

**Development Tools:**
- ESLint for code quality
- React DevTools for debugging

---

## Component Structure

### Main App Component (`App.jsx`)

**State Management:**
```javascript
- notifications: Array<Notification>  // Stores fetched notifications
- loading: boolean                     // Loading state for UI feedback
- error: string | null                 // Error messages for user display
- page: number                         // Current pagination page
- hasMore: boolean                     // Flag for load more functionality
```

**Key Functions:**

1. **fetchNotifications(pageNum, append)**
   - Fetches notifications from API
   - Logs fetch initiation and results
   - Handles pagination logic
   - Updates state with new data

2. **handleRefresh()**
   - Resets pagination to page 1
   - Clears existing notifications
   - Logs user action
   - Fetches fresh data

3. **handleLoadMore()**
   - Increments page counter
   - Appends new notifications to existing list
   - Logs pagination action

4. **getNotificationColor(type)**
   - Maps notification types to MUI color schemes
   - Provides visual differentiation

---

## Logging Strategy

### Logging Middleware Design

The logging middleware is a reusable function that sends structured logs to the evaluation service.

**Function Signature:**
```javascript
log(stack, level, packageName, message, token)
```

**Parameters:**
- `stack`: "frontend" | "backend" - Identifies the application layer
- `level`: "debug" | "info" | "warn" | "error" | "fatal" - Log severity
- `packageName`: string - Component or module name (e.g., "api", "component")
- `message`: string - Descriptive log message
- `token`: string - Authorization token

**Implementation Details:**
- Uses fetch API with POST method
- Sends JSON payload with structured log data
- Includes Authorization header with Bearer token
- Silently fails on error (no console.log as per requirements)
- Returns parsed response or null on failure

### Logging Points in Application

1. **Application Initialization**
   - Level: info
   - Package: component
   - Message: "Notification app initialized - fetching initial data"

2. **API Fetch Start**
   - Level: info
   - Package: api
   - Message: "Fetching notifications - page: X, limit: 10"

3. **API Fetch Success**
   - Level: info
   - Package: api
   - Message: "Successfully fetched X notifications for page Y"

4. **API Fetch Error**
   - Level: error
   - Package: api
   - Message: "Failed to fetch notifications: [error message]"

5. **User Actions**
   - Level: info
   - Package: component
   - Messages:
     - "User clicked refresh button"
     - "User clicked load more - loading page X"

### Logging Best Practices Applied

- **Descriptive Context:** Each log includes specific details (page numbers, counts)
- **Appropriate Levels:** Info for normal operations, error for failures
- **Package Categorization:** Separates API calls from component interactions
- **No Sensitive Data:** Token is used for auth but not logged in messages
- **Actionable Information:** Logs provide enough context for debugging

---

## API Integration

### Notification API

**Endpoint:** `GET http://20.207.122.201/evaluation-service/notifications`

**Query Parameters:**
- `limit`: Number of notifications per page (default: 10)
- `page`: Page number for pagination (starts at 1)

**Headers:**
- `Authorization`: Bearer token (JWT)

**Response Format:**
```json
[
  {
    "type": "info" | "warning" | "error" | "success",
    "message": "Notification message text",
    "timestamp": "ISO 8601 timestamp",
    "details": "Optional additional information"
  }
]
```

**Error Handling:**
- HTTP errors trigger error state
- Network failures are caught and logged
- User-friendly error messages displayed

### Logging API

**Endpoint:** `POST http://20.207.122.201/evaluation-service/logs`

**Headers:**
- `Content-Type`: application/json
- `Authorization`: Bearer token

**Request Body:**
```json
{
  "stack": "frontend",
  "level": "info",
  "package": "api",
  "message": "Descriptive log message"
}
```

**Response:**
```json
{
  "logID": "unique-log-identifier",
  "message": "log created successfully"
}
```

---

## User Interface Design

### Design Principles

1. **Clarity:** Clean, uncluttered interface focusing on notification content
2. **Responsiveness:** Adapts to different screen sizes using MUI Container
3. **Feedback:** Loading states, error messages, and empty states
4. **Accessibility:** Semantic HTML, proper ARIA labels via MUI components

### Layout Structure

```
┌─────────────────────────────────────────┐
│         Notification System              │
│    Real-time notification dashboard      │
├─────────────────────────────────────────┤
│        [Refresh Notifications]           │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │ [Type Badge]      [Timestamp]     │  │
│  │ ─────────────────────────────────  │  │
│  │ Notification message text         │  │
│  │ Additional details if available   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ [Type Badge]      [Timestamp]     │  │
│  │ ─────────────────────────────────  │  │
│  │ Notification message text         │  │
│  └───────────────────────────────────┘  │
│                                          │
│           [Load More]                    │
│                                          │
│      Total Notifications: X              │
└─────────────────────────────────────────┘
```

### Component Styling

**Material-UI Components Used:**
- `Container`: Responsive layout wrapper (maxWidth: "md")
- `Card` & `CardContent`: Notification display cards
- `Typography`: Text hierarchy (h3, subtitle1, body1, caption)
- `Button`: Action triggers (contained, outlined variants)
- `Chip`: Notification type badges with color coding
- `Alert`: Error message display
- `CircularProgress`: Loading indicators
- `Stack`: Vertical spacing for notification list
- `Divider`: Visual separation within cards

**Color Scheme:**
- Info: Blue
- Warning: Orange
- Error: Red
- Success: Green
- Default: Gray

---

## Error Handling

### Error Scenarios and Handling

1. **Network Errors**
   - Caught in try-catch block
   - Logged with error level
   - User sees: "Failed to load notifications. Please try again."

2. **HTTP Errors (4xx, 5xx)**
   - Checked via response.ok
   - Thrown as Error with status code
   - Logged and displayed to user

3. **Logging Failures**
   - Silently fail (as per requirements)
   - Return null from log function
   - Application continues normal operation

4. **Empty Response**
   - Handled gracefully with empty state message
   - "No notifications available" displayed

### User Feedback

- **Error Alert:** Red MUI Alert component at top of list
- **Loading State:** CircularProgress spinner during fetch
- **Empty State:** Friendly message in Card when no data
- **Disabled Buttons:** Prevent duplicate requests during loading

---

## Future Enhancements

### Potential Improvements

1. **Real-time Updates**
   - WebSocket integration for live notifications
   - Push notifications for critical alerts

2. **Filtering and Search**
   - Filter by notification type
   - Search within notification messages
   - Date range filtering

3. **Notification Actions**
   - Mark as read/unread
   - Delete notifications
   - Archive functionality

4. **Enhanced Logging**
   - Client-side log buffering
   - Batch log submissions
   - Log level configuration

5. **Performance Optimization**
   - Virtual scrolling for large lists
   - Caching with service workers
   - Optimistic UI updates

6. **Accessibility**
   - Screen reader announcements for new notifications
   - Keyboard navigation
   - High contrast mode

7. **Testing**
   - Unit tests with Jest and React Testing Library
   - Integration tests for API calls
   - E2E tests with Playwright

8. **State Management**
   - Context API for global state
   - Redux for complex state scenarios
   - React Query for server state management

---

## Conclusion

This notification system demonstrates a production-ready frontend application with:
- Clean, maintainable React code
- Comprehensive logging integration
- Professional UI/UX with Material-UI
- Robust error handling
- Scalable architecture

The design prioritizes user experience, observability through logging, and code quality, making it suitable for real-world deployment and future enhancement.
