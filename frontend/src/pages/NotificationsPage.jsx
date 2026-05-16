import {
  Container,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";

import { useEffect, useState } from "react";

import { fetchNotifications } from "../api/notificationApi";

import NotificationCard from "../components/NotificationCard";

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState([]);

  const [type, setType] = useState("");

  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, [type]);

  const loadNotifications = async () => {
    const data = await fetchNotifications(
      1,
      20,
      type
    );

    setNotifications(data);
  };

  const markViewed = (id) => {
    if (!viewed.includes(id)) {
      setViewed([...viewed, id]);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        All Notifications
      </Typography>

      <Select
        value={type}
        onChange={(e) =>
          setType(e.target.value)
        }
        fullWidth
        sx={{ mb: 3 }}
      >
        <MenuItem value="">
          All Types
        </MenuItem>

        <MenuItem value="Placement">
          Placement
        </MenuItem>

        <MenuItem value="Result">
          Result
        </MenuItem>

        <MenuItem value="Event">
          Event
        </MenuItem>
      </Select>

      {notifications.map((notification) => (
        <div
          key={notification.ID}
          onClick={() =>
            markViewed(notification.ID)
          }
        >
          <NotificationCard
            notification={notification}
            viewed={viewed.includes(
              notification.ID
            )}
          />
        </div>
      ))}
    </Container>
  );
}