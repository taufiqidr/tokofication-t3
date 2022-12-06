import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";

export const categoryRouter = router({
  // public
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.category.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          product: true,
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
        return await ctx.prisma.category.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            name: true,
            image: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  // user only

  // admin only
  postCategory: adminProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.category.create({
          data: {
            name: input.name,
            image: input.image,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  deleteCategory: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.category.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  updateCategory: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.category.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            image: input.image,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
