export const enumToArray = <T extends Record<string, string>>(enumObj: T) => {
  return Object.entries(enumObj).map(([key, value]) => ({
    key,
    value,
    label: key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, " "),
  }));
};
