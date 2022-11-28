import { router } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { productRouter } from "./product";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  category: categoryRouter,
  product: productRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
