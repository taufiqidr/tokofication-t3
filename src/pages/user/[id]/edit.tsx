import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Back from "../../../../components/Back";
import Loading from "../../../../components/Loading";
import { trpc } from "../../../utils/trpc";

const EditUser = () => {
  const [balance, setBalance] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const disabled = false;
  const id = useRouter().query.id;

  const { data, isLoading } = trpc.user.getOne.useQuery({
    id: userId as string,
  });

  useEffect(() => {
    if (id) setUserId(String(id));
  }, [id]);
  useEffect(() => {
    if (data) {
      setBalance(String(data?.balance));
      setRole(data?.role as string);
    } else {
    }
  }, [data]);

  const utils = trpc.useContext();
  const router = useRouter();

  const updateUser = trpc.user.updateUser.useMutation({
    onMutate: () => {
      utils.user.getAll.cancel();
      const optimisticUpdate = utils.user.getAll.getData();

      if (optimisticUpdate) {
        utils.user.getAll.setData(
          undefined,
          optimisticUpdate.map((t) =>
            t.id === userId
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
      router.push(`/user`);
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-full">
      <div className="ml-11 mr-5 mt-5">
        <Back />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateUser.mutate({
              id: userId as string,
              balance: Number(balance),
              role: role as "ADMIN" | "USER",
            });
          }}
        >
          <div className="mb-6">
            <label
              htmlFor="balance"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Balance
            </label>
            <input
              type="number"
              id="balance"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
          {/* radio */}
          <div className=" mb-6 flex flex-row gap-x-3">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Role:
            </label>
            <div className="flex items-center">
              <input
                id="role_true"
                type="radio"
                checked={role === "ADMIN" ? true : false}
                value={role ? role : ""}
                onChange={() => setRole("ADMIN")}
                name="role"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="role_true"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Admin
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="role-false"
                type="radio"
                checked={role === "USER" ? true : false}
                value={role ? role : ""}
                onChange={() => setRole("USER")}
                name="role"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="role-false"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                User
              </label>
            </div>
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

export default EditUser;

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       userId: context.query.id,
//     },
//   };
// }
