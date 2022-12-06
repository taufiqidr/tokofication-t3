import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const productRouter = router({
  //public
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          price: true,
          stock: true,
          user: true,
          image: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.product.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            stock: true,
            user: true,
            image: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  getByCategory: publicProcedure
    .input(
      z.object({
        categoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.product.findMany({
          where: {
            categoryId: input.categoryId,
          },
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            stock: true,
            user: true,
            image: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  getByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.product.findMany({
          where: {
            userId: input.userId,
          },
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            stock: true,
            user: true,
            image: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  //user only
  postProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        categoryId: z.string(),
        price: z.number(),
        stock: z.number(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.product.create({
          data: {
            name: input.name,
            userId: ctx.session.user.id,
            price: input.price,
            stock: input.stock,
            image: input.image,
            categoryId: input.categoryId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  deleteProductUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.product.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  buyProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        sellerId: z.string(),
        buyerId: z.string(),
        price: z.number(),
        stock: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return (
          await ctx.prisma.product.update({
            where: {
              id: input.productId,
            },
            data: {
              stock: {
                decrement: 1,
              },
            },
          }),
          await ctx.prisma.user.update({
            where: {
              id: input.buyerId,
            },
            data: {
              balance: {
                decrement: input.price,
              },
            },
          }),
          await ctx.prisma.user.update({
            where: {
              id: input.sellerId,
            },
            data: {
              balance: {
                increment: input.price,
              },
            },
          })
        );
      } catch (error) {
        console.log("error", error);
      }
    }),
  updateProductUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        categoryId: z.string(),
        price: z.number(),
        stock: z.number(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.product.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            userId: ctx.session.user.id,
            price: input.price,
            stock: input.stock,
            categoryId: input.categoryId,
            image: input.image,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  //admin only

  deleteProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.product.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  updateProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        categoryId: z.string(),
        price: z.number(),
        stock: z.number(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.product.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            userId: ctx.session.user.id,
            price: input.price,
            stock: input.stock,
            categoryId: input.categoryId,
            image: input.image,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
