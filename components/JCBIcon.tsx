import Image from "next/image";
import React from "react";

export const JCBIcon = () => {
  return (
    <Image
      src={"/assets/icons/jcb.svg"}
      alt="JCB icon"
      width={200}
      height={200}
      className="invert"
    />
  );
};
