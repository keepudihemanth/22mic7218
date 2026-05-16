require("dotenv").config();

const axios = require("axios");

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications() {
  try {
    const response = await axios.get(
      process.env.NOTIFICATION_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    return response.data.notifications || [];
  } catch (error) {
    
    console.error(
  "Error fetching notifications:",
  error.response?.data || error.message
);
    return [];
  }
}

function calculatePriority(notification) {
  const typeWeight =
    TYPE_WEIGHTS[notification.Type] || 0;

  const currentTime = new Date().getTime();

  const notificationTime = new Date(
    notification.Timestamp
  ).getTime();

  const hoursDifference =
    (currentTime - notificationTime) /
    (1000 * 60 * 60);

  const recencyScore = Math.max(0, 100 - hoursDifference);

  return typeWeight * 100 + recencyScore;
}

function getTopNotifications(notifications, topN = 10) {
  return notifications
    .map((notification) => ({
      ...notification,
      priorityScore:
        calculatePriority(notification),
    }))
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore
    )
    .slice(0, topN);
}

async function main() {
  const notifications =
    await fetchNotifications();

  const topNotifications =
    getTopNotifications(notifications);

  console.log(
    "\nTop 10 Priority Notifications:\n"
  );

  topNotifications.forEach((notification, index) => {
    console.log(
      `${index + 1}. [${notification.Type}] ${
        notification.Message
      }`
    );

    console.log(
      `ID: ${notification.ID}`
    );

    console.log(
      `Timestamp: ${notification.Timestamp}`
    );

    console.log(
      `Priority Score: ${notification.priorityScore}`
    );

    console.log("--------------------------------");
  });
}

main();