// eslint-disable-next-line class-methods-use-this
function formatTimerFragment(fragment: number, minimumIntegerDigits: number) {
  return fragment.toLocaleString('en-US', { minimumIntegerDigits, useGrouping: false });
}

const formatTime = (milliseconds: number, includeMilliseconds = true) => {
  const millis = (milliseconds % 1000) / 10;
  const second = Math.floor((milliseconds / 1000) % 60);
  const minute = Math.floor((milliseconds / (1000 * 60)) % 60);

  let result = `${formatTimerFragment(minute, 2)}:${formatTimerFragment(second, 2)}`;

  if (includeMilliseconds) {
    result = `${result}.${formatTimerFragment(millis, 2)}`;
  }

  return result;
};

export default formatTime;
