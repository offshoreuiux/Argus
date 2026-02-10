import React from "react";
import UploadCircle from "../../assets/images/upload-circle.gif";
import UploadIcon from "../../assets/images/svg/icons/UploadIcon";

const UploadProgressCard = ({ progress = 0 }) => {
  return (
    <div
      className="rounded-lg bg-[#EDFFFD] p-4 flex items-center"
      style={{ boxShadow: "0 0 4px 0 #2FC0B299" }}
    >
      <div className="w-25 h-25">
        <img src={UploadCircle} alt="" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          {/* small upload icon */}
          <UploadIcon />

          <p className="text-base font-bold text-[#616161]">
            Uploading Document
          </p>
        </div>

        <p className="text-[14px] text-[#616161] mt-1">
          Transferring your regulatory document to secure server...
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-[#3B3B3B]">Upload Progress</p>
          <p className="text-sm text-[#3B3B3B]">{progress}%</p>
        </div>

        <div className="w-full h-2 rounded-full bg-gray-200 mt-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadProgressCard;
