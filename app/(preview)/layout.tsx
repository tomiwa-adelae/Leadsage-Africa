import React, { ReactNode } from "react";
import { Header } from "../(root)/_components/Header";
import { Footer } from "../(root)/_components/Footer";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Header />
      <div className="py-20 relative">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
