import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[4.5rem] md:pt-[4rem]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
