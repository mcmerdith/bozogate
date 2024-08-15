import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { api } from "~/trpc/server";

export const gameRouter = createTRPCRouter({
  getGames: publicProcedure.query(({ ctx }) => {
    return [];
  }),
  createGame: publicProcedure.mutation(({ ctx }) => {
    return {};
  }),
  deleteGame: publicProcedure.mutation(({ ctx }) => {
    return {};
  }),
  joinGame: publicProcedure.mutation(({ ctx }) => {
    return {};
  }),
  leaveGame: publicProcedure.mutation(({ ctx }) => {
    return {};
  }),
});
