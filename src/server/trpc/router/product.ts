import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const productRouter = router({
  postProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        categoryId: z.string(),
        price: z.number(),
        stock: z.number(),
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
            categoryId: input.categoryId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
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
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  countProduct: publicProcedure
    .input(
      z.object({
        categoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.product.count({
          where: {
            categoryId: input.categoryId,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
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
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
