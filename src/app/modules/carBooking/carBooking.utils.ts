function formatAMPM(date: any) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12; // Convert to 12-hour format
  hours = hours ? hours : 12; // Handle midnight (0 becomes 12)
  minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero for minutes
  return hours + ':' + minutes + ' ' + ampm;
}

export default formatAMPM;

// const date = new Date('2025-08-02T04:21:05.108Z'); // Example ISO 8601 Date
// console.log(formatAMPM(date)); // Output: "4:21 AM"

export function isBookingOverlapping(existingCarBooking:any, payload:any) {
  const newStartDate = new Date(payload.startDate);
  const newEndDate = new Date(payload.endDate);
  for (let i = 0; i < existingCarBooking.length; i++) {
    const existingBooking = existingCarBooking[i];
    const existingStartDate = new Date(existingBooking.startDate);
    const existingEndDate = new Date(existingBooking.endDate);

    // Check for overlap
    if (newStartDate < existingEndDate && newEndDate > existingStartDate) {
      return true; // Overlapping found
    }
  }
  return false; // No overlap
}