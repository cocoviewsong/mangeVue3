let message = '';
export function getTime() {
  const hours = new Date().getHours();

  if (hours <= 14 && hours >= 6) {
    message = '早不醒';
  } else if (hours >= 15 && hours <= 22) {
    message = '晚不睡';
  } else {
    message = '你看看都几点了';
  }
  return message;
}
