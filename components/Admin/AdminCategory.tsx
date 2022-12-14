import React from "react";
import Loading from "../Loading";
import Category from "./RowCategory";
import New from "../New";
import { trpc } from "../../src/utils/trpc";

const AdminCategoryComp = () => {
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();

  if (isLoading) return <Loading />;
  return (
    <div className="flex flex-col">
      <New link="c/new" item="Category" />
      <div className="flex justify-center">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Category Name
              </th>
              <th scope="col" className="py-3 px-6">
                Product count
              </th>
              <th scope="col" className="border-l border-gray-400 py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <Category
                key={category.id}
                id={category.id}
                name={category.name}
                count={category.product.length}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoryComp;
