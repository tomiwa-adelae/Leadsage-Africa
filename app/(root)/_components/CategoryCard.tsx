import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  icon: string;
  name: string;
}

export const CategoryCard = ({ icon, name }: Props) => {
  return (
    <Link
      href={`/categories/${name}`}
      className="transform-gpu space-y-2 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#1A564B2f_inset] transition-all hover:bg-muted"
    >
      <div className="text-primary w-fit transform-gpu rounded-full border p-2 [box-shadow:0_-20px_80px_-20px_#1A564B3f_inset]">
        <Image
          src={icon}
          alt={name}
          width={1000}
          height={1000}
          className="object-cover size-[20px] md:size-[30px] dark:invert"
        />
      </div>
      <h4 className="text-sm md:text-base font-medium leading-tight">{name}</h4>
    </Link>
  );
};
