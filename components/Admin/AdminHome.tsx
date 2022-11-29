import React from "react";
import Loading from "../Loading";
import New from "../New";
import { trpc } from "../../src/utils/trpc";
import Product from "./RowProduct";

const AdminHomeComp = () => {
  const { data: products, isLoading } = trpc.product.getAll.useQuery();

  if (isLoading) return <Loading />;
  return (
    <div className="flex flex-col">
      <New link="product/new" item="Product" />
      <div className="flex justify-center">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Product Name
              </th>
              <th scope="col" className="py-3 px-6">
                Seller
              </th>
              <th scope="col" className="py-3 px-6">
                Category
              </th>
              <th scope="col" className="py-3 px-6">
                Price
              </th>
              <th scope="col" className="py-3 px-6">
                Stock Qty
              </th>
              <th scope="col" className="border-l border-gray-400 py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <Product
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category.name}
                price={product.price}
                seller={String(product.user.email)}
                stock={product.stock}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHomeComp;
