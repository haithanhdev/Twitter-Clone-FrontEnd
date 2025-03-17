import { useLocation } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  console.log(location.state);
  return (
    <>
      <h1>ResetPassword</h1>
      <form>
        <div>
          <input type="password" placeholder="New password" />
        </div>
        <div>
          <input type="password" placeholder="Confirm password" />
        </div>
        <button>Reset password</button>
      </form>
    </>
  );
}
