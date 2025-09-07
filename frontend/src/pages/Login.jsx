import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("/login", { email, password });
      const resData = response.data;

      if (resData.error) {
        toast.error(resData.error);
        return;
      }

      if (resData.authToken) {
        localStorage.setItem("token", resData.authToken);
      }
      navigate("/dashboard");

      setData({ email: "", password: "" });
      toast.success("Login Successful!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="login-box">
      <form onSubmit={loginUser}>
        <label>Email</label>
        <input
          type="email"
          placeholder="enter email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="enter password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
