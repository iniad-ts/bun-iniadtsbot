import prisma from "../utils/prismaClient";

const dailyRecordsRepository = {
  createDailyRecord: async (recordData: {
    userId: number;
    checkIn: Date;
    checkOut?: Date;
    is4f: boolean;
  }) => {
    return await prisma.daily_records.create({
      data: {
        user_id: recordData.userId,
        check_in: recordData.checkIn,
        check_out: recordData.checkOut,
        is_4f: recordData.is4f,
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
      is4f?: boolean;
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

  findAllDailyRecords: async () => {
    return await prisma.daily_records.findMany();
  },

  findDailyRecordsInDateRange: async (startDate: Date, endDate: Date) => {
    return await prisma.daily_records.findMany({
      where: {
        check_in: {
          gte: startDate,
          lt: endDate,
        },
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
  findAllUncheckedOutRecords: async () => {
    return await prisma.daily_records.findMany({
      where: {
        check_out: null,
      },
    });
  },
};

export default dailyRecordsRepository;
