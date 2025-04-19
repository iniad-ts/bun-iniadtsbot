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
        is_4f: false,
        is_1f: false,
        is_2f: false,
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
      is_4f: false,
      is_1f: false,
      is_2f: false,
    });
  },

  checkIn1f: async (userDiscordId: bigint, dateTime: Date, userName: string) => {
    const user = await userRepository.findUserByDiscordId(userDiscordId);
    if (!user) {
      const newUser = await userRepository.createUser({
        userName: userName,
        userDiscordId: userDiscordId,
      });
      return await dailyRecordsRepository.createDailyRecord({
        userId: newUser.user_id,
        checkIn: dateTime,
        is_4f: false,
        is_1f: true,
        is_2f: false,
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
      is_4f: false,
      is_1f: true,
      is_2f: false,
    });
  },
  checkIn2f: async (userDiscordId: bigint, dateTime: Date, userName: string) => {
    const user = await userRepository.findUserByDiscordId(userDiscordId);
    if (!user) {
      const newUser = await userRepository.createUser({
        userName: userName,
        userDiscordId: userDiscordId,
      });
      return await dailyRecordsRepository.createDailyRecord({
        userId: newUser.user_id,
        checkIn: dateTime,
        is_4f: false,
        is_1f: false,
        is_2f: true,
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
      is_4f: false,
      is_1f: false,
      is_2f: true,
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
        is_4f: false,
        is_1f: false,
        is_2f: false,
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

  fix1In: async (userDiscordId: bigint, dateTime: Date, userName: string) => {
    const user = await userRepository.findUserByDiscordId(userDiscordId);
    if (!user) {
      const newUser = await userRepository.createUser({
        userName: userName,
        userDiscordId: userDiscordId,
      });
      return await dailyRecordsRepository.createDailyRecord({
        userId: newUser.user_id,
        checkIn: dateTime,
        is_4f: false,
        is_1f: true,
        is_2f: false,
      });
    }

    const latestRecord =
      await dailyRecordsRepository.findDailyRecordsLatestByUserDiscordId(
        userDiscordId,
      );

    //レコードが存在しない=チェックインが完了していない場合
    if (!latestRecord) {
      await officeAccessUseCase.checkIn1f(userDiscordId, dateTime, userName);
      return;
    }
    //latestrecordのチェックアウトが完了している、つまり入室していない場合もチェックインを行う
    if (latestRecord?.check_out) {
      await officeAccessUseCase.checkIn1f(userDiscordId, dateTime, userName);
    }
    //それ以外=入室中ならチェックイン時間を更新
    else {
      await dailyRecordsRepository.updateDailyRecord(latestRecord.id, {
        checkIn: dateTime,
        is_1f: true,
        is_2f: false,
      });
    }
  },
    fix2In: async (userDiscordId: bigint, dateTime: Date, userName: string) => {
    const user = await userRepository.findUserByDiscordId(userDiscordId);
    if (!user) {
      const newUser = await userRepository.createUser({
        userName: userName,
        userDiscordId: userDiscordId,
      });
      return await dailyRecordsRepository.createDailyRecord({
        userId: newUser.user_id,
        checkIn: dateTime,
        is_4f: false,
        is_1f: false,
        is_2f: true,
      });
    }

    const latestRecord =
      await dailyRecordsRepository.findDailyRecordsLatestByUserDiscordId(
        userDiscordId,
      );

    //レコードが存在しない=チェックインが完了していない場合
    if (!latestRecord) {
      await officeAccessUseCase.checkIn1f(userDiscordId, dateTime, userName);
      return;
    }
    //latestrecordのチェックアウトが完了している、つまり入室していない場合もチェックインを行う
    if (latestRecord?.check_out) {
      await officeAccessUseCase.checkIn1f(userDiscordId, dateTime, userName);
    }
    //それ以外=入室中ならチェックイン時間を更新
    else {
      await dailyRecordsRepository.updateDailyRecord(latestRecord.id, {
        checkIn: dateTime,
        is_1f: false,
        is_2f: true,
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
    const uncheckedOutRecordsInOffice =
      await dailyRecordsRepository.findAllUncheckedOutRecordsInOffice();
    const uncheckedOutRecordsIn1f =
      await dailyRecordsRepository.findAllUncheckedOutRecordsIn1f();
    const uncheckedOutRecordsIn2f =
      await dailyRecordsRepository.findAllUncheckedOutRecordsIn2f();
    return {
      lenOffice: uncheckedOutRecordsInOffice.length,
      len1f: uncheckedOutRecordsIn1f.length,
      len2f: uncheckedOutRecordsIn2f.length,
    };
  },
  show: async (): Promise<{
    officeUsers: Array<{ userName: string; checkIn: Date }>;
    usersIn1f: Array<{ userName: string; checkIn: Date }>;
    usersIn2f: Array<{ userName: string; checkIn: Date }>;
  }> => {
    // 未チェックアウトレコードを取得
    const uncheckedOutRecordsInOffice =
      await dailyRecordsRepository.findAllUncheckedOutRecordsInOffice();

    const uncheckedOutRecordsIn1f =
      await dailyRecordsRepository.findAllUncheckedOutRecordsIn1f();

    const uncheckedOutRecordsIn2f =
      await dailyRecordsRepository.findAllUncheckedOutRecordsIn2f();

    const officeUsers = uncheckedOutRecordsInOffice.map(async (record) => {
      const user = await userRepository.findUserById(record.user_id);
      return { userName: user?.user_name, checkIn: record.check_in };
    });

    const usersIn1f = uncheckedOutRecordsIn1f.map(async (record) => {
      const user = await userRepository.findUserById(record.user_id);
      return { userName: user?.user_name, checkIn: record.check_in };
    });

    const usersIn2f = uncheckedOutRecordsIn2f.map(async (record) => {
      const user = await userRepository.findUserById(record.user_id);
      return { userName: user?.user_name, checkIn: record.check_in };
    });

    const [allOfficeUsers,all1fUsers,all2fUsers] = await Promise.all([Promise.all(officeUsers), Promise.all(usersIn1f),Promise.all(usersIn2f)]);

    const [validOfficeUsers, valid1fUsers,valid2fUsers] = [
      allOfficeUsers.filter(
        (user): user is { userName: string; checkIn: Date } => user !== null
      ),
      all1fUsers.filter(
        (user): user is { userName: string; checkIn: Date } => user !== null
      ),
      all2fUsers.filter(
        (user): user is { userName: string; checkIn: Date } => user !== null
      ),
    ];

    return {
      officeUsers: validOfficeUsers,
      usersIn1f: valid1fUsers,
      usersIn2f: valid2fUsers,
      };
  },
};
export default officeAccessUseCase;
