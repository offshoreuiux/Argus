import React from "react";
import NotificationIcon from "../assets/images/svg/notification.svg";
import ProfileIcon from "../assets/images/svg/profile.svg";
import Divider from "./common/Divider";

function Navbar({ displaySidebar }) {
  return (
    <div
      className={`bg-[#0F192E] h-19 ml-auto p-6 sticky top-0 ${displaySidebar ? "w-[calc(100%-300px)]" : "w-[calc(100%-80px)]"}`}
    >
      <div className="flex items-center gap-4 justify-end">
        <img src={NotificationIcon} alt="notification" />
        <Divider />
        <div className="flex items-center justify-center gap-2">
          <img src={ProfileIcon} alt="notification" />
          <span className="text-white text-[14px]">Admin User</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
