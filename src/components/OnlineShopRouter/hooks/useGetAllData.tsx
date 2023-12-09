import React from "react";
import axiosClient from "../configs/axiosClient";

export default function useGetAllData(
  defaultValue: any = [],
  dataName: string = "",
  refresh: boolean = false
) {
  const [data, setData] = React.useState(defaultValue);
  React.useEffect(() => {
    const getAllData = async () => {
      try {
        const response = await axiosClient.get(`/online-shop/${dataName}`);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllData();
  }, [dataName, refresh]);

  return [data];
}
