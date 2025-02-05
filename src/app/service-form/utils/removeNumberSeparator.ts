export const removeSeparator = (value: string | null) => {
  if (!value) return 0;

  if (!isNaN(Number(value))) return Number(value);

  const number = parseFloat(
    value.toString().replace(/\./g, "").replace(",", ".")
  );

  if (isNaN(number)) return 0;

  return number;
};
