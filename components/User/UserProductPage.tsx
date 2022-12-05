import { type Category, type User } from "@prisma/client";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { money } from "../../src/utils/money";
import { trpc } from "../../src/utils/trpc";
import Back from "../Back";

interface Props {
  session?: Session;
  product?:
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
export const UserProductPageComp = ({ session, product }: Props) => {
  const productId = product?.id;
  const utils = trpc.useContext();
  const router = useRouter();

  const buyProduct = trpc.product.buyProduct.useMutation({
    onMutate: () => {
      utils.product.getAll.cancel();
      const optimisticUpdate = utils.product.getAll.getData();
      if (optimisticUpdate) {
        utils.product.getAll.setData(undefined, optimisticUpdate);
      }
    },
    onSuccess: () => {
      utils.user.getAll.invalidate();
      router.push(`/p`);
    },
  });

  let btn;

  if (!session) {
    btn = (
      <button
        onClick={() => signIn("discord")}
        className="text-whitehover:bg-blue-800 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        You need to login to buy a product
      </button>
    );
  } else {
    if (Number(session.user?.balance) < Number(product?.price)) {
      btn = (
        <button className="text-whitehover:bg-slate-800 cursor-not-allowed rounded-lg bg-slate-700 px-5 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-4 focus:ring-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800">
          Not enough balance
        </button>
      );
    } else {
      btn = (
        <button
          className={`rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white   
  hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
  `}
          onClick={() => {
            buyProduct.mutate({
              productId: productId as string,
              stock: Number(product?.stock),
              price: Number(product?.price),
              buyerId: String(session?.user?.id),
              sellerId: String(product?.user.id),
            });
          }}
        >
          Buy This Product
        </button>
      );
    }
  }

  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <Back />
      <div className="flex h-auto flex-row">
        <div className="h-80 w-1/3 bg-gray-400"></div>
        <div className="mx-3 flex h-80 w-2/3 flex-col justify-between">
          <div className="flex flex-col gap-y-3">
            <h1 className="text-4xl font-medium">{product?.name}</h1>
            <span className="text-5xl font-bold">
              {money.format(Number(product?.price))}
            </span>
            <span className="">
              Stock: <span className="font-bold">{product?.stock}</span>
            </span>
            <span>
              Seller:
              <Link href={`/u/${product?.user.id}`}>
                <span className="font-bold text-blue-500">
                  {" "}
                  {product?.user.name}
                </span>
              </Link>
            </span>
            <span>
              Category:
              <Link href={`/c/${product?.category.id}`}>
                <span className="font-bold text-blue-500">
                  {" "}
                  {product?.category.name}
                </span>
              </Link>
            </span>
          </div>
          <div className="flex flex-col">{btn}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProductPageComp;
