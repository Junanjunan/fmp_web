export const formatDate = (
  date: Date,
  _year: boolean = true,
  _month: boolean = true,
  _day: boolean = true,
  _hours: boolean = false,
  _minutes: boolean = false,
  _seconds: boolean = false,
  _milliseconds: boolean = false,
) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
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
    const hours = String(date.getHours()).padStart(2, '0');
    result += ` ${hours}`;
  }
  if (_minutes) {
    const minutes = String(date.getMinutes()).padStart(2, '0');
    result += `:${minutes}`;
  }
  if (_seconds) {
    const seconds = String(date.getSeconds()).padStart(2, '0');
    result += `:${seconds}`;
  }
  if (_milliseconds) {
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    result += `.${milliseconds}`;
  }
  return result;
};