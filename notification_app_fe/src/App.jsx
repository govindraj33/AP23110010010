import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  IconButton,
} from "@mui/material";
import { log } from "../../logging_middleware/log.js";

function App() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [viewedNotifications, setViewedNotifications] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0); // 0: All, 1: Priority
  const [filterType, setFilterType] = useState("all");
  const [priorityLimit, setPriorityLimit] = useState(10);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2bnNnb3ZpbmRyYWpfc2lkZGFiYXRoaW5pQHNybWFwLmVkdS5pbiIsImV4cCI6MTc3NzcwMTc4OSwiaWF0IjoxNzc3NzAwODg5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDhiZGViOTMtMDE4Ni00ZTg0LTg5NGItNTE4MmIzYzIxY2I4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2lkZGFiYXRoaW5pIHZucyBnb3ZpbmQgcmFqIiwic3ViIjoiZDU2MzFlZjQtMTgxOC00MjA4LWJmNDEtYTllNTMzMGMzZDA1In0sImVtYWlsIjoidm5zZ292aW5kcmFqX3NpZGRhYmF0aGluaUBzcm1hcC5lZHUuaW4iLCJuYW1lIjoic2lkZGFiYXRoaW5pIHZucyBnb3ZpbmQgcmFqIiwicm9sbE5vIjoiYXAyMzExMDAxMDAxMCIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6ImQ1NjMxZWY0LTE4MTgtNDIwOC1iZjQxLWE5ZTUzMzBjM2QwNSIsImNsaWVudFNlY3JldCI6ImNkUmhTYWJGaHl5ZXBQeW0ifQ.9G23aMpQ-yNpku0Xws2Sg0koQ8LVel61ETbcSKQQg9A";

  // Fetch all notifications
  const fetchAllNotifications = async () => {
    setLoading(true);
    setError(null);

    await log(
      "frontend",
      "info",
      "api",
      "Fetching all notifications with pagination",
      token
    );

    try {
      let allData = [];
      let page = 1;
      let hasMore = true;

      // Fetch all pages
      while (hasMore) {
        const response = await fetch(
          `http://20.207.122.201/evaluation-service/notifications?limit=50&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.notifications && Array.isArray(data.notifications)) {
          allData = [...allData, ...data.notifications];
          hasMore = data.notifications.length === 50;
        } else if (Array.isArray(data)) {
          allData = [...allData, ...data];
          hasMore = data.length === 50;
        } else {
          hasMore = false;
        }
        
        page++;
        
        // Safety limit to prevent infinite loops
        if (page > 10) hasMore = false;
      }

      await log(
        "frontend",
        "info",
        "api",
        `Successfully fetched ${allData.length} total notifications`,
        token
      );

      setAllNotifications(allData);
    } catch (error) {
      await log(
        "frontend",
        "error",
        "api",
        `Failed to fetch notifications: ${error.message}`,
        token
      );
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await log(
      "frontend",
      "info",
      "component",
      "User clicked refresh button",
      token
    );
    await fetchAllNotifications();
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    log(
      "frontend",
      "info",
      "component",
      `User switched to ${newValue === 0 ? "All Notifications" : "Priority Inbox"} tab`,
      token
    );
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilterType(newFilter);
      log(
        "frontend",
        "info",
        "component",
        `User filtered notifications by type: ${newFilter}`,
        token
      );
    }
  };

  const handlePriorityLimitChange = (event) => {
    const value = parseInt(event.target.value) || 10;
    setPriorityLimit(value);
    log(
      "frontend",
      "info",
      "component",
      `User changed priority limit to: ${value}`,
      token
    );
  };

  const markAsViewed = (notificationId) => {
    setViewedNotifications((prev) => new Set([...prev, notificationId]));
    log(
      "frontend",
      "info",
      "component",
      `Notification marked as viewed: ${notificationId}`,
      token
    );
  };

  const isNewNotification = (notification) => {
    return !viewedNotifications.has(notification.ID);
  };

  const getNotificationColor = (type) => {
    const typeStr = type?.toLowerCase() || "";
    if (typeStr.includes("event")) return "primary";
    if (typeStr.includes("result")) return "success";
    if (typeStr.includes("placement")) return "warning";
    return "default";
  };

  // Calculate priority score based on type weight and recency
  const calculatePriorityScore = (notification) => {
    const typeWeights = {
      placement: 3,
      event: 2,
      result: 1,
    };

    const type = notification.Type?.toLowerCase() || "";
    let weight = 0;
    
    if (type.includes("placement")) weight = typeWeights.placement;
    else if (type.includes("event")) weight = typeWeights.event;
    else if (type.includes("result")) weight = typeWeights.result;

    // Recency score (newer = higher score)
    const timestamp = new Date(notification.Timestamp).getTime();
    const now = Date.now();
    const hoursSinceNotification = (now - timestamp) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 100 - hoursSinceNotification);

    return weight * 100 + recencyScore;
  };

  // Filter notifications by type
  const getFilteredNotifications = (notifications) => {
    if (filterType === "all") return notifications;
    return notifications.filter((n) =>
      n.Type?.toLowerCase().includes(filterType.toLowerCase())
    );
  };

  // Get priority notifications (unread, sorted by priority score)
  const getPriorityNotifications = () => {
    const unreadNotifications = allNotifications.filter(isNewNotification);
    const filtered = getFilteredNotifications(unreadNotifications);
    
    return filtered
      .map((n) => ({ ...n, priorityScore: calculatePriorityScore(n) }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, priorityLimit);
  };

  // Get all notifications (filtered)
  const getAllFilteredNotifications = () => {
    return getFilteredNotifications(allNotifications);
  };

  const displayNotifications =
    currentTab === 0 ? getAllFilteredNotifications() : getPriorityNotifications();

  const unreadCount = allNotifications.filter(isNewNotification).length;

  useEffect(() => {
    log(
      "frontend",
      "info",
      "component",
      "Notification app initialized - Stage 2 with priority inbox",
      token
    );
    fetchAllNotifications();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* App Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Badge badgeContent={unreadCount} color="error" sx={{ mr: 2 }}>
            <Typography variant="body2">Unread</Typography>
          </Badge>
          <Button color="inherit" onClick={handleRefresh} disabled={loading}>
            Refresh
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="All Notifications" />
            <Tab
              label={
                <Badge badgeContent={unreadCount} color="error">
                  Priority Inbox
                </Badge>
              }
            />
          </Tabs>
        </Box>

        {/* Filters and Controls */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <ToggleButtonGroup
            value={filterType}
            exclusive
            onChange={handleFilterChange}
            size="small"
            fullWidth
          >
            <ToggleButton value="all">All Types</ToggleButton>
            <ToggleButton value="event">Events</ToggleButton>
            <ToggleButton value="result">Results</ToggleButton>
            <ToggleButton value="placement">Placements</ToggleButton>
          </ToggleButtonGroup>

          {currentTab === 1 && (
            <TextField
              label="Priority Limit"
              type="number"
              value={priorityLimit}
              onChange={handlePriorityLimitChange}
              size="small"
              sx={{ width: { xs: "100%", sm: 150 } }}
              inputProps={{ min: 1, max: 50 }}
            />
          )}
        </Stack>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Notifications List */}
            {displayNotifications.length === 0 ? (
              <Card>
                <CardContent>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {currentTab === 1
                      ? "No unread priority notifications"
                      : "No notifications available"}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={2}>
                {displayNotifications.map((notification) => {
                  const isNew = isNewNotification(notification);
                  return (
                    <Card
                      key={notification.ID}
                      elevation={isNew ? 4 : 1}
                      sx={{
                        bgcolor: isNew ? "action.hover" : "background.paper",
                        border: isNew ? 2 : 0,
                        borderColor: isNew ? "primary.main" : "transparent",
                        transition: "all 0.3s",
                        "&:hover": {
                          elevation: 6,
                          transform: "translateY(-2px)",
                        },
                      }}
                      onClick={() => markAsViewed(notification.ID)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={notification.Type || "Notification"}
                              color={getNotificationColor(notification.Type)}
                              size="small"
                            />
                            {isNew && (
                              <Chip
                                label="NEW"
                                color="error"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {notification.Timestamp
                              ? new Date(notification.Timestamp).toLocaleString()
                              : "N/A"}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: isNew ? 600 : 400 }}>
                          {notification.Message || "No message"}
                        </Typography>
                        {notification.ID && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: "block" }}
                          >
                            ID: {notification.ID}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}

            {/* Summary */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {currentTab === 0
                  ? `Showing ${displayNotifications.length} of ${allNotifications.length} total notifications`
                  : `Showing top ${displayNotifications.length} priority notifications (${unreadCount} unread)`}
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default App;