"use client";

import { checkAuth } from "@/app/_actions/checkAuth";
import { useEffect } from "react";

function CheckAuth() {
  useEffect(() => {
    const checkAuthAction = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error(error);
      }
    };
    checkAuthAction();
  }, []);

  return <div>CheckAuth</div>;
}
export default CheckAuth;
