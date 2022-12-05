import React, { useState } from "react";
import { money } from "../../src/utils/money";
import { trpc } from "../../src/utils/trpc";

import Back from "../Back";
import Loading from "../Loading";
const UserRequestPageComp = () => {
  const [amount, setAmount] = useState("");

  const utils = trpc.useContext();

  const newRequest = trpc.request.newRequest.useMutation({
    onMutate: () => {
      utils.request.getSelfRequest.cancel();
      const optimisticUpdate = utils.request.getSelfRequest.getData();
      if (optimisticUpdate) {
        utils.request.getSelfRequest.setData(undefined, [
          ...optimisticUpdate,
          {
            id: Math.random().toString(),
            amount: Number(amount),
            status: "pending",
          },
        ]);
      }
    },
  });

  const { data: requests, isLoading } = trpc.request.getSelfRequest.useQuery();
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
                amount={request.amount}
                status={request.status}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const disabled = !Boolean(amount);

  return (
    <div className="max-w-full">
      <div className="ml-11 mr-5 mt-5">
        <Back />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            newRequest.mutate({
              amount: Number(amount),
            });
            setAmount("");
          }}
          className="flex flex-row"
        >
          <div className="">
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="rounded-lg border border-gray-300 bg-gray-50 px-7 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mx-3 mt-auto">
            <button
              type="submit"
              disabled={disabled}
              className={`rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white   
              ${
                disabled
                  ? "bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                  : "bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              }`}
            >
              Send Request
            </button>
          </div>
        </form>
        {requestList}
      </div>
    </div>
  );
};

export default UserRequestPageComp;

interface Request {
  id: string;
  amount: number;
  status: string;
}
const Request = ({ id, amount, status }: Request) => {
  const utils = trpc.useContext();

  const deleteRequest = trpc.request.deleteRequest.useMutation({
    onMutate: () => {
      utils.request.getSelfRequest.cancel();
      const optimisticUpdate = utils.request.getSelfRequest.getData();

      if (optimisticUpdate) {
        utils.request.getSelfRequest.setData(
          undefined,
          optimisticUpdate.filter((c) => c.id !== id)
        );
      }
    },
  });
  return (
    <tr className="border-b bg-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-800">
      <td className="py-4 px-6 text-white">{money.format(amount)}</td>
      <td className="py-4 px-6 text-white">{status}</td>
      <td className="py-4 px-6 text-white">
        <button
          className="rounded-sm bg-red-500 p-1 text-lg"
          onClick={() => {
            deleteRequest.mutate({
              id: id,
            });
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
