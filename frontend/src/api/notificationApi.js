import axios from "axios";

const API = axios.create({
  baseURL:
    "http://localhost:5000/api/notifications",
});

export const fetchNotifications = async (
  page = 1,
  limit = 10,
  type = ""
) => {
  try {
    const response = await API.get("", {
      params: {
        page,
        limit,
        notification_type:
          type || undefined,
      },
    });

    console.log(
      "API Response:",
      response.data
    );

    return (
      response.data.notifications || []
    );

  } catch (error) {

    console.error(
      error.response?.data ||
      error.message
    );

    return [];
  }
};