export const generateFormData = <T extends Record<string, unknown>>(
  values: T,
  formData: FormData = new FormData(),
  parentKey = ""
): FormData => {
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    const formKey = parentKey ? `${parentKey}.${key}` : key;

    if (value instanceof Date) {
      formData.append(formKey, value.toISOString());
    } else if (value instanceof File) {
      formData.append(formKey, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((file, idx) =>
        formData.append(`${formKey}[${idx}]`, file)
      );
    } else if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        const arrayKey = `${formKey}[${idx}]`;
        if (typeof item === "object" && item !== null) {
          generateFormData(item as Record<string, unknown>, formData, arrayKey);
        } else {
          formData.append(arrayKey, String(item));
        }
      });
    } else if (typeof value === "object") {
      generateFormData(value as Record<string, unknown>, formData, formKey);
    } else {
      formData.append(formKey, String(value));
    }
  });

  return formData;
};
