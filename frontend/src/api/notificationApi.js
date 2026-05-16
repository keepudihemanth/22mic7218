import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_NOTIFICATION_API,

  headers: {
    Authorization: `Bearer ${
      import.meta.env.VITE_ACCESS_TOKEN
    }`,
  },
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
      response.data.Notifications ||
      response.data.notifications ||
      []
    );
  } catch (error) {
    console.error(
      "API Error:",
      error.response?.data ||
        error.message
    );

    return [];
  }
};
