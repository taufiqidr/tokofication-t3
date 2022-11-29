import { useRouter } from "next/router";
import React, { useState } from "react";
import { trpc } from "../../src/utils/trpc";
import Back from "../Back";

const AdminNewCategoryComp = () => {
  const [category_name, setCategory_name] = useState("");
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
            });
            setCategory_name("");
          }}
        >
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
