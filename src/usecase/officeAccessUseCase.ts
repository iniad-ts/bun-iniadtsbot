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
    userRepository.updateUser(user.user_id, { userName: userName });
    const checkInRecord =
      await dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId(
        userDiscordId,
      );
    if (checkInRecord) {
      throw new Error("すでに入室済みです。");
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
      throw new Error("入室記録が見つかりませんでした。");
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
  show: async (): Promise<Array<{ userName: string; checkIn: Date }>> => {
    // 未チェックアウトレコードを取得
    const uncheckedOutRecords =
      await dailyRecordsRepository.findAllUncheckedOutRecords();

    const inUserList = uncheckedOutRecords.map(async (record) => {
      const user = await userRepository.findUserById(record.user_id);
      return { userName: user?.user_name, checkIn: record.check_in };
    });

    const allUsers = await Promise.all(inUserList);

    const validUsers = allUsers.filter(
      (user): user is { userName: string; checkIn: Date } => user !== null,
    );

    return validUsers;
  },
};
export default officeAccessUseCase;
