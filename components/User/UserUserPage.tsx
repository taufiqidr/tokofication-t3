import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { trpc } from "../../src/utils/trpc";
import Back from "../Back";
import Loading from "../Loading";
import ProductItem from "../ProductItem";

const UserUserPageComp = () => {
  const id = useRouter().query.id;
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState("");

  const { data: products, isLoading } = trpc.product.getByUser.useQuery({
    userId: userId as string,
  });
  const { data: user, isLoading: isLoadingUser } =
    trpc.user.getOnePublic.useQuery({
      id: userId as string,
    });

  let pic;

  if (image.match(new RegExp("^[https]"))) {
    pic = () => String(image);
  } else {
    pic = () =>
      String(
        `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/user/${image}`
      );
  }
  useEffect(() => {
    if (id) setUserId(String(id));
  }, [id]);

  useEffect(() => {
    if (user?.image) setImage(user.image);
  }, [user]);

  if (isLoading || isLoadingUser) return <Loading />;

  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <Back />
      <div className="m-3 flex justify-start">
        <div className=" h-[240px] w-[240px] rounded-full border">
          <Image
            src={pic()}
            alt="profile pic"
            loader={pic}
            height={240}
            width={240}
            className="h-full w-full rounded-full object-cover"
            unoptimized={true}
            priority={true}
          ></Image>
        </div>
        <div className="mx-3 flex flex-col justify-between">
          <div className=" mb-3 text-5xl font-bold">{user?.name}</div>
          <div className=" mb-3 text-5xl font-bold">
            {products?.length} Products
          </div>
        </div>
      </div>

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

export default UserUserPageComp;
