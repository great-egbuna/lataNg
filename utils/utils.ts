export const truncateString = (text: string) => {
  const truncatedString = text.length > 15 ? `${text.slice(0, 15)}...` : text;

  return truncatedString;
};
