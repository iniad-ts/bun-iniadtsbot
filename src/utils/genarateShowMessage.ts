import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

dayjs.extend(timezone);

const genarateShowMessage = async () => {
  const userList = await officeAccessUseCase.show();
  let messageContent = "現在入室中のユーザー:\n";
  // ユーザーリストを文字列に整形
  userList.forEach((user, index) => {
    messageContent += `${index + 1}. ${user.userName} - ${dayjs(user.checkIn)
      .tz("Asia/Tokyo")
      .format("YYYY/MM/DD HH:mm:ss")}\n`;
  });
  messageContent += `\n最終更新日時: ${dayjs()
    .tz("Asia/Tokyo")
    .format("YYYY/MM/DD HH:mm:ss")}`;

  return messageContent;
};

export default genarateShowMessage;
