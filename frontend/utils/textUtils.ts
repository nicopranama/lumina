export const truncateText = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}; 