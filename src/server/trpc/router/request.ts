import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";

export const requestRouter = router({
  getAll: adminProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.request.findMany({
        select: {
          id: true,
          amount: true,
          status: true,
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
  getSelfRequest: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.request.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          amount: true,
          status: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  newRequest: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.request.create({
          data: {
            amount: input.amount,
            status: "pending",
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  requestApproved: adminProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return (
          await ctx.prisma.request.update({
            where: {
              id: input.id,
            },
            data: {
              status: "approved",
            },
          }),
          await ctx.prisma.user.update({
            where: {
              id: input.userId,
            },
            data: {
              balance: {
                increment: input.amount,
              },
            },
          })
        );
      } catch (error) {
        console.log("error", error);
      }
    }),
  requestRejected: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.request.update({
          where: {
            id: input.id,
          },
          data: {
            status: "rejected",
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  deleteRequest: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.request.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
