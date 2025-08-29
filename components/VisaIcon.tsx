import Image from "next/image";
import React from "react";

export const VisaIcon = () => {
  return (
    <Image
      src={"/assets/icons/visa.svg"}
      alt="Visa icon"
      width={200}
      height={200}
      className="invert"
    />
  );
};
