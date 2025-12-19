import Swal, { SweetAlertOptions } from "sweetalert2";

const Alert = async (
  success: boolean,
  text: string,
  closeButtonText = "OK",
  options?: SweetAlertOptions
) => {
  try {
    await Swal.fire({
      titleText: success ? "Success" : "Failure",
      icon: success ? "success" : "error",
      text: text,
      confirmButtonText: closeButtonText,
      ...options,
    });
  } catch (error) {
    console.error("SweetAlert error:", error);
  }
};

export const sweetAlert = {
  success: (
    text: string,
    closeButtonText = "OK",
    options?: SweetAlertOptions
  ) => Alert(true, text, closeButtonText, options),
  error: (text: string, closeButtonText = "OK", options?: SweetAlertOptions) =>
    Alert(false, text, closeButtonText, options),
};

export const getFilePath = (
  imagePath: string | File | undefined | null
): string => {
  if (!imagePath || typeof imagePath !== "string") {
    return "";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath.replace(/\\/g, "/");
  }

  const cleanedPath = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${process.env.NEXT_PUBLIC_FILE_URL}/${cleanedPath.slice(7)}`;
};
