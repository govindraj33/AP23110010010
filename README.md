# Campus Notification System - Frontend Track

**Roll Number:** AP23110010010  
**Track:** Frontend  
**Stage:** Stage 2 - Priority Inbox Complete

---

## Overview

This is a React-based notification system built for campus use. It helps students stay on top of important notifications by intelligently prioritizing them based on type and recency. The system includes filtering capabilities, visual indicators for new notifications, and a responsive design that works seamlessly on both desktop and mobile devices.

## What's Inside

```
AP23110010010/
├── logging_middleware/
│   └── log.js                          # Reusable logging middleware
├── notification_app_fe/                # React frontend application
│   ├── src/
│   │   ├── App.jsx                     # Main application component
│   │   ├── main.jsx                    # Entry point
│   │   ├── App.css                     # Styles
│   │   ├── index.css                   # Global styles
│   │   └── assets/                     # Static assets
│   ├── public/                         # Public assets
│   ├── package.json                    # Dependencies
│   ├── vite.config.js                  # Vite configuration (port 3000)
│   └── README.md                       # Frontend documentation
├── notification_system_design.md       # Architecture design document
├── .gitignore                          # Git ignore rules
└── README.md                           # This file
```

---

## Key Features

### Priority Inbox
The heart of this system is the Priority Inbox, which automatically sorts your unread notifications by importance. Placements get the highest priority, followed by events, and then results. The system also considers how recent each notification is, so you'll always see the most urgent items first.

### Two-Tab Navigation
The app has two main views:
- **All Notifications:** Browse your complete notification history with filtering options
- **Priority Inbox:** See only your unread notifications, sorted by importance

### Smart Filtering
You can filter notifications by type to focus on what matters most to you right now:
- Events (campus activities and announcements)
- Results (exam scores and academic updates)
- Placements (job opportunities and placement news)

### Visual Feedback
New notifications stand out with a "NEW" badge, blue border, and bold text. Once you click on a notification, it's marked as read and the styling changes to help you keep track of what you've already seen.

### Customizable Priority Limit
You can adjust how many priority notifications you want to see at once, anywhere from 1 to 50. The default is 10, which works well for most people.

### Real-Time Unread Counter
The header shows a badge with your current unread count, which updates automatically as you read through notifications.

### Mobile-Friendly
The interface adapts to your screen size, whether you're on a phone, tablet, or desktop computer.

---

## How the Priority Algorithm Works

The system uses a scoring formula to determine which notifications are most important:

```
Priority Score = (Type Weight × 100) + Recency Score
```

**Type Weights:**
- Placement notifications: 3 (highest priority)
- Event notifications: 2 (medium priority)
- Result notifications: 1 (lower priority)

**Recency Score:**
Newer notifications get higher scores. The score decreases as time passes, calculated as:
```
max(0, 100 - hours_since_notification)
```

**Example:**
- A placement notification from 2 hours ago scores: (3 × 100) + 98 = 398 points
- An event notification from 5 hours ago scores: (2 × 100) + 95 = 295 points
- A result notification from 1 hour ago scores: (1 × 100) + 99 = 199 points

This means the placement notification would appear first, even though the result is more recent.

---

## Technology Stack

The application is built with modern web technologies:

**Frontend:**
- React 19.2.5 with Hooks for state management
- Material-UI 9.0.0 for the user interface components
- Vite 8.0.10 for fast development and optimized builds

**Logging:**
- Custom middleware that tracks user actions and API calls
- Integrates with the evaluation service for comprehensive monitoring

**Development Tools:**
- ESLint for maintaining code quality
- Modern JavaScript (ES6+)

---

## Getting Started

### What You'll Need
- Node.js version 18 or higher
- npm or yarn package manager

### Installation Steps

1. Clone this repository:
```bash
git clone https://github.com/[your-username]/AP23110010010.git
cd AP23110010010
```

2. Install the dependencies:
```bash
cd notification_app_fe
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

Then open your browser and go to: **http://localhost:3000**

### Building for Production

When you're ready to deploy:
```bash
npm run build
npm run preview
```

---

## Main Features Breakdown

### All Notifications Tab
This tab shows your complete notification history. You can filter by type to find specific notifications, and both read and unread items are displayed together. The system handles pagination automatically, so you don't need to worry about loading more notifications.

### Priority Inbox Tab
This is where you'll find only your unread notifications, sorted by the priority algorithm. You can adjust how many notifications appear using the limit control. The most important items always appear at the top.

### Filtering System
Use the toggle buttons to filter notifications:
- **All Types:** Shows everything
- **Events:** Campus events and activities
- **Results:** Academic results and updates
- **Placements:** Job placement opportunities

### Visual Indicators

**New Notifications:**
- Red "NEW" badge
- Blue border (2px)
- Elevated shadow effect
- Bold text
- Highlighted background

**Read Notifications:**
- Standard appearance
- Normal text weight
- Subtle shadow

---

## Logging Middleware

The logging middleware is located in `logging_middleware/log.js`. It's a reusable function that sends structured logs to the evaluation service API.

**How to use it:**
```javascript
import { log } from '../../logging_middleware/log.js';

await log('frontend', 'info', 'api', 'User action performed', token);
```

**Parameters:**
- `stack`: Either "frontend" or "backend"
- `level`: Log severity ("debug", "info", "warn", "error", or "fatal")
- `packageName`: The component or module name (like "api" or "component")
- `message`: A descriptive message about what happened
- `token`: Your authorization token

---

## API Integration

The application connects to two main APIs:

### Notification API
```
GET http://20.207.122.201/evaluation-service/notifications
```
Query parameters: `limit`, `page`, `notification_type`

This endpoint fetches notifications based on your filters and pagination settings.

### Logging API
```
POST http://20.207.122.201/evaluation-service/logs
```
Request body: `{ stack, level, package, message }`

This endpoint receives log entries from the application.

Both APIs require Bearer token authentication in the request headers.

---

## Testing the Application

### Functionality Tests
1. Open http://localhost:3000 in your browser
2. Switch between the All Notifications and Priority Inbox tabs
3. Try filtering by Event, Result, and Placement types
4. Click on notifications to mark them as read
5. Adjust the priority limit (try 5, 10, or 20)
6. Watch the unread count update as you read notifications
7. Click the refresh button to fetch new notifications

### Responsive Design Tests
1. Open your browser's DevTools (press F12)
2. Toggle the device toolbar (Ctrl+Shift+M on Windows, Cmd+Shift+M on Mac)
3. Test different screen sizes:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1920px width
4. Verify that the layout adapts properly to each size

### Logging Verification
1. Open the Network tab in DevTools
2. Interact with the application
3. Look for POST requests to `/logs`
4. Check that responses have status 200
5. Verify each response includes a logID

---

## Code Quality Standards

This project follows production-grade coding practices:

**General Standards:**
- Clear, descriptive naming conventions (camelCase for variables, PascalCase for components)
- Comprehensive inline comments explaining complex logic
- Clean, organized code structure
- ESLint compliance for consistent formatting
- No console.log statements in production code
- Proper error handling throughout

**React Best Practices:**
- Functional components with Hooks
- Proper state management with useState
- Correct useEffect dependencies to avoid unnecessary re-renders
- Descriptive event handler names
- Keys on list items for efficient rendering
- Optimized conditional rendering

---

## Requirements Compliance

### Stage 2 Requirements
- [x] Two-page navigation using tabs
- [x] Priority inbox showing top N unread notifications
- [x] Filter by notification type (Event, Result, Placement)
- [x] Visual distinction between new and viewed notifications
- [x] Application runs on http://localhost:3000
- [x] Material-UI only (no other CSS frameworks)
- [x] Responsive design for desktop and mobile
- [x] Robust error handling
- [x] High code quality standards
- [x] Comprehensive logging integration

### Stage 1 Requirements
- [x] Logging middleware folder with reusable function
- [x] notification_system_design.md architecture document
- [x] notification_app_fe folder with React application
- [x] .gitignore file excluding node_modules
- [x] Production-grade code quality
- [x] Material-UI for styling
- [x] Logging integrated throughout the application

---

## Material-UI Components

The application uses these Material-UI components:

- **AppBar & Toolbar** - Top navigation bar with branding and actions
- **Tabs & Tab** - Page navigation between All Notifications and Priority Inbox
- **Badge** - Unread count indicator in the header
- **ToggleButtonGroup & ToggleButton** - Filter controls for notification types
- **TextField** - Input field for adjusting priority limit
- **Card & CardContent** - Individual notification display cards
- **Chip** - Type badges showing Event, Result, or Placement
- **Typography** - Text elements with proper hierarchy
- **Stack & Box** - Layout containers for spacing and alignment
- **Divider** - Visual separation between sections
- **CircularProgress** - Loading spinner during data fetches
- **Alert** - Error message display
- **Container** - Page wrapper with responsive max-width
- **Button** - Action buttons like Refresh

---

## Troubleshooting

### Port Already in Use
If you see an error that port 3000 is already in use:

**On Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

Replace [PID_NUMBER] with the process ID from the first command.

### Notifications Not Loading
If notifications aren't appearing:
- Check if your authentication token is still valid (tokens expire after some time)
- Verify the API endpoint is accessible from your network
- Open the browser console (F12) and look for error messages
- Make sure you have an active internet connection

### Build Fails
If the build command fails:
```bash
cd notification_app_fe
rm -rf node_modules package-lock.json
npm install
npm run build
```

This removes the dependencies and reinstalls them fresh, which often resolves build issues.

---

## Future Improvements

Here are some ideas for enhancing the system:

- **Real-time updates:** Use WebSockets to push new notifications instantly
- **Search functionality:** Let users search through their notification history
- **Bulk actions:** Add a "mark all as read" button
- **Export feature:** Allow users to download their notifications
- **User preferences:** Let users customize the priority weights for different notification types
- **Persistent state:** Store which notifications have been read in localStorage
- **Dark mode:** Add a theme toggle for better viewing in low light

---

## Documentation

This repository includes several documentation files:

- **README.md** - This file, covering the complete project
- **notification_system_design.md** - Detailed architecture and design decisions
- **notification_app_fe/README.md** - Frontend-specific documentation

These documents cover system architecture, component structure, the priority algorithm, logging strategy, API integration, UI/UX design principles, error handling, and responsive design.

---

**Roll Number:** AP23110010010  
**Track:** Frontend  
**Stage:** Stage 2 Complete  
**Date:** May 2, 2026

---
