// Utility function to generate a range of dates and pad to start from Sunday
export const generateCalendarDays = (startDate, range) => {
    const days = Array.from({ length: range }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  
    const startDayOfWeek = startDate.getDay(); // Get day of the week (0 = Sunday)
  
    // Pad the array to start the week on Sunday
    const paddedDays = Array.from({ length: startDayOfWeek }, () => null).concat(days);
  
    // Fill the remaining slots to complete the last week
    const totalCells = Math.ceil(paddedDays.length / 7) * 7;
    return paddedDays.concat(Array.from({ length: totalCells - paddedDays.length }, () => null));
  };
  