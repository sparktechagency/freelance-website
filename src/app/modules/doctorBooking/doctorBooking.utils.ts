import moment from 'moment';
const convertToMoment = (timeString:any) => moment(timeString, 'hh:mm A');

const generateAvailableSlots = (
  startTime:any,
  endTime:any,
  duration:any,
  lunchStartTime:any,
  lunchEndTime:any,
) => {
  const availableSlots = [];

  let currentTime = convertToMoment(startTime);
  const endMoment = convertToMoment(endTime);
  const lunchStartMoment = convertToMoment(lunchStartTime);
  const lunchEndMoment = convertToMoment(lunchEndTime);

  while (currentTime.isBefore(endMoment)) {
    if (
      currentTime.isBefore(lunchStartMoment) ||
      currentTime.isAfter(lunchEndMoment)
    ) {
      availableSlots.push(currentTime.format('hh:mm A'));
    }

    currentTime = currentTime.add(duration, 'minutes');
  }
  if (
    !availableSlots.includes(lunchEndMoment.format('hh:mm A')) &&
    currentTime.isAfter(lunchEndMoment)
  ) {
    availableSlots.push(lunchEndMoment.format('hh:mm A')); 
  }

  console.log('create availableSlots', availableSlots);
  return availableSlots;
};

const filterBookedSlots = (allBooking: any, availableSlots: any) => {
  const bookedSlots = allBooking.map((booking: any) => {
    const bookingStartTime = convertToMoment(booking.startTime);
    const bookingEndTime = convertToMoment(booking.endTime);

    return availableSlots.filter((slot: any) => {
      const slotTime = convertToMoment(slot);
      return slotTime.isBetween(bookingStartTime, bookingEndTime, null, '[)');
    });
  });

  const allBookedSlots = [...new Set(bookedSlots.flat())];

  return availableSlots.filter((slot: any) => !allBookedSlots.includes(slot));
};

export const getAvailableTimeSlots = (doctorAvailability: any, allBooking: any) => {
  const { startTime, endTime, timeDuration, lanchStartTime, lanchEndTime } =
    doctorAvailability;

  let availableSlots = generateAvailableSlots(
    startTime,
    endTime,
    timeDuration,
    lanchStartTime,
    lanchEndTime,
  );

  availableSlots = filterBookedSlots(allBooking, availableSlots);

  return availableSlots;
};