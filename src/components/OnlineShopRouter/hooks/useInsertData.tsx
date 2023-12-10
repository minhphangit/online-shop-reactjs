import React from "react";
import axiosClient from "../configs/axiosClient";
import { message } from "antd";

export default function useInsertData(dataName: string) {
  const [errorInsert, setEerorInsert] = React.useState("");
  const insertData = async (values: any) => {
    try {
      const response = await axiosClient.post(
        "/online-shop/" + dataName,
        values,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      setEerorInsert("");
      return true; // Thêm dòng này để trả về true khi thêm thành công
    } catch (error: any) {
      console.log(error);
      setEerorInsert(error.message);
      return false; // Trả về false nếu có lỗi xảy ra
    }
  };

  return { errorInsert, insertData };
}
