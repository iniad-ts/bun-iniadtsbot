import type { users } from "@prisma/client";
import dailyRecordsRepository from "../repo/dailyRecordRepo";
import userRepository from "../repo/userRepo";

const officeAccessUseCase = {
  checkIn: async (userDiscordId: bigint, dateTime: Date, userName: string) => {
    const user = await userRepository.findUserByDiscordId(userDiscordId);
    if (!user) {
      const newUser = await userRepository.createUser({
        userName: userName,
        userDiscordId: userDiscordId,
      });
      return await dailyRecordsRepository.createDailyRecord({
        userId: newUser.user_id,
        checkIn: dateTime,
        is4f: false,
      });
    }
    const checkInRecord =
      await dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId(
        userDiscordId,
      );
    if (checkInRecord) {
      throw new Error("チェックアウトされていない入室記録があります。");
    }

    return await dailyRecordsRepository.createDailyRecord({
      userId: user.user_id,
      checkIn: dateTime,
      is4f: false,
    });
  },
  checkOut: async (userDiscordId: bigint, dateTime: Date) => {
    const latestRecord =
      await dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId(
        userDiscordId,
      );
    if (!latestRecord) {
      throw new Error("チェックイン記録が見つかりませんでした。");
    }

    return await dailyRecordsRepository.updateDailyRecord(latestRecord.id, {
      checkOut: dateTime,
    });
  },
  fixIn: async (userDiscordId: bigint, dateTime: Date, userName: string) => {
    const user = await userRepository.findUserByDiscordId(userDiscordId);
    if (!user) {
      const newUser = await userRepository.createUser({
        userName: userName,
        userDiscordId: userDiscordId,
      });
      return await dailyRecordsRepository.createDailyRecord({
        userId: newUser.user_id,
        checkIn: dateTime,
        is4f: false,
      });
    }

    const latestRecord =
      await dailyRecordsRepository.findDailyRecordsLatestByUserDiscordId(
        userDiscordId,
      );

    //レコードが存在しない=チェックインが完了していない場合
    if (!latestRecord) {
      await officeAccessUseCase.checkIn(userDiscordId, dateTime, userName);
      return;
    }
    //latestrecordのチェックアウトが完了している、つまり入室していない場合もチェックインを行う
    if (latestRecord?.check_out) {
      await officeAccessUseCase.checkIn(userDiscordId, dateTime, userName);
    }
    //それ以外=入室中ならチェックイン時間を更新
    else {
      await dailyRecordsRepository.updateDailyRecord(latestRecord.id, {
        checkIn: dateTime,
      });
    }
  },
  fixOut: async (userDiscordId: bigint, dateTime: Date) => {
    const latestRecord =
      await dailyRecordsRepository.findDailyRecordsLatestByUserDiscordId(
        userDiscordId,
      );
    if (!latestRecord) {
      throw new Error("チェックイン記録が見つかりませんでした。");
    }

    return await dailyRecordsRepository.updateDailyRecord(latestRecord.id, {
      checkOut: dateTime,
    });
  },
  countUncheckedOutRecords: async () => {
    const uncheckedOutRecords =
      await dailyRecordsRepository.findAllUncheckedOutRecords();
    return uncheckedOutRecords.length;
  },
  show: async () => {
    const uncheckedOutRecords =
      await dailyRecordsRepository.findAllUncheckedOutRecords();
    const users: users[] = [];
    for (const record of uncheckedOutRecords) {
      const user = await userRepository.findUserById(record.user_id);
      if (user) {
        users.push(user);
      }
    }
    return { uncheckedOutRecords, users };
  },
};

export default officeAccessUseCase;
