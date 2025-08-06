export const formatDate = (dateString: string): { month: string; day: string; year: string; fullDate: string } => {
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return {
    month: months[date.getMonth()],
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
    fullDate: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  };
};

export const groupHistoryByMonth = (history: any[]): any[] => {
  const grouped: { [key: string]: any[] } = {};
  history.forEach(item => {
    const { month, year } = formatDate(item.analyzed_at);
    const key = `${month} ${year}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  return Object.entries(grouped)
    .map(([monthYear, items]) => ({
      monthYear,
      items: items.sort((a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime())
    }))
    .sort((a, b) => {
      const dateA = new Date(a.items[0].analyzed_at);
      const dateB = new Date(b.items[0].analyzed_at);
      return dateB.getTime() - dateA.getTime();
    });
}; 