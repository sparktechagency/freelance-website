export function calculateEndDate(startDate: any, durationDays: number) {
  const start: any = new Date(startDate);

  if (isNaN(start)) {
    throw new Error('Invalid date input');
  }

  const endDate = new Date(start);
  endDate.setDate(start.getDate() + durationDays);

  return endDate;
}
