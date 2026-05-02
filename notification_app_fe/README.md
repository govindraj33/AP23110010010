# Notification System - Frontend Application

**Roll Number:** AP23110010010  
**Track:** Frontend  
**Framework:** React + Vite + Material-UI

## Overview

A production-ready notification dashboard built with React that displays real-time notifications from the Affordmed evaluation service. The application features comprehensive logging middleware integration, Material-UI components, and robust error handling.

## Features

- ✅ Real-time notification display with pagination
- ✅ Comprehensive logging of all user interactions and API calls
- ✅ Material-UI based responsive design
- ✅ Error handling with user-friendly feedback
- ✅ Load more functionality for browsing notifications
- ✅ Color-coded notification types (info, warning, error, success)
- ✅ Loading states and empty state handling

## Technology Stack

- **React** 19.2.5 - UI framework with Hooks
- **Vite** 8.0.10 - Build tool and dev server
- **Material-UI** 9.0.0 - Component library
- **Emotion** - CSS-in-JS styling
- **ESLint** - Code quality and linting

## Project Structure

```
notification_app_fe/
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # Component styles
│   ├── main.jsx          # Application entry point
│   ├── index.css         # Global styles
│   └── assets/           # Static assets
├── public/               # Public assets
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── eslint.config.js      # ESLint configuration
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure the logging middleware is available at `../logging_middleware/log.js`

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Logging Integration

The application uses a custom logging middleware that sends structured logs to the evaluation service. All significant events are logged:

- Application initialization
- API fetch operations (start, success, error)
- User interactions (refresh, load more)
- Error conditions

**Logging Function:**
```javascript
log(stack, level, packageName, message, token)
```

**Example Usage:**
```javascript
await log("frontend", "info", "api", "Fetching notifications - page: 1", token);
```

## API Integration

### Notification API
- **Endpoint:** `GET http://20.207.122.201/evaluation-service/notifications`
- **Parameters:** `limit` (default: 10), `page` (default: 1)
- **Authentication:** Bearer token in Authorization header

### Logging API
- **Endpoint:** `POST http://20.207.122.201/evaluation-service/logs`
- **Body:** `{ stack, level, package, message }`
- **Authentication:** Bearer token in Authorization header

## Key Components

### App Component
Main application component that handles:
- State management for notifications, loading, and errors
- API calls with comprehensive logging
- Pagination logic
- User interaction handlers
- UI rendering with Material-UI components

### Material-UI Components Used
- Container, Box - Layout
- Card, CardContent - Notification display
- Button - User actions
- Typography - Text hierarchy
- Chip - Notification type badges
- Alert - Error messages
- CircularProgress - Loading indicators
- Stack, Divider - Spacing and separation

## Error Handling

The application handles various error scenarios:
- Network failures
- HTTP errors (4xx, 5xx)
- Empty responses
- Logging failures (silent)

All errors are logged and displayed to users with friendly messages.

## Design Principles

1. **User Experience:** Clean, intuitive interface with clear feedback
2. **Observability:** Comprehensive logging for debugging and monitoring
3. **Responsiveness:** Adapts to different screen sizes
4. **Accessibility:** Semantic HTML and ARIA labels via MUI
5. **Code Quality:** ESLint rules, proper naming conventions, comments

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ support required
- Responsive design for mobile and desktop

## Development Guidelines

1. Follow React best practices and hooks patterns
2. Use Material-UI components for consistency
3. Log all significant events with appropriate levels
4. Handle errors gracefully with user feedback
5. Write descriptive commit messages
6. Test thoroughly before committing

## Future Enhancements

- Real-time updates with WebSockets
- Notification filtering and search
- Mark as read/unread functionality
- Virtual scrolling for performance
- Unit and integration tests
- State management with Context API or Redux

## Documentation

For detailed architecture and design decisions, see `../notification_system_design.md`

## License

This project is part of the Affordmed Campus Hiring Evaluation.

---

**Note:** This application is built for evaluation purposes and includes comprehensive logging to demonstrate production-grade development practices.
