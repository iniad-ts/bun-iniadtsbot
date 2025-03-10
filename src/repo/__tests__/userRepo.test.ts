import { beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../utils/prismaClient";
import userRepository from "../userRepo";

// Prismaのモック
vi.mock("../../utils/prismaClient", () => ({
  default: {
    users: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("userRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const userData = {
        userName: "testUser",
        userDiscordId: BigInt("123456789"),
        userGithubId: "testGithub",
      };

      const expectedResult = {
        user_id: 1,
        user_name: userData.userName,
        user_discord_id: userData.userDiscordId,
        user_github_id: userData.userGithubId,
      };

      vi.mocked(prisma.users.create).mockResolvedValue(expectedResult);

      const result = await userRepository.createUser(userData);

      expect(prisma.users.create).toHaveBeenCalledWith({
        data: {
          user_name: userData.userName,
          user_discord_id: userData.userDiscordId,
          user_github_id: userData.userGithubId,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findUserByDiscordId", () => {
    it("should find user by discord id", async () => {
      const userData = {
        user_id: 1,
        user_name: "testUser",
        user_discord_id: BigInt("123456789"),
        user_github_id: null,
      };

      vi.mocked(prisma.users.findFirst).mockResolvedValue(userData);

      const user = await userRepository.findUserByDiscordId(userData.user_discord_id);

      expect(prisma.users.findFirst).toHaveBeenCalledWith({
        where: { user_discord_id: userData.user_discord_id },
      });
      expect(user).toEqual(userData);
    });

    it("should return null when user not found", async () => {
      vi.mocked(prisma.users.findFirst).mockResolvedValue(null);

      const user = await userRepository.findUserByDiscordId(BigInt("999999999"));

      expect(prisma.users.findFirst).toHaveBeenCalledWith({
        where: { user_discord_id: BigInt("999999999") },
      });
      expect(user).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const userId = 1;
      const updateData = {
        userName: "updatedUser",
        userDiscordId: BigInt("987654321"),
        userGithubId: "updatedGithub",
      };

      const expectedResult = {
        user_id: userId,
        user_name: updateData.userName,
        user_discord_id: updateData.userDiscordId,
        user_github_id: updateData.userGithubId,
      };

      vi.mocked(prisma.users.update).mockResolvedValue(expectedResult);

      const result = await userRepository.updateUser(userId, updateData);

      expect(prisma.users.update).toHaveBeenCalledWith({
        where: { user_id: userId },
        data: {
          user_name: updateData.userName,
          user_discord_id: updateData.userDiscordId,
          user_github_id: updateData.userGithubId,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe("findUserById", () => {
    it("should find user by id", async () => {
      const userId = 1;
      const expectedUser = {
        user_id: userId,
        user_name: "testUser",
        user_discord_id: BigInt("123456789"),
        user_github_id: null,
      };

      vi.mocked(prisma.users.findUnique).mockResolvedValue(expectedUser);

      const user = await userRepository.findUserById(userId);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
      expect(user).toEqual(expectedUser);
    });

    it("should return null when user not found", async () => {
      vi.mocked(prisma.users.findUnique).mockResolvedValue(null);

      const user = await userRepository.findUserById(999);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { user_id: 999 },
      });
      expect(user).toBeNull();
    });
  });

  describe("findAllUsers", () => {
    it("should find all users", async () => {
      const expectedUsers = [
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
          user_github_id: "github2",
        },
      ];

      vi.mocked(prisma.users.findMany).mockResolvedValue(expectedUsers);

      const users = await userRepository.findAllUsers();

      expect(prisma.users.findMany).toHaveBeenCalled();
      expect(users).toEqual(expectedUsers);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const userId = 1;
      const expectedResult = {
        user_id: userId,
        user_name: "deletedUser",
        user_discord_id: BigInt("123456789"),
        user_github_id: null,
      };

      vi.mocked(prisma.users.delete).mockResolvedValue(expectedResult);

      const result = await userRepository.deleteUser(userId);

      expect(prisma.users.delete).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
