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

export function getTimeNormal() {
  const hours = new Date().getHours();

  if (hours <= 9 && hours >= 5) {
    message = '早上';
  } else if (hours > 9 && hours <= 12) {
    message = '上午';
  } else if (hours > 12 && hours <= 18) {
    message = '下午';
  } else {
    message = '晚上';
  }
  return message;
}
