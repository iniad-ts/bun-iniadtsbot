import dailyRecordsRepository from "../repo/dailyRecordRepo";
import userRepository from "../repo/userRepo";
import {
  formatMillisecondsToString,
  getFiscalYearStartAndEnd,
} from "../utils/timeUtils";

const rankingUseCase = {
  ranking: async (from: Date, until: Date) => {
    const records = await dailyRecordsRepository.findDailyRecordsInDateRange(
      from,
      until,
    );
    const users = await userRepository.findAllUsers();

    const userStayTimes = users
      .map((user) => {
        const stayTime = records
          .filter((record) => record.user_id === user.user_id)
          .reduce((total, { check_out, check_in }) => {
            const lastTime = (check_out ?? new Date()).getTime();
            const stayTime = lastTime - check_in.getTime();
            return total + stayTime;
          }, 0);

        return { user, stayTime };
      })
      .filter(({ stayTime }) => stayTime > 0)
      .sort((a, b) => b.stayTime - a.stayTime)
      .map((item) => ({
        ...item,
        stayTime: formatMillisecondsToString(item.stayTime),
      }));

    return userStayTimes;
  },
  ranking_all: async () => {
    const now = new Date();
    const { start, end } = getFiscalYearStartAndEnd(now);

    const records = await dailyRecordsRepository.findAllNonCafeteriaDailyRecords();
    const users = await userRepository.findAllUsers();

    const userStayTimes = users
      .map((user) => {
        const userRecords = records
          .filter(
            (record) =>
              user &&
              record.user_id === user.user_id &&
              record.check_in >= start &&
              record.check_in <= end &&
              record.check_out &&
              record.check_out <= end,
          )
          .reduce((total, record) => {
            if (record.check_out) {
              return (
                total + record.check_out.getTime() - record.check_in.getTime()
              );
            }
            return total;
          }, 0);

        return { user, stayTime: userRecords };
      })
      .filter(({ stayTime }) => stayTime > 0)
      .sort((a, b) => b.stayTime - a.stayTime)
      .map((item) => ({
        ...item,
        stayTime: formatMillisecondsToString(item.stayTime),
      }));

    return userStayTimes;
  },
};

export default rankingUseCase;
