import React from "react";
import { CategoryCard } from "./CategoryCard";
import { getCategories } from "@/app/data/landlord/get-categories";

export const Categories = async () => {
  const categories = await getCategories();
  return (
    <div className="container pt-16 pb-10">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            icon={category.icon}
          />
        ))}
      </div>
    </div>
  );
};
