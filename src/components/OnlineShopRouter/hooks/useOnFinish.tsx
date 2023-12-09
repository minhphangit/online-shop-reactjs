import React from "react";
import axiosClient from "../configs/axiosClient";
export default function useOnFinish(selected?: any) {
  const [error, setError] = React.useState("");

  const onFinish = async (values: any) => {
    try {
      if (selected) {
        // Update category
        const response = await axiosClient.patch(
          "/online-shop/categories/" + selected,
          values,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
      } else {
        // Create category
        const response = await axiosClient.post(
          "/online-shop/categories",
          values,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
      }
      setError("");
      return true; // Thêm dòng này để trả về true khi thêm thành công
    } catch (error: any) {
      setError(error.response.data.message[0]);
      return false; // Trả về false nếu có lỗi xảy ra
    }
  };

  return { error, onFinish };
}
