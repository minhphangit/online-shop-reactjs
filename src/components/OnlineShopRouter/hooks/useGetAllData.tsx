import React from "react";
import axiosClient from "../configs/axiosClient";

export default function useGetAllData(
  defaultValue: any = [],
  dataName: string = "",
  refresh: boolean = false
) {
  const [data, setData] = React.useState(defaultValue);
  const token = localStorage.getItem("token");
  React.useEffect(() => {
    const getAllData = async () => {
      try {
        const response = await axiosClient.get(`/${dataName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    getAllData();
  }, [dataName, refresh]);

  return [data];
}
