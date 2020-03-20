// eslint-disable-next-line class-methods-use-this
function formatTimerFragment(fragment: number, minimumIntegerDigits: number) {
  return fragment.toLocaleString('en-US', { minimumIntegerDigits, useGrouping: false });
}

const formatTime = (milliseconds: number) => {
  const millis = (milliseconds % 1000) / 10;
  const second = Math.floor((milliseconds / 1000) % 60);
  const minute = Math.floor((milliseconds / (1000 * 60)) % 60);

  return `${formatTimerFragment(minute, 2)}:${formatTimerFragment(second, 2)}:${formatTimerFragment(millis, 2)}`;
};

export default formatTime;
