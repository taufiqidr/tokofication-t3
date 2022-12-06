import { useRouter } from "next/router";
import React, { useState } from "react";
import { trpc } from "../../src/utils/trpc";
import Back from "../Back";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../src/utils/supabase";
import Image from "next/image";

const AdminNewProductComp = () => {
  const [product_name, setProduct_name] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState<File | undefined>();
  const image_name = uuidv4() + ".jpg";

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
      router.push("/p");
    },
  });

  const Upload = async () => {
    await supabase.storage
      .from("tokofication-image")
      .upload("product/" + image_name, image as File);
  };

  let pic;

  if (image) pic = () => URL.createObjectURL(image);
  const disabled = !Boolean(product_name && price && stock && categoryId);

  return (
    <div className="mb-3 max-w-full">
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
              image: image ? image_name : "",
            });
            if (image) Upload();
            setProduct_name("");
            setPrice("");
            setCategoryId("");
            setStock("");
          }}
        >
          <div className="mb-6">
            <label
              htmlFor="file_input"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Image
            </label>
            <div className="flex flex-row items-center">
              <div className=" h-[120px] w-[120px] rounded-lg border">
                {pic && (
                  <Image
                    src={pic()}
                    alt="profile pic"
                    loader={pic}
                    height={120}
                    width={120}
                    className="h-full w-full rounded-lg object-cover"
                    loading="lazy"
                  ></Image>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="mx-3 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                id="file_input"
                onChange={(e) =>
                  setImage(() =>
                    e.target.files ? e.target.files[0] : undefined
                  )
                }
              />
            </div>
          </div>
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

export default AdminNewProductComp;

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
