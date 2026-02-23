import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleCatchError = (
  error: Error,
  api: string,
  method: string = "GET",
) => {
  if (error instanceof AxiosError) {
    let status = error.response?.status;
    if (error.message == "Network Error") {
      status = 405;
    }
    const url = error.response?.config?.url;
    switch (status) {
      case 500:
        toast.error("internal server error");
        return false;

      case 404:
        toast.error("API not found! What are you doing bro? You need glasses.");
        return false;

      case 401:
        toast.error("Unauthorized access. Please login again.");
        return false;

      case 403:
        toast.error(
          "Forbidden. You do not have permission to perform this action.",
        );
        console.log(error);
        return false;

      case 400:
        toast.error("Bad request. Please check the data and try again.");
        return false;

      case 415:
        toast.error("Unsupported Media Type. Check your request headers.");
        return false;

      default:
        if (error.response?.data) {
          const message =
            error.response.data?.message ||
            error.response.data?.error_description ||
            "An error occurred on the server.";
          toast.error(message);
        } else {
          toast.error(
            `Server returned status ${status}. Something went wrong. You may not be connected to the internet. Please try again later.`,
          );
        }
        return false;
    }
  } else if ((error as AxiosError).request) {
    // Request was made but no response
    toast.error("No response from the server. Please try again later.");
    return false;
  } else if (error instanceof Error) {
    // Non-Axios JavaScript error
    toast.error(error.message || "An unexpected error occurred.");
    return false;
  } else {
    toast.error("An unknown error occurred.");
    return false;
  }

  throw error;
};
