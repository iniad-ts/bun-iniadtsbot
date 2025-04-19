import { Client } from "discord.js";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

const updatePresence = async (client: Client) => {
  if (!client.user) {
    return;
  }
 const { lenOffice: lenOffice, len1f: len1f, len2f:len2f  } = await officeAccessUseCase.countUncheckedOutRecords();
client.user.setActivity(`オフィス${lenOffice}人,1食${len1f}人, 2食${len2f}人`);
};

export default updatePresence;
