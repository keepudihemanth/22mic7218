import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

export default function NotificationCard({
  notification,
  viewed,
}) {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: 3,
        borderLeft: viewed
          ? "6px solid gray"
          : "6px solid #1976d2",
        transition: "0.3s",
        cursor: "pointer",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <NotificationsIcon color="primary" />

            <Typography
              variant="h6"
              fontWeight="bold"
            >
              {notification.Type ||
                notification.type}
            </Typography>
          </Stack>

          {!viewed && (
            <Chip
              label="NEW"
              color="error"
              size="small"
            />
          )}
        </Stack>

        <Typography
          variant="body1"
          sx={{
            mb: 1,
            color: "#333",
          }}
        >
          {notification.Message ||
            notification.message}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {notification.Timestamp ||
            notification.timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}