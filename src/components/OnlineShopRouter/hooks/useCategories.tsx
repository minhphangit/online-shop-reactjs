import React from "react";
import axiosClient from "../configs/axiosClient";

export default function useCategories(
  defaultValue: any = [],
  refresh: boolean = false
) {
  const [categories, setCategories] = React.useState(defaultValue);

  React.useEffect(() => {
    getAllCategories();
  }, [refresh]);
  const getAllCategories = async () => {
    try {
      const response = await axiosClient.get("/categories");
      setCategories(response.data.payload);
    } catch (error) {
      console.log(error);
    }
  };
  return [categories];
}
