import { Client } from "discord.js";
import officeAccessUseCase from "../usecase/officeAccessUsecase";

const updatePresence = async (client: Client) => {
	if (!client.user) {
		return;
	}
	const unCheckOutCount = await officeAccessUseCase.countUncheckedOutRecords();
	client.user.setActivity(`入室中: ${unCheckOutCount}人`);
};

export default updatePresence;
