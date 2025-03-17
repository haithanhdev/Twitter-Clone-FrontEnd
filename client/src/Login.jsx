/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const newUser = params.get("new_user");
    const verify = params.get("verify");
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    navigate("/");
  }, [params, navigate]);
  return <div>Login</div>;
}
