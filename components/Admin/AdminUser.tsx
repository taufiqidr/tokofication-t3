import React from "react";
import { trpc } from "../../src/utils/trpc";
import Loading from "../Loading";
import User from "./RowUser";

const AdminUserComp = () => {
  const { data: users, isLoading } = trpc.user.getAll.useQuery();

  if (isLoading) return <Loading />;
  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Email
              </th>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Balance
              </th>
              <th scope="col" className="py-3 px-6">
                Role
              </th>
              <th scope="col" className="border-l border-gray-400 py-3 px-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <User
                key={user.id as string}
                userId={user.id as string}
                email={user.email as string}
                balance={user.balance as number}
                role={user.role as string}
                name={user.name as string}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserComp;
