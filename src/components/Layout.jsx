import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [displaySidebar, setDisplaySidebar] = useState(true);

  return (
    <div className="bg-[#0F192E]">
      <Navbar displaySidebar={displaySidebar} />

      <Sidebar
        displaySidebar={displaySidebar}
        setDisplaySidebar={setDisplaySidebar}
      />

      <div
        className={`
          h-screen ml-auto transition-all duration-300
          ${displaySidebar ? "w-[calc(100%-300px)]" : "w-[calc(100%-80px)]"}
        `}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
