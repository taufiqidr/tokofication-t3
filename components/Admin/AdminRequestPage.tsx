import { BsCheck, BsX } from "react-icons/bs";
import { money } from "../../src/utils/money";
import { trpc } from "../../src/utils/trpc";

import Loading from "../Loading";
const AdminRequestPageComp = () => {
  const { data: requests, isLoading } = trpc.request.getAll.useQuery();
  let requestList;
  if (isLoading) {
    requestList = <Loading />;
  } else {
    requestList = (
      <div className="mt-3 flex justify-center">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Amount
              </th>
              <th scope="col" className="py-3 px-6">
                Email
              </th>
              <th scope="col" className="py-3 px-6">
                Status
              </th>

              <th scope="col" className="py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((request) => (
              <Request
                key={request.id}
                id={request.id}
                userId={request.user.id}
                amount={request.amount}
                status={request.status}
                email={request.user.email}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="ml-11 mr-5 mt-5">{requestList}</div>
    </div>
  );
};
export default AdminRequestPageComp;

interface Request {
  id: string;
  userId: string;
  amount: number;
  status: string;
  email: string | null;
}
const Request = ({ id, amount, status, email, userId }: Request) => {
  const utils = trpc.useContext();

  const requestApproved = trpc.request.requestApproved.useMutation({
    onMutate: ({ id }) => {
      utils.request.getAll.cancel();
      const optimisticUpdate = utils.request.getAll.getData();

      if (optimisticUpdate) {
        utils.request.getAll.setData(
          undefined,
          optimisticUpdate.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "approved",
                }
              : t
          )
        );
      }
    },
  });
  const requestRejected = trpc.request.requestRejected.useMutation({
    onMutate: ({ id }) => {
      utils.request.getAll.cancel();
      const optimisticUpdate = utils.request.getAll.getData();

      if (optimisticUpdate) {
        utils.request.getAll.setData(
          undefined,
          optimisticUpdate.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: "rejected",
                }
              : t
          )
        );
      }
    },
  });
  return (
    <tr className="border-b bg-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-800">
      <td className="py-4 px-6 text-white">{money.format(amount)}</td>
      <td className="py-4 px-6 text-white">{email}</td>
      <td className="py-4 px-6 text-white">{status}</td>
      <td className="py-4 px-6 text-white">
        <div className="flex flex-row gap-x-3">
          <button
            className="rounded-sm bg-blue-500 p-1 text-lg"
            onClick={() => {
              requestApproved.mutate({
                id: id,
                amount: amount,
                userId: userId,
              });
            }}
          >
            <BsCheck />
          </button>
          <button
            className="rounded-sm bg-red-500 p-1 text-lg"
            onClick={() => {
              requestRejected.mutate({
                id: id,
              });
            }}
          >
            <BsX />
          </button>
        </div>
      </td>
    </tr>
  );
};
