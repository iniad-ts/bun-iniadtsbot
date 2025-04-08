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
      });
      vi.mocked(dailyRecordsRepository.updateDailyRecord).mockResolvedValue({
        id: 1,
        user_id: 1,
        check_in: new Date(),
        check_out: dateTime,
        is_4f: false,
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
      const mockRecords = [
        {
          id: 1,
          user_id: 1,
          check_in: new Date(),
          check_out: null,
          is_4f: false,
        },
      ];

      const mockUser = {
        user_id: 1,
        user_name: "testUser",
        user_discord_id: BigInt("123456789"),
        user_github_id: null,
      };

      vi.mocked(dailyRecordsRepository.findAllUncheckedOutRecordsInOffice).mockResolvedValue(mockRecords);
      vi.mocked(userRepository.findUserById).mockResolvedValue(mockUser);

      const result = await officeAccessUseCase.show();

      expect(result).toHaveLength(1);
      expect(result[0].userName).toBe(mockUser.user_name);
      expect(result[0].checkIn).toBeDefined();
    });
  });
});
