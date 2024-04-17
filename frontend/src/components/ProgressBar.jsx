import React from "react";

function ProgressBar({ amount, total }) {
  let progress = 0;
  if ((amount != null || amount != "") && Number(amount) > 0) {
    progress = (Number(amount) / Number(total)) * 100;
  } else {
    progress = 0;
  }
  return (
    <div className="bg-gray-200 h-3 rounded-md overflow-hidden pb-1">
      <div
        className="bg-green-500 h-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
