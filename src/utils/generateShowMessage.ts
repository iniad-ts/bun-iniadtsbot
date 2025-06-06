import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

dayjs.extend(timezone);

const generateShowMessage = async () => {
  const { officeUsers, cafeteriaUsers } = await officeAccessUseCase.show();

  let messageContent = "オフィス内のユーザー:\n";
  officeUsers.forEach((user, index) => {
    messageContent += `${index + 1}. ${user.userName} - ${dayjs(user.checkIn)
      .tz("Asia/Tokyo")
      .format("YYYY/MM/DD HH:mm:ss")}\n`;
  });

  messageContent += "\n2食内のユーザー:\n";
  cafeteriaUsers.forEach((user, index) => {
    messageContent += `${index + 1}. ${user.userName} - ${dayjs(user.checkIn)
      .tz("Asia/Tokyo")
      .format("YYYY/MM/DD HH:mm:ss")}\n`;
  });

  messageContent += `\n最終更新日時: ${dayjs()
    .tz("Asia/Tokyo")
    .format("YYYY/MM/DD HH:mm:ss")}`;

  return messageContent;
};

export default generateShowMessage;
