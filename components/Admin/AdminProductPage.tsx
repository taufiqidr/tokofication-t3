import { useRouter } from "next/router";
import { type Category, type User } from "@prisma/client";
import React, { useState } from "react";
import Back from "../Back";
import { trpc } from "../../src/utils/trpc";
interface Props {
  data:
    | {
        user: User;
        id: string;
        name: string;
        category: Category;
        price: number;
        stock: number;
      }
    | null
    | undefined;
}
const AdminProductPageComp = ({ data }: Props) => {
  const [product_name, setProduct_name] = useState(data?.name);
  const [categoryId, setCategoryId] = useState(data?.category.id);
  const [price, setPrice] = useState(String(data?.price));
  const [stock, setStock] = useState(String(data?.stock));
  const [modal, setModal] = useState(false);

  const utils = trpc.useContext();
  const router = useRouter();

  const updateProduct = trpc.product.updateProduct.useMutation({
    onMutate: () => {
      utils.product.getAll.cancel();
      const optimisticUpdate = utils.product.getAll.getData();

      if (optimisticUpdate) {
        utils.product.getAll.setData(
          undefined,
          optimisticUpdate.map((t) =>
            t.id === data?.id
              ? {
                  ...t,
                  ...data,
                }
              : t
          )
        );
      }
    },
    onSuccess: () => {
      utils.user.getAll.invalidate();
      router.push(`/p`);
    },
  });

  const deleteProduct = trpc.product.deleteProduct.useMutation({
    onMutate: () => {
      utils.product.getAll.cancel();
      const optimisticUpdate = utils.product.getAll.getData();

      if (optimisticUpdate) {
        utils.product.getAll.setData(
          undefined,
          optimisticUpdate.filter((c) => c.id != data?.id)
        );
      }
    },
    onSettled: () => {
      router.push("/p");
    },
  });

  const disabled = !Boolean(product_name && price && stock && categoryId);

  return (
    <div className="">
      <div className={`${modal ? "flex justify-center" : "ml-11 mr-5 mt-5"} `}>
        <div
          id="popup-modal"
          tabIndex={-1}
          className={`${
            modal ? "block" : "hidden"
          } h-modal z-50 items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full`}
        >
          <div className="relative h-full w-full max-w-md p-4 md:h-auto">
            <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-toggle="popup-modal"
                onClick={() => setModal(false)}
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 text-center">
                <svg
                  aria-hidden="true"
                  className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this product?
                </h3>
                <button
                  data-modal-toggle="popup-modal"
                  onClick={() => {
                    deleteProduct.mutate({
                      id: data?.id as string,
                    });
                  }}
                  type="button"
                  className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                >
                  Yes, Im sure
                </button>
                <button
                  data-modal-toggle="popup-modal"
                  onClick={() => setModal(false)}
                  type="button"
                  className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`${modal ? "hidden" : "block"}`}>
          <Back />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              updateProduct.mutate({
                id: data?.id as string,
                name: String(product_name),
                stock: Number(stock),
                price: Number(price),
                categoryId: String(categoryId),
              });
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
                className={`w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white sm:w-auto   
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
          <button
            type="button"
            onClick={() => setModal(true)}
            className={`mt-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 `}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductPageComp;

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
