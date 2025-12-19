import { AxiosError } from "axios";
import { sweetAlert } from "../lib/helper";

export const handleCatchError = (
  error: Error,
  api: string,
  method: string = "GET"
) => {
  if (error instanceof AxiosError) {
    let status = error.response?.status;
    if (error.message == "Network Error") {
      status = 405;
    }
    const url = error.response?.config?.url;
    switch (status) {
      case 500:
        sweetAlert.error(
          "Feri 500 aayo. Nirdesh lai tharkam na!\nAPI chai yo ho:\nconnect/token",
          `<picture>
            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f92c/512.webp" type="image/webp">
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f92c/512.gif" alt="🤬" width="32" height="32">
          </picture>`,
          {
            html: `
              <div style="text-align: center;">
                <h3 style="margin: 0; color:red">500 aayo. Nirdesh lai tharkam na!</h3>
                <h4 style="margin: 0;">API chai yo ho:</h4>
                <code>${method}: ${url}</code>
                <audio src="/audio.mp3" autoplay></audio>
              </div>
            `,
          }
        );
        return false;

      case 404:
        sweetAlert.error(
          "API not found! What are you doing bro? You need glasses.",
          "OK",
          {
            html: `
              <h3 style="margin: 0; color:red">404 error</h3>
              <h2>API or data not found</h2>
              <h4>API: ${api}</h4>
            `,
          }
        );
        return false;

      case 401:
        sweetAlert.error("Unauthorized access. Please login again.", "OK", {
          html: `
              <h3 style="margin: 0; color:orange">401 Unauthorized</h3>
              <p>You might need to reauthenticate.</p>
            `,
        });
        return false;

      case 403:
        sweetAlert.error(
          "Forbidden. You do not have permission to perform this action.",
          "OK",
          {
            html: `
              <h3 style="margin: 0; color:red">403 Forbidden</h3>
              <p>Access denied to API: ${api}</p>
              ${
                error.response?.data?.error?.message
                  ? `<p>${error.response?.data?.error?.message}</p>`
                  : ""
              }
            `,
          }
        );
        console.log(error);
        return false;

      case 400:
        sweetAlert.error(
          "Bad request. Please check the data and try again.",
          "OK",
          {
            html: `
              <h3 style="margin: 0; color:red">400 Bad Request</h3>
              <p>Something was wrong with your request.</p>
            `,
          }
        );
        return false;

      case 415:
        sweetAlert.error(
          "Unsupported Media Type. Check your request headers.",
          "OK",
          {
            html: `
              <h3 style="margin: 0; color:red">415 Unsupported Media Type</h3>
              <p>The server cannot process the request's content-type.</p>
              <p><strong>Expected:</strong> e.g., <code>multipart/form-data</code></p>
              <p><strong>Sent:</strong> ${
                error?.config?.headers?.["Content-Type"] || "unknown"
              }</p>
            `,
          }
        );
        return false;

      default:
        if (error.response?.data) {
          const message =
            error.response.data?.message ||
            error.response.data?.error_description ||
            "An error occurred on the server.";
          sweetAlert.error(message, "OK");
        } else {
          sweetAlert.error(
            `Server returned status ${status}. Something went wrong. You may not be connected to the internet. Please try again later.`,
            "OK"
          );
        }
        return false;
    }
  } else if ((error as AxiosError).request) {
    // Request was made but no response
    sweetAlert.error(
      "No response from the server. Please try again later.",
      "OK"
    );
    return false;
  } else if (error instanceof Error) {
    // Non-Axios JavaScript error
    sweetAlert.error(error.message || "An unexpected error occurred.", "OK");
    return false;
  } else {
    sweetAlert.error("An unknown error occurred.", "OK");
    return false;
  }

  throw error;
};
