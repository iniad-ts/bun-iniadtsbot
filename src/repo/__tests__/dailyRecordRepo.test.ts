import { beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../utils/prismaClient";
import dailyRecordsRepository from "../dailyRecordRepo";

// Prismaのモック
vi.mock("../../utils/prismaClient", () => ({
  default: {
    daily_records: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    users: {
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe("dailyRecordsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createDailyRecord", () => {
    it("should create a daily record", async () => {
      const recordData = {
        userId: 1,
        checkIn: new Date(),
        is_4f: true,
        isCafeteria: false,
      };

      const expectedResult = {
        id: 1,
        user_id: recordData.userId,
        check_in: recordData.checkIn,
        check_out: null,
        is_4f: recordData.is_4f,
        isCafeteria: recordData.isCafeteria,
      };

      vi.mocked(prisma.daily_records.create).mockResolvedValue(expectedResult);

      const result = await dailyRecordsRepository.createDailyRecord(recordData);

      expect(prisma.daily_records.create).toHaveBeenCalledWith({
        data: {
          user_id: recordData.userId,
          check_in: recordData.checkIn,
          check_out: undefined,
          is_4f: recordData.is_4f,
          isCafeteria: recordData.isCafeteria,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findDailyRecordsByUserId", () => {
    it("should find daily records by user id", async () => {
      const userId = 1;
      const checkIn = new Date();
      const expectedRecords = [{
        id: 1,
        user_id: userId,
        check_in: checkIn,
        check_out: null,
        is_4f: true,
        isCafeteria: false,
      }];

      vi.mocked(prisma.daily_records.findMany).mockResolvedValue(expectedRecords);

      const records = await dailyRecordsRepository.findDailyRecordsByUserId(userId);

      expect(prisma.daily_records.findMany).toHaveBeenCalledWith({
        where: {
          user_id: userId,
        },
      });
      expect(records).toEqual(expectedRecords);
    });
  });

  describe("updateDailyRecord", () => {
    it("should update a daily record", async () => {
      const recordId = 1;
      const updateData = {
        checkIn: new Date(),
        checkOut: new Date(),
        is_4f: false,
        isCafeteria: true,
      };

      const expectedResult = {
        id: recordId,
        user_id: 1,
        check_in: updateData.checkIn,
        check_out: updateData.checkOut,
        is_4f: updateData.is_4f,
        isCafeteria: updateData.isCafeteria,
      };

      vi.mocked(prisma.daily_records.update).mockResolvedValue(expectedResult);

      const result = await dailyRecordsRepository.updateDailyRecord(recordId, updateData);

      expect(prisma.daily_records.update).toHaveBeenCalledWith({
        where: { id: recordId },
        data: {
          check_in: updateData.checkIn,
          check_out: updateData.checkOut,
          is_4f: updateData.is_4f,
          isCafeteria: updateData.isCafeteria,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe("deleteDailyRecord", () => {
    it("should delete a daily record", async () => {
      const recordId = 1;
      const expectedResult = { id: recordId, user_id: 1, check_in: new Date(), check_out: null, is_4f: true, isCafeteria: false };

      vi.mocked(prisma.daily_records.delete).mockResolvedValue(expectedResult);

      const result = await dailyRecordsRepository.deleteDailyRecord(recordId);

      expect(prisma.daily_records.delete).toHaveBeenCalledWith({
        where: { id: recordId },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findAllDailyRecords", () => {
    it("should find all daily records", async () => {
      const expectedRecords = [
        { id: 1, user_id: 1, check_in: new Date(), check_out: null, is_4f: true , isCafeteria: false },
        { id: 2, user_id: 2, check_in: new Date(), check_out: new Date(), is_4f: false , isCafeteria: true },
      ];

      vi.mocked(prisma.daily_records.findMany).mockResolvedValue(expectedRecords);

      const records = await dailyRecordsRepository.findAllDailyRecords();

      expect(prisma.daily_records.findMany).toHaveBeenCalled();
      expect(records).toEqual(expectedRecords);
    });
  });

  describe("findDailyRecordsInDateRange", () => {
    it("should find records in date range", async () => {
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-31");
      const expectedRecords = [
        { id: 1, user_id: 1, check_in: new Date("2024-01-15"), check_out: null, is_4f: true,isCafeteria: false },
        { id: 2, user_id: 2, check_in: new Date("2024-01-20"), check_out: new Date("2024-01-25"), is_4f: false,isCafeteria: true },
      ];

      vi.mocked(prisma.daily_records.findMany).mockResolvedValue(expectedRecords);

      const records = await dailyRecordsRepository.findDailyRecordsInDateRange(startDate, endDate);

      expect(prisma.daily_records.findMany).toHaveBeenCalledWith({
        where: {
          check_in: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      expect(records).toEqual(expectedRecords);
    });
  });

  describe("findDailyRecordsByUserDiscordId", () => {
    it("should find records by discord id when user exists", async () => {
      const userDiscordId = BigInt("123456789");
      const user = { user_id: 1, user_discord_id: userDiscordId, user_name: "test", user_github_id: null };
      const expectedRecords = [
        { id: 1, user_id: 1, check_in: new Date(), check_out: null, is_4f: true,isCafeteria: false },
      ];

      vi.mocked(prisma.users.findFirst).mockResolvedValue(user);
      vi.mocked(prisma.daily_records.findMany).mockResolvedValue(expectedRecords);

      const records = await dailyRecordsRepository.findDailyRecordsByUserDiscordId(userDiscordId);

      expect(records).toEqual(expectedRecords);
    });

    it("should return null when user not found", async () => {
      vi.mocked(prisma.users.findFirst).mockResolvedValue(null);

      const records = await dailyRecordsRepository.findDailyRecordsByUserDiscordId(BigInt("999999999"));

      expect(records).toBeNull();
    });
  });

  describe("findUncheckedOutRecordsByUserDiscordId", () => {
    it("should find unchecked out record when user exists", async () => {
      const userDiscordId = BigInt("123456789");
      const user = { user_id: 1, user_discord_id: userDiscordId, user_name: "test", user_github_id: null };
      const expectedRecord = { id: 1, user_id: 1, check_in: new Date(), check_out: null, is_4f: true,isCafeteria: false };

      vi.mocked(prisma.users.findFirst).mockResolvedValue(user);
      vi.mocked(prisma.daily_records.findFirst).mockResolvedValue(expectedRecord);

      const record = await dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId(userDiscordId);

      expect(record).toEqual(expectedRecord);
    });

    it("should return null when user not found", async () => {
      vi.mocked(prisma.users.findFirst).mockResolvedValue(null);

      const record = await dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId(BigInt("999999999"));

      expect(record).toBeNull();
    });
  });

  describe("findDailyRecordsLatestByUserDiscordId", () => {
    it("should find latest record when user exists", async () => {
      const userDiscordId = BigInt("123456789");
      const user = { user_id: 1, user_discord_id: userDiscordId, user_name: "test", user_github_id: null };
      const expectedRecord = { id: 1, user_id: 1, check_in: new Date(), check_out: new Date(), is_4f: true,isCafeteria: false };

      vi.mocked(prisma.users.findFirst).mockResolvedValue(user);
      vi.mocked(prisma.daily_records.findFirst).mockResolvedValue(expectedRecord);

      const record = await dailyRecordsRepository.findDailyRecordsLatestByUserDiscordId(userDiscordId);

      expect(prisma.daily_records.findFirst).toHaveBeenCalledWith({
        where: { user_id: user.user_id },
        orderBy: { check_in: "desc" },
      });
      expect(record).toEqual(expectedRecord);
    });

    it("should return null when user not found", async () => {
      vi.mocked(prisma.users.findFirst).mockResolvedValue(null);

      const record = await dailyRecordsRepository.findDailyRecordsLatestByUserDiscordId(BigInt("999999999"));

      expect(record).toBeNull();
    });
  });

  describe("findAllUncheckedOutRecordsInOffice", () => {
    it("should find all unchecked out records in office", async () => {
      const expectedRecords = [
        { id: 1, user_id: 1, check_in: new Date(), check_out: null, is_4f: true, isCafeteria: false },
        { id: 2, user_id: 2, check_in: new Date(), check_out: null, is_4f: false, isCafeteria: false },
      ];

      vi.mocked(prisma.daily_records.findMany).mockResolvedValue(expectedRecords);

      const records = await dailyRecordsRepository.findAllUncheckedOutRecordsInOffice();

      expect(prisma.daily_records.findMany).toHaveBeenCalledWith({
        where: { check_out: null, isCafeteria: false },
      });
      expect(records).toEqual(expectedRecords);
    });
  });

  describe("findAllUncheckedOutRecordsInCafeteria", () => {
    it("should find all unchecked out records in cafeteria", async () => {
      const expectedRecords = [
        { id: 3, user_id: 3, check_in: new Date(), check_out: null, is_4f: true, isCafeteria: true },
        { id: 4, user_id: 4, check_in: new Date(), check_out: null, is_4f: false, isCafeteria: true },
      ];

      vi.mocked(prisma.daily_records.findMany).mockResolvedValue(expectedRecords);

      const records = await dailyRecordsRepository.findAllUncheckedOutRecordsInCafeteria();

      expect(prisma.daily_records.findMany).toHaveBeenCalledWith({
        where: { check_out: null, isCafeteria: true },
      });
      expect(records).toEqual(expectedRecords);
    });
  });
});
