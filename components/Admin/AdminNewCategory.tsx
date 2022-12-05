import { useRouter } from "next/router";
import React, { useState } from "react";
import { trpc } from "../../src/utils/trpc";
import { v4 as uuidv4 } from "uuid";

import Back from "../Back";
import { supabase } from "../../src/utils/supabase";
import Image from "next/image";
const AdminNewCategoryComp = () => {
  const [category_name, setCategory_name] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const image_name = uuidv4() + ".jpg";

  const router = useRouter();
  const utils = trpc.useContext();
  const postCategory = trpc.category.postCategory.useMutation({
    onMutate: () => {
      utils.category.getAll.cancel();
      const optimisticUpdate = utils.category.getAll.getData();

      if (optimisticUpdate) {
        utils.category.getAll.setData(undefined, optimisticUpdate);
      }
    },
    onSettled: () => {
      utils.category.getAll.invalidate();
      router.push("/c");
    },
  });

  const Upload = async () => {
    await supabase.storage
      .from("tokofication-image")
      .upload("category/" + image_name, image as File);
  };
  let pic;

  if (image) pic = () => URL.createObjectURL(image);
  const disabled = !Boolean(category_name);

  return (
    <div className="max-w-full">
      <div className="ml-11 mr-5 mt-5">
        <Back />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            postCategory.mutate({
              name: category_name,
              image: image_name,
            });
            Upload();
            setCategory_name("");
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
              htmlFor="category_name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Category Name
            </label>
            <input
              type="text"
              id="category_name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              value={category_name}
              onChange={(e) => setCategory_name(e.target.value)}
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

export default AdminNewCategoryComp;
