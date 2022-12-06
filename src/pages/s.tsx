import { useSession } from "next-auth/react";
import Back from "../../components/Back";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { trpc } from "../../src/utils/trpc";
import Loading from "../../components/Loading";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../utils/supabase";
import Image from "next/image";
import Unauthenticated from "../../components/Unauthenticated";

const SettingPage = () => {
  const { status } = useSession();
  let content;
  if (status === "authenticated") {
    content = <Setting />;
  } else if (status === "unauthenticated") {
    content = <Unauthenticated />;
  }

  return content;
};

export default SettingPage;

const Setting = () => {
  const { data, isLoading } = trpc.user.getOneSelf.useQuery();
  const image_name = uuidv4() + ".jpg";
  const old_image = data?.image;
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>();

  const Upload = async () => {
    await supabase.storage
      .from("tokofication-image")
      .upload("user/" + image_name, imageFile as File);
  };

  const Delete = async () => {
    await supabase.storage
      .from("tokofication-image")
      .remove(["user/" + old_image]);
  };

  useEffect(() => {
    if (data) {
      setName(String(data.name));
      setImage(String(data.image));
    }
  }, [data]);

  const disabled = false;

  const utils = trpc.useContext();
  const router = useRouter();

  const updateUser = trpc.user.updateSelfUser.useMutation({
    onMutate: () => {
      utils.user.getAll.cancel();
      const optimisticUpdate = utils.user.getAll.getData();

      if (optimisticUpdate) {
        utils.user.getAll.setData(
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
      router.push(`/me`);
    },
  });

  let pic;

  if (data?.image?.match(new RegExp("^[https]"))) {
    pic = () => String(data?.image);
  } else {
    pic = () =>
      String(
        `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/user/${data?.image}`
      );
  }

  if (imageFile) {
    pic = () => URL.createObjectURL(imageFile);
  }

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-full">
      <div className="ml-11 mr-5 mt-5">
        <Back />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateUser.mutate({
              name: String(name),
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
              Profile Picture
            </label>
            <div className="flex flex-row items-center">
              <div className=" h-[120px] w-[120px] rounded-full border">
                <Image
                  src={pic()}
                  alt="profile pic"
                  loader={pic}
                  height={120}
                  width={120}
                  className="h-full w-full rounded-full object-cover"
                  loading="lazy"
                ></Image>
              </div>
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
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
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
