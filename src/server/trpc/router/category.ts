import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const categoryRouter = router({
  postCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.category.create({
          data: {
            name: input.name,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.category.findMany({
        select: {
          id: true,
          name: true,
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
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  deleteCategory: protectedProcedure
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
  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
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
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
