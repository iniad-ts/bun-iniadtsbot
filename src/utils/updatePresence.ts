import { Client } from "discord.js";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

const updatePresence = async (client: Client) => {
  if (!client.user) {
    return;
  }
  const unCheckOutCount = await officeAccessUseCase.countUncheckedOutRecords();
  // Todo:オフィスと食堂でそれぞれのカウントを取得して、表示する
  client.user.setActivity(`入室中: ${unCheckOutCount}人`);
};

export default updatePresence;
