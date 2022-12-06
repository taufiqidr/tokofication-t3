import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { supabase } from "../../src/utils/supabase";
import { trpc } from "../../src/utils/trpc";
import Back from "../Back";
import Loading from "../Loading";
import { v4 as uuidv4 } from "uuid";

interface Props {
  id: string;
}
const AdminCategoryPageComp = ({ id }: Props) => {
  const { data, isLoading } = trpc.category.getOne.useQuery({
    id: id as string,
  });

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const image_name = uuidv4() + ".jpg";
  const old_image = data?.image;

  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (data) {
      setName(String(data.name));
      setImage(String(data.image));
    }
  }, [data]);

  const utils = trpc.useContext();
  const router = useRouter();

  const updateCategory = trpc.category.updateCategory.useMutation({
    onMutate: () => {
      utils.category.getAll.cancel();
      const optimisticUpdate = utils.category.getAll.getData();

      if (optimisticUpdate) {
        utils.category.getAll.setData(
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
      router.push(`/c`);
    },
  });

  const deleteCategory = trpc.category.deleteCategory.useMutation({
    onMutate: () => {
      utils.category.getAll.cancel();
      const optimisticUpdate = utils.category.getAll.getData();

      if (optimisticUpdate) {
        utils.category.getAll.setData(
          undefined,
          optimisticUpdate.filter((c) => c.id != data?.id)
        );
      }
    },
    onSettled: () => {
      router.push("/c");
    },
  });

  const Upload = async () => {
    await supabase.storage
      .from("tokofication-image")
      .upload("category/" + image_name, imageFile as File);
  };

  const Delete = async () => {
    await supabase.storage
      .from("tokofication-image")
      .remove(["category/" + old_image]);
  };

  let pic;

  if (image) {
    pic = () =>
      String(
        `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/category/${image}`
      );
  }

  if (imageFile) {
    pic = () => URL.createObjectURL(imageFile);
  }
  const disabled = !Boolean(name);

  if (isLoading) return <Loading />;
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
                  Are you sure you want to delete this category?
                </h3>
                <button
                  data-modal-toggle="popup-modal"
                  onClick={() => {
                    deleteCategory.mutate({
                      id: data?.id as string,
                    });
                    if (old_image) Delete();
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
              updateCategory.mutate({
                id: data?.id as string,
                name: name as string,
                image: imageFile ? image_name : image,
              });
              if (imageFile) {
                Delete();
                Upload();
              }
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
                <div className="flex flex-col">
                  <input
                    type="file"
                    accept="image/*"
                    className="mx-3 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                    id="file_input"
                    onChange={(e) =>
                      setImageFile(() =>
                        e.target.files ? e.target.files[0] : undefined
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => {
                      Delete();
                      setImage("");
                    }}
                    className={`mx-3 mt-3 rounded-lg bg-red-700 px-5 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 `}
                  >
                    Remove Image
                  </button>
                </div>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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

export default AdminCategoryPageComp;
