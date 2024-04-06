const getFiscalYearStartAndEnd = (date: Date) => {
  const year = date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
  const start = new Date(year, 3, 1);
  const end = new Date(year + 1, 2, 31);
  return { start, end };
};

const formatMillisecondsToString = (milliseconds: number) => {
  // 時間を HH:mm:ss 形式に変換する
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return [hours, minutes, seconds].map((time) => time.toString().padStart(2, '0')).join(':');
};


export { getFiscalYearStartAndEnd, formatMillisecondsToString };
