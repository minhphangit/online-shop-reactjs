import React from "react";
import axiosClient from "../configs/axiosClient";

export default function useDeleteData(dataName: string) {
  const [errorDelete, setErrorDelete] = React.useState("");

  const deleteData = async (id: number) => {
    try {
      const response = await axiosClient.delete(
        "/online-shop/" + dataName + "/" + id,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      setErrorDelete("");
      return true;
    } catch (error: any) {
      setErrorDelete(error.message);
      return false;
    }
  };
  return { errorDelete, deleteData };
}
