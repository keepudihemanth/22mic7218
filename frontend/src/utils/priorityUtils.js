const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const calculatePriority = (notification) => {
  const typeWeight =
    TYPE_WEIGHTS[notification.Type] || 0;

  const currentTime = new Date().getTime();

  const notificationTime = new Date(
    notification.Timestamp
  ).getTime();

  const hoursDifference =
    (currentTime - notificationTime) /
    (1000 * 60 * 60);

  const recencyScore = Math.max(
    0,
    100 - hoursDifference
  );

  return typeWeight * 100 + recencyScore;
};

export const getTopNotifications = (
  notifications,
  topN
) => {
  return notifications
    .map((n) => ({
      ...n,
      priorityScore: calculatePriority(n),
    }))
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore
    )
    .slice(0, topN);
};