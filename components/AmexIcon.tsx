import Image from "next/image";
import React from "react";

export const AmexIcon = () => {
  return (
    <Image
      src={"/assets/icons/amex.svg"}
      alt="Amex icon"
      width={200}
      height={200}
      className="invert"
    />
  );
};
