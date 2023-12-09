import React from "react";
import axiosClient from "../configs/axiosClient";

export default function useGetAllData(
  defaultValue: any = [],
  dataName: string = "",
  refresh: boolean = false,
  id: number
) {
  const [data, setData] = React.useState(defaultValue);
  React.useEffect(() => {
    const getDataById = async () => {
      try {
        const response = await axiosClient.get(
          `/online-shop/${dataName}/${id}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDataById();
  }, [dataName, id, refresh]);

  return [data];
}
