import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // if (!token) {
    //   console.error("No token found");
    //   setLoading(false);
    //   return;
    // }
    console.log("Token being sent:", token);
    axios
      .get("/dashboard", {
        headers: { "auth-token": token },
      })
      .then((res) => {
        console.log("Dashboard response:", res.data);
        // adjust depending on backend response
        setUser(res.data.user || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err.response?.data || err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.name}</p> : <p>User not found</p>}
    </div>
  );
}
