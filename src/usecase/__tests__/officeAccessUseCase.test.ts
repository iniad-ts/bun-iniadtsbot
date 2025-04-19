import { beforeEach, describe, expect, it, vi } from "vitest";
import dailyRecordsRepository from "../../repo/dailyRecordRepo";
import userRepository from "../../repo/userRepo";
import officeAccessUseCase from "../officeAccessUseCase";

vi.mock("../../repo/dailyRecordRepo");
vi.mock("../../repo/userRepo");

describe("officeAccessUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkIn", () => {
    it("新規ユーザーのチェックインが正常に動作すること", async () => {
      const userDiscordId = BigInt("123456789");
      const dateTime = new Date();
      const userName = "testUser";

      vi.mocked(userRepository.findUserByDiscordId).mockResolvedValue(null);
      vi.mocked(userRepository.createUser).mockResolvedValue({
        user_id: 1,
        user_name: userName,
        user_discord_id: userDiscordId,
        user_github_id: null,
      });
      vi.mocked(dailyRecordsRepository.createDailyRecord).mockResolvedValue({
        id: 1,
        user_id: 1,
        check_in: dateTime,
        check_out: null,
        is_4f: false,
        is_1f: false,
        is_2f: false,
      });

      const result = await officeAccessUseCase.checkIn(userDiscordId, dateTime, userName);

      expect(userRepository.createUser).toHaveBeenCalledWith({
        userName,
        userDiscordId,
      });
      expect(dailyRecordsRepository.createDailyRecord).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("既存ユーザーのチェックインが正常に動作すること", async () => {
      const userDiscordId = BigInt("123456789");
      const dateTime = new Date();
      const userName = "testUser";

      vi.mocked(userRepository.findUserByDiscordId).mockResolvedValue({
        user_id: 1,
        user_name: userName,
        user_discord_id: userDiscordId,
        user_github_id: null,
      });
      vi.mocked(dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId).mockResolvedValue(null);
      vi.mocked(dailyRecordsRepository.createDailyRecord).mockResolvedValue({
        id: 1,
        user_id: 1,
        check_in: dateTime,
        check_out: null,
        is_4f: false,
        is_1f: false,
        is_2f: false,
      });

      const result = await officeAccessUseCase.checkIn(userDiscordId, dateTime, userName);

      expect(dailyRecordsRepository.createDailyRecord).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("既にチェックインしているユーザーがエラーになること", async () => {
      const userDiscordId = BigInt("123456789");
      const dateTime = new Date();
      const userName = "testUser";

      vi.mocked(userRepository.findUserByDiscordId).mockResolvedValue({
        user_id: 1,
        user_name: userName,
        user_discord_id: userDiscordId,
        user_github_id: null,
      });
      vi.mocked(dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId).mockResolvedValue({
        id: 1,
        user_id: 1,
        check_in: new Date(),
        check_out: null,
        is_4f: false,
        is_1f: false,
        is_2f: false,
      });

      await expect(officeAccessUseCase.checkIn(userDiscordId, dateTime, userName)).rejects.toThrow(
        "すでに入室済みです。"
      );
    });
  });

  describe("checkOut", () => {
    it("チェックアウトが正常に動作すること", async () => {
      const userDiscordId = BigInt("123456789");
      const dateTime = new Date();

      vi.mocked(dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId).mockResolvedValue({
        id: 1,
        user_id: 1,
        check_in: new Date(),
        check_out: null,
        is_4f: false,
        is_1f: false,
        is_2f: false,
      });
      vi.mocked(dailyRecordsRepository.updateDailyRecord).mockResolvedValue({
        id: 1,
        user_id: 1,
        check_in: new Date(),
        check_out: dateTime,
        is_4f: false,
        is_1f: false,
        is_2f: false,
      });

      const result = await officeAccessUseCase.checkOut(userDiscordId, dateTime);

      expect(dailyRecordsRepository.updateDailyRecord).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("チェックイン記録がない場合にエラーになること", async () => {
      const userDiscordId = BigInt("123456789");
      const dateTime = new Date();

      vi.mocked(dailyRecordsRepository.findUncheckedOutRecordsByUserDiscordId).mockResolvedValue(null);

      await expect(officeAccessUseCase.checkOut(userDiscordId, dateTime)).rejects.toThrow(
        "入室記録が見つかりませんでした。"
      );
    });
  });

  describe("show", () => {
    it("現在入室中のユーザー一覧を取得できること", async () => {
      const mockOfficeRecords = [
        {
          id: 1,
          user_id: 1,
          check_in: new Date(),
          check_out: null,
          is_4f: false,
          is_1f: false,
          is_2f: false,
        },
      ];

      const mock1fRecords = [
        {
          id: 2,
          user_id: 2,
          check_in: new Date(),
          check_out: null,
          is_4f: false,
          is_1f: true,
          is_2f: false,
        },
      ];

      const mock2fRecords = [
        {
          id: 3,
          user_id: 3,
          check_in: new Date(),
          check_out: null,
          is_4f: false,
          is_1f: false,
          is_2f: true,
        },
      ];

      const mockOfficeUser = {
        user_id: 1,
        user_name: "officeUser",
        user_discord_id: BigInt("123456789"),
        user_github_id: null,
      };

      const mock1fUser = {
        user_id: 2,
        user_name: "1fUser",
        user_discord_id: BigInt("987654321"),
        user_github_id: null,
      };

      const mock2fUser = {
        user_id: 3,
        user_name: "2fUser",
        user_discord_id: BigInt("111111111"),
        user_github_id: null,
      };

      vi.mocked(dailyRecordsRepository.findAllUncheckedOutRecordsInOffice).mockResolvedValue(mockOfficeRecords);
      vi.mocked(dailyRecordsRepository.findAllUncheckedOutRecordsIn1f).mockResolvedValue(mock1fRecords);
      vi.mocked(dailyRecordsRepository.findAllUncheckedOutRecordsIn2f).mockResolvedValue(mock2fRecords);

      // userRepositoryのモック設定を条件付きにする
      vi.mocked(userRepository.findUserById).mockImplementation(async (userId) => {
        if (userId === 1) return mockOfficeUser;
        if (userId === 2) return mock1fUser;
        if (userId === 3) return mock2fUser;
        return null;
      });

      const result = await officeAccessUseCase.show();

      // 返り値がオブジェクト構造になっていることを確認
      expect(result).toHaveProperty('officeUsers');
      expect(result).toHaveProperty('usersIn1f');
      expect(result).toHaveProperty('usersIn2f');

      // オフィスユーザーの検証
      expect(result.officeUsers).toHaveLength(1);
      expect(result.officeUsers[0].userName).toBe(mockOfficeUser.user_name);
      expect(result.officeUsers[0].checkIn).toBeDefined();

      // 1食ユーザーの検証
      expect(result.usersIn1f).toHaveLength(1);
      expect(result.usersIn1f[0].userName).toBe(mock1fUser.user_name);
      expect(result.usersIn1f[0].checkIn).toBeDefined();
      // 2食ユーザーの検証
      expect(result.usersIn2f).toHaveLength(1);
      expect(result.usersIn2f[0].userName).toBe(mock2fUser.user_name);
      expect(result.usersIn2f[0]).toBeDefined();
    });
  });
});
