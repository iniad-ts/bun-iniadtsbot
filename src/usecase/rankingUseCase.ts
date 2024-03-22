import type { users } from "@prisma/client";
import dailyRecordsRepository from "../repo/dailyRecordRepo";
import userRepository from "../repo/userRepo";

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
            const lastTime = check_out ?? new Date();
            const stayTime = lastTime.getTime() - check_in.getTime();
            return total + stayTime;
          }, 0);

        return { user, stayTime };
      })
      .sort((a, b) => b.stayTime - a.stayTime)
      .map(({ user, stayTime: time }) => {
        const hours = Math.floor(time / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        const stayTime = [hours, minutes, seconds]
          .map((time) => time.toString().padStart(2, "0"))
          .join(":");

        return { user, stayTime };
      });

    return userStayTimes;
  },
  ranking_all: async () => {
    const records = await dailyRecordsRepository.findAllDailyRecords();
    const users = await userRepository.findAllUsers();

    const userStayTimes = users
      .filter((user) => user)
      .map((user) => {
        const userRecords = records.filter(
          (record) => user && record.user_id === user.user_id,
        );
        const stayTime = userRecords.reduce((total, record) => {
          if (record.check_in && record.check_out) {
            return (
              total + (record.check_out.getTime() - record.check_in.getTime())
            );
          }
          return total;
        }, 0);
        return { user, stayTime };
      })
      .sort((a, b) => b.stayTime - a.stayTime)
      .map(({ user, stayTime }) => {
        const hours = Math.floor(stayTime / (1000 * 60 * 60));
        const minutes = Math.floor((stayTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((stayTime % (1000 * 60)) / 1000);
        const formattedStayTime = `${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
        return { user, stayTime: formattedStayTime };
      });

    return userStayTimes;
  },
};

export default rankingUseCase;
