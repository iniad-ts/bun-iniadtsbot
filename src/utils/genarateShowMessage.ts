import dayjs from "dayjs";
import officeAccessUseCase from "../usecase/officeAccessUseCase";

const genarateShowMessage = async () => {
  const userList = await officeAccessUseCase.show();
  let messageContent = "現在入室中のユーザー:\n";
  // ユーザーリストを文字列に整形
  userList.forEach((user, index) => {
    messageContent += `${index + 1}. ${user.userName} - ${dayjs(
      user.checkIn,
    ).format("YYYY/MM/DD HH:mm:ss")}\n`;
  });
  messageContent += `\n最終更新日時: ${dayjs().format("YYYY/MM/DD HH:mm:ss")}`;

  return messageContent;
};

export default genarateShowMessage;
