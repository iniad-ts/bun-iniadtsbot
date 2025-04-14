import prisma from "../utils/prismaClient";

const dailyRecordsRepository = {
  createDailyRecord: async (recordData: {
    userId: number;
    checkIn: Date;
    checkOut?: Date;
    is_4f: boolean;
    isCafeteria: boolean;
  }) => {
    return await prisma.daily_records.create({
      data: {
        user_id: recordData.userId,
        check_in: recordData.checkIn,
        check_out: recordData.checkOut,
        is_4f: recordData.is4f,
        is_cafeteria: recordData.isCafeteria,
      },
    });
  },

  findDailyRecordsByUserId: async (userId: number) => {
    return await prisma.daily_records.findMany({
      where: {
        user_id: userId,
      },
    });
  },

  updateDailyRecord: async (
    recordId: number,
    updateData: {
      checkIn?: Date;
      checkOut?: Date;
      is_4f?: boolean;
      isCafeteria?: boolean;
    },
  ) => {
    return await prisma.daily_records.update({
      where: {
        id: recordId,
      },
      data: {
        check_in: updateData.checkIn,
        check_out: updateData.checkOut,
        is_4f: updateData.is4f,
        is_cafeteria: updateData.isCafeteria,
      },
    });
  },

  deleteDailyRecord: async (recordId: number) => {
    return await prisma.daily_records.delete({
      where: {
        id: recordId,
      },
    });
  },

  findAllNonCafeteriaDailyRecords: async () => {
    return await prisma.daily_records.findMany({
      where: {
        isCafeteria: false, // 現状はofficeの滞在時間だけを記録する
      },
    });
  },

  findDailyRecordsInDateRange: async (startDate: Date, endDate: Date) => {
    return await prisma.daily_records.findMany({
      where: {
        check_in: {
          gte: startDate,
          lt: endDate,
        },
        // 現状はofficeの滞在時間だけを記録する
        isCafeteria: false,
      },
    });
  },

  findDailyRecordsByUserDiscordId: async (userDiscordId: bigint) => {
    const user = await prisma.users.findFirst({
      where: {
        user_discord_id: userDiscordId,
      },
    });

    if (user) {
      return await prisma.daily_records.findMany({
        where: {
          user_id: user.user_id,
        },
      });
    }
    return null;
  },
  findUncheckedOutRecordsByUserDiscordId: async (userDiscordId: bigint) => {
    const user = await prisma.users.findFirst({
      where: {
        user_discord_id: userDiscordId,
      },
    });

    if (user) {
      return await prisma.daily_records.findFirst({
        where: {
          user_id: user.user_id,
          check_out: null,
        },
      });
    }
    return null;
  },
  findDailyRecordsLatestByUserDiscordId: async (userDiscordId: bigint) => {
    const user = await prisma.users.findFirst({
      where: {
        user_discord_id: userDiscordId,
      },
    });

    if (user) {
      return await prisma.daily_records.findFirst({
        where: {
          user_id: user.user_id,
        },
        orderBy: {
          check_in: "desc",
        },
      });
    }
    return null;
  },
  findAllUncheckedOutRecordsInOffice: async () => {
    return await prisma.daily_records.findMany({
      where: {
        check_out: null,
        is_cafeteria: false,
      },
    });
  },
  findAllUncheckedOutRecordsInCafeteria: async () => {
    return await prisma.daily_records.findMany({
      where: {
        check_out: null,
        is_cafeteria: true,
      },
    });
  }
};

export default dailyRecordsRepository;
