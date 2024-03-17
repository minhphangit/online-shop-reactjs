import React from "react";
import axiosClient from "../configs/axiosClient";
export default function useOnFinish(selected?: any) {
  const [error, setError] = React.useState("");

  const onFinish = async (values: any) => {
    try {
      if (selected) {
        // Update category
        const response = await axiosClient.patch(
          "/categories/" + selected,
          values,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
      } else {
        // Create category
        const response = await axiosClient.post("/categories", values, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
      }
      setError("");
      return true; // Thêm dòng này để trả về true khi thêm thành công
    } catch (error: any) {
      setError(error.message);
      return false; // Trả về false nếu có lỗi xảy ra
    }
  };

  return { error, onFinish };
}
