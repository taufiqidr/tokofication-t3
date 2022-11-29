import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = router({
  //public
  getAllPublic: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  //user only
  //admin only

  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          balance: true,
          role: true,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            email: true,
            name: true,
            balance: true,
            role: true,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        balance: z.number(),
        role: z.enum(["ADMIN", "USER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            balance: input.balance,
            role: input.role,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
