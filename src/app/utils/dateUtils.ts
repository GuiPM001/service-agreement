export const dateToIsoString = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 3, 0, 0)
    .toISOString()
    .split("T")[0];
};

export const getMonthYear = (date: Date) => {
  return date
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(" de ", "/");
};

export const getMonthYearForString = (dateString: string) => {
  const date = dateString.split('-');
  return `${date[1]}/${date[0]}`;
};

export const getDayMonth = (date: string) => {
  return new Date(date)
    .toLocaleDateString("pt-BR", { day: "numeric", month: "numeric" })
    .replace(" de ", "/");
};

export const getDayMontyhYear = (date: string | Date) => {
  console.log(date)
  return new Date(date).toLocaleString("pt-BR").split(',')[0];
}
