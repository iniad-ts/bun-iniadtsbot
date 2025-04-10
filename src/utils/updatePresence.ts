import { Client } from "discord.js";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

const updatePresence = async (client: Client) => {
  if (!client.user) {
    return;
  }
 const { office: officeCount, cafeteria: cafeteriaCount } = await officeAccessUseCase.countUncheckedOutRecords();
client.user.setActivity(`入室中: オフィス${officeCount}人, 2食${cafeteriaCount}人`);
};

export default updatePresence;
