import React from "react";
import axiosClient from "../configs/axiosClient";

export default function useUpdateData(dataName: string) {
  const [errorUpdate, setErrorUpdate] = React.useState("");

  const updateData = async (values: any, selected: any) => {
    try {
      const response = await axiosClient.patch(
        "/online-shop/" + dataName + "/" + selected,
        values,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      setErrorUpdate("");
      return true; // Thêm dòng này để trả về true khi thêm thành công
    } catch (error: any) {
      setErrorUpdate(error.message);
      return false; // Trả về false nếu có lỗi xảy ra
    }
  };
  return { errorUpdate, updateData };
}
