import React from "react";
import StarIcon from "@material-ui/icons/Star";

function RatingBar({starNb, ratingNb, starPct} ) {
  return (
    <li className="flex items-center">
      <strong className="mr-2">{starNb}</strong>
      <StarIcon style={{ fontSize: 20, color: "FFB400" }} className="mr-1" />
      ({ratingNb})
      <div className="shadow w-full bg-gray-400 mt-2 rounded-full ml-2 h-3">
        <div
          className="bg-orange-400 text-xs leading-none h-full text-center rounded-full"
          style={{ width: Number.isInteger(starPct) ? starPct+'%' : "0%" }}
        >
          
        </div>
      </div>
    </li>
  );
}

export default RatingBar;
