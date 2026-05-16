import {
  Container,
  Typography,
  Slider,
} from "@mui/material";

import { useEffect, useState } from "react";

import { fetchNotifications } from "../api/notificationApi";

import NotificationCard from "../components/NotificationCard";

import { getTopNotifications } from "../utils/priorityUtils";

export default function PriorityInboxPage() {
  const [notifications, setNotifications] =
    useState([]);

  const [topN, setTopN] = useState(10);

  useEffect(() => {
    loadNotifications();
  }, [topN]);

  const loadNotifications = async () => {
    const data = await fetchNotifications(
      1,
      50
    );

    setNotifications(
      getTopNotifications(data, topN)
    );
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Priority Inbox
      </Typography>

      <Typography gutterBottom>
        Top {topN} Notifications
      </Typography>

      <Slider
        value={topN}
        min={5}
        max={20}
        step={5}
        onChange={(e, value) =>
          setTopN(value)
        }
      />

      {notifications.map((notification) => (
        <NotificationCard
          key={notification.ID}
          notification={notification}
          viewed={false}
        />
      ))}
    </Container>
  );
}