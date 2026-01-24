const MAX_DAILY_ATTEMPTS = 3;

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const checkDailyLimit = (attempts, lastDate) => {
  const today = new Date();

  // New day → reset
  if (!lastDate || !isSameDay(today, lastDate)) {
    return {
      allowed: true,
      reset: true,
      attemptsLeft: MAX_DAILY_ATTEMPTS
    };
  }

  const attemptsLeft = Math.max(
    0,
    MAX_DAILY_ATTEMPTS - attempts
  );

  return {
    allowed: attempts < MAX_DAILY_ATTEMPTS,
    reset: false,
    attemptsLeft
  };
};

module.exports = {
  checkDailyLimit,
  MAX_DAILY_ATTEMPTS
};
