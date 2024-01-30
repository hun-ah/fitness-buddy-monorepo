import dayjs from 'dayjs';

export const differenceInMinutes = (start, end) => {
  if (start && end) {
    return (end - start) / 60000;
  }
};

export const generateDate = (
  month = dayjs().month(),
  year = dayjs().year()
) => {
  const firstDateOfMonth = dayjs().year(year).month(month).startOf('month');
  const lastDateOfMonth = dayjs().year(year).month(month).endOf('month');

  const arrayOfDate = [];

  // Prefix dates
  for (let i = 0; i < firstDateOfMonth.day(); i++) {
    const date = firstDateOfMonth.day(i);

    arrayOfDate.push({
      currentMonth: false,
      date,
    });
  }

  // Current dates
  for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
    arrayOfDate.push({
      currentMonth: true,
      date: firstDateOfMonth.date(i),
      today:
        firstDateOfMonth.date(i).toDate().toDateString() ===
        dayjs().toDate().toDateString(),
    });
  }

  const remaining = 42 - arrayOfDate.length;

  // Suffix dates
  for (
    let i = lastDateOfMonth.date() + 1;
    i <= lastDateOfMonth.date() + remaining;
    i++
  ) {
    arrayOfDate.push({
      currentMonth: false,
      date: lastDateOfMonth.date(i),
    });
  }
  return arrayOfDate;
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Time options for select menu
export const generateTimeOptions = () => {
  const options = [];
  options.push(
    <option key='select' value=''>
      Select
    </option>
  );

  const startTime = dayjs().startOf('day').hour(6); // Start at 6:00 AM
  const endTime = dayjs().startOf('day').hour(20).add(30, 'minute'); // End at 8:00 PM
  const interval = 30; // 30 minutes interval

  let currentTime = startTime;

  while (currentTime.isBefore(endTime)) {
    const timeString24hr = currentTime;
    const timeStringAMPM = currentTime.format('h:mma');

    options.push(
      <option key={timeString24hr} value={currentTime}>
        {timeStringAMPM}
      </option>
    );

    currentTime = currentTime.add(interval, 'minute');
  }

  return options;
};

// Convert time to 12 hour with AM/PM
export const millisecondsToAMPM = (start, end) => {
  const startDate = dayjs(Number(start));
  const endDate = dayjs(Number(end));

  const startAMPM = startDate.format('h:mma');
  const endAMPM = endDate.format('h:mma');

  return [startAMPM, endAMPM];
};
