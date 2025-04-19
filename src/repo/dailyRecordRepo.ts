import prisma from "../utils/prismaClient";

const dailyRecordsRepository = {
  createDailyRecord: async (recordData: {
    userId: number;
    checkIn: Date;
    checkOut?: Date;
    is_4f: boolean;
    is_1f: boolean;
    is_2f: boolean;
  }) => {
    return await prisma.daily_records.create({
      data: {
        user_id: recordData.userId,
        check_in: recordData.checkIn,
        check_out: recordData.checkOut,
        is_4f: recordData.is_4f,
        is_1f: recordData.is_1f,
        is_2f: recordData.is_2f,
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
      is_1f?: boolean;
      is_2f?: boolean;
    },
  ) => {
    return await prisma.daily_records.update({
      where: {
        id: recordId,
      },
      data: {
        check_in: updateData.checkIn,
        check_out: updateData.checkOut,
        is_4f: updateData.is_4f,
        is_1f: updateData.is_1f,
        is_2f: updateData.is_2f,
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

  findAllOfficeDailyRecords: async () => {
    return await prisma.daily_records.findMany({
      where: {
        is_1f:false,
        is_2f:false // 現状はofficeの滞在時間だけを記録する
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
        is_1f: false,
        is_2f: false,
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
        is_1f: false,
        is_2f: false,
      },
    });
  },
  findAllUncheckedOutRecordsIn1f: async () => {
    return await prisma.daily_records.findMany({
      where: {
        check_out: null,
        is_1f: true,
        is_2f: false,
      },
    });
  },
  findAllUncheckedOutRecordsIn2f: async () => {
    return await prisma.daily_records.findMany({
      where: {
        check_out: null,
        is_1f: false,
        is_2f: true,
      },
    });
},
}

export default dailyRecordsRepository;
