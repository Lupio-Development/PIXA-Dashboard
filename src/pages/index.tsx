"use client";
import { Inter } from "next/font/google";
import Login from "./login";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Registration from "./Registration";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    axios
      .get("admin/login")
      .then((res) => {
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const sessionTimeout: number = 20 * 60 * 1000;
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = useCallback(() => {
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(() => {
      axios.defaults.headers.common["Authorization"] = "";
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.href = "/";
    }, sessionTimeout);
  }, [sessionTimeout]);

  const handleActivity = () => {
    resetTimeout();
  };

  useEffect(() => {
    if (window !== undefined) {
      resetTimeout();

      // Add event listeners for user activity
      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("keydown", handleActivity);
      window.addEventListener("click", handleActivity);

      // Clean up event listeners on component unmount
      return () => {
        window.removeEventListener("mousemove", handleActivity);
        window.removeEventListener("keydown", handleActivity);
        window.removeEventListener("click", handleActivity);
        if (activityTimeoutRef.current)
          clearTimeout(activityTimeoutRef.current);
      };
    }
  }, [resetTimeout]);
  return <Login/>
  // return login ? <Login /> : <Registration />;
};

export default Home;
