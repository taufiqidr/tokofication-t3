import { trpc } from "../../src/utils/trpc";
import Back from "../Back";
import Loading from "../Loading";
import ProductItem from "../ProductItem";

interface Props {
  categoryId: string;
}
const UserCategoryPageComp = ({ categoryId }: Props) => {
  const { data: products, isLoading } = trpc.product.getByCategory.useQuery({
    categoryId: categoryId as string,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <Back />
      <p className="mt-2 text-xl">
        Showing all the products from this category
      </p>
      <div className="flex h-auto flex-row flex-wrap ">
        {products?.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            seller={String(product.user.email)}
            stock={product.stock}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
};

export default UserCategoryPageComp;
