import React from "react";
//form hook
import { SubmitHandler, useForm } from "react-hook-form";
//yup
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
//axios
import axiosClient from "../configs/axiosClient";
type Props = {};

interface IFormInput {
  username: string;
  password: string;
}
const shema = yup.object({
  username: yup.string().email().required(),
  password: yup.string().required().min(3).max(20),
});
export default function LoginWithAxios({}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(shema),
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response: any = await axiosClient.post("/auth/login", data);

      if (response.data.loggedInUser) {
        alert("Login successful");
        localStorage.setItem("access_token", response.data.access_token);
      } else {
        alert("Username or password incorrect");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        alert("Login failed 401");
      }
    }
  };
  return (
    <div>
      <form onClick={handleSubmit(onSubmit)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 320,
            gap: 12,
          }}
        >
          <div>
            <label htmlFor="username">Username</label>
            <input
              {...register("username")}
              className="form-control"
              id="username"
            />
            <span className="text-danger">{errors.username?.message}</span>
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              type="password"
              {...register("password")}
              className="form-control"
              id="password"
            />
            <span className="text-danger">{errors.password?.message}</span>
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
