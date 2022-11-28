import { useRouter } from "next/router";
import React, { useState } from "react";
import Back from "../../../components/Back";
import { trpc } from "../../utils/trpc";

const NewProduct = () => {
  const [product_name, setProduct_name] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const router = useRouter();
  const utils = trpc.useContext();
  const postProduct = trpc.product.postProduct.useMutation({
    onMutate: () => {
      utils.product.getAll.cancel();
      const optimisticUpdate = utils.product.getAll.getData();

      if (optimisticUpdate) {
        utils.product.getAll.setData(undefined, optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.product.getAll.invalidate();
      router.push("/product");
    },
  });
  const disabled = !Boolean(product_name && price && stock && categoryId);

  return (
    <div className="max-w-full">
      <div className="ml-11 mr-5 mt-5">
        <Back />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            postProduct.mutate({
              name: product_name,
              stock: Number(stock),
              price: Number(price),
              categoryId: categoryId,
            });
            setProduct_name("");
            setPrice("");
            setCategoryId("");
            setStock("");
          }}
        >
          <div className="mb-6">
            <label
              htmlFor="product_name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              value={product_name}
              onChange={(e) => setProduct_name(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Category
            </label>
            <select
              name="category"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              id="category"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option defaultValue={""}>Select Category</option>
              <Categories />
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="">
            <button
              type="submit"
              disabled={disabled}
              className={`w-full  rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white sm:w-auto   
              ${
                disabled
                  ? "bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                  : "bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;

const Categories: React.FC = () => {
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();
  if (isLoading) return <option value="">Loading...</option>;
  return (
    <>
      {categories?.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </>
  );
};
