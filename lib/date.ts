export const formatDate = (
  date: Date | string,
  _year: boolean = true,
  _month: boolean = true,
  _day: boolean = true,
  _hours: boolean = false,
  _minutes: boolean = false,
  _seconds: boolean = false,
  _milliseconds: boolean = false,
) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(dateObj.getDate()).padStart(2, '0');
  let result = '';
  if (_year) {
    result += `${year}`;
  }
  if (_month) {
    result += `-${month}`;
  }
  if (_day) {
    result += `-${day}`;
  }
  if (_hours) {
    const hours = String(dateObj.getHours()).padStart(2, '0');
    result += ` ${hours}`;
  }
  if (_minutes) {
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    result += `:${minutes}`;
  }
  if (_seconds) {
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    result += `:${seconds}`;
  }
  if (_milliseconds) {
    const milliseconds = String(dateObj.getMilliseconds()).padStart(3, '0');
    result += `.${milliseconds}`;
  }
  return result;
};