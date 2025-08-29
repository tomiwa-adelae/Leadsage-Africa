import Image from "next/image";
import React from "react";

export const UnionPayIcon = () => {
  return (
    <Image
      src={"/assets/icons/unionpay.svg"}
      alt="UnionPay icon"
      width={200}
      height={200}
      className="invert"
    />
  );
};
