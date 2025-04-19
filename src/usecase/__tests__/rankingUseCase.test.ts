import { beforeEach, describe, expect, it, vi } from "vitest";
import dailyRecordsRepository from "../../repo/dailyRecordRepo";
import userRepository from "../../repo/userRepo";
import { getFiscalYearStartAndEnd } from "../../utils/timeUtils";
import rankingUseCase from "../rankingUseCase";

vi.mock("../../repo/dailyRecordRepo");
vi.mock("../../repo/userRepo");

describe("rankingUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ranking", () => {
    it("指定期間のランキングを正しく取得できること", async () => {
      const from = new Date("2024-01-01");
      const until = new Date("2024-01-31");

      const mockUsers = [
        {
          user_id: 1,
          user_name: "user1",
          user_discord_id: BigInt("123456789"),
          user_github_id: null,
        },
        {
          user_id: 2,
          user_name: "user2",
          user_discord_id: BigInt("987654321"),
          user_github_id: null,
        },
      ];

      const mockRecords = [
        {
          id: 1,
          user_id: 1,
          check_in: new Date("2024-01-01T10:00:00"),
          check_out: new Date("2024-01-01T18:00:00"),
          is_4f: false,
          is_1f: false,
          is_2f: false,
        },
        {
          id: 2,
          user_id: 2,
          check_in: new Date("2024-01-01T09:00:00"),
          check_out: new Date("2024-01-01T19:00:00"),
          is_4f: false,
          is_1f: true,
          is_2f: false,
        },
      ];

      vi.mocked(userRepository.findAllUsers).mockResolvedValue(mockUsers);
      vi.mocked(dailyRecordsRepository.findDailyRecordsInDateRange).mockResolvedValue(mockRecords);

      const result = await rankingUseCase.ranking(from, until);

      expect(result).toHaveLength(2);
      expect(result[0].user.user_name).toBe("user2"); // より長い滞在時間
      expect(result[1].user.user_name).toBe("user1");
    });

    it("滞在時間が0のユーザーは除外されること", async () => {
      const from = new Date("2024-01-01");
      const until = new Date("2024-01-31");

      const mockUsers = [
        {
          user_id: 1,
          user_name: "user1",
          user_discord_id: BigInt("123456789"),
          user_github_id: null,
        },
        {
          user_id: 2,
          user_name: "user2",
          user_discord_id: BigInt("987654321"),
          user_github_id: null,
        },
      ];

      const mockRecords = [
        {
          id: 1,
          user_id: 1,
          check_in: new Date("2024-01-01T10:00:00"),
          check_out: new Date("2024-01-01T10:00:00"), // 滞在時間0
          is_4f: false,
          is_1f: false,
          is_2f: false,
        },
        {
          id: 2,
          user_id: 2,
          check_in: new Date("2024-01-01T09:00:00"),
          check_out: new Date("2024-01-01T19:00:00"),
          is_4f: false,
          is_1f: true,
          is_2f: false,
        },
      ];

      vi.mocked(userRepository.findAllUsers).mockResolvedValue(mockUsers);
      vi.mocked(dailyRecordsRepository.findDailyRecordsInDateRange).mockResolvedValue(mockRecords);

      const result = await rankingUseCase.ranking(from, until);

      expect(result).toHaveLength(1);
    });
  });

  describe("ranking_all", () => {
    it("年度内の全期間のランキングを正しく取得できること", async () => {
      // テスト用の日付をモック
      const testDate = new Date("2024-01-15");
      vi.useFakeTimers();
      vi.setSystemTime(testDate);

      const { start: fiscalYearStart, end: fiscalYearEnd } = getFiscalYearStartAndEnd(testDate);

      const mockUsers = [
        {
          user_id: 1,
          user_name: "user1",
          user_discord_id: BigInt("123456789"),
          user_github_id: null,
        },
        {
          user_id: 2,
          user_name: "user2",
          user_discord_id: BigInt("987654321"),
          user_github_id: null,
        },
      ];

      const mockRecords = [
        {
          id: 1,
          user_id: 1,
          check_in: new Date(fiscalYearStart.getTime() + 1000 * 60 * 60), // 年度開始から1時間後
          check_out: new Date(fiscalYearStart.getTime() + 1000 * 60 * 60 * 9), // 8時間滞在
          is_4f: false,
          is_1f: false,
          is_2f: false,
        },
        {
          id: 2,
          user_id: 2,
          check_in: new Date(fiscalYearStart.getTime() + 1000 * 60 * 60), // 年度開始から1時間後
          check_out: new Date(fiscalYearStart.getTime() + 1000 * 60 * 60 * 11), // 10時間滞在
          is_4f: false,
          is_1f: true,
          is_2f: false,
        },
      ];

      vi.mocked(userRepository.findAllUsers).mockResolvedValue(mockUsers);
      vi.mocked(dailyRecordsRepository.findAllOfficeDailyRecords).mockResolvedValue(mockRecords);

      const result = await rankingUseCase.ranking_all();

      expect(result).toHaveLength(2);
      expect(result[0].user.user_name).toBe("user2"); // より長い滞在時間
      expect(result[1].user.user_name).toBe("user1");
      expect(result[0].stayTime).toBe("10:00:00");
      expect(result[1].stayTime).toBe("08:00:00");

      vi.useRealTimers();
    });
  });
});
