import { useEffect, useState } from "react";
import useQueryParams from "./useQueryParams";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyForgotPasswordToken() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useQueryParams();
  useEffect(() => {
    const controller = new AbortController();

    if (token) {
      axios
        .post(
          `/users/verify-forgot-password`, //URL xac thuc forgot password token
          { forgot_password_token: token },
          {
            baseURL: import.meta.env.VITE_API_URL,
            signal: controller.signal,
          }
        )
        .then(() => {
          //Bên trang reset password cần forgot password token để gửi lên API
          //Có 2 cách
          //Cách 1: Sử dụng state của react Router
          //Cách 2: Lưu vào local storage và bên trang reset chỉ cần get ra là dùng được (dễ)
          navigate("/reset-password", {
            state: { forgot_password_token: token },
          });
        })
        .catch((err) => {
          setMessage(err.response.data.message);
        });
    }
    return () => {
      controller.abort();
    };
  }, [token, navigate]);
  return <div>{message}</div>;
}
