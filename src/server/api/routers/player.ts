import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { api } from "~/trpc/server";
import { getUnarmed } from "./weapon";
import { rollHiddenDice } from "~/lib/utils";
import { type game } from "dbschema/interfaces";
import e from "dbschema/edgeql-js";
import { client } from "~/server/db";

export const playerRouter = createTRPCRouter({
  getPlayers: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx: { query, ...ctx }, input: { userId } }) => {
      const players = await query
        .select(query.game.Player, (p) => ({
          filter: query.op(p.user.id, "=", userId),
          ...query.game.Player["*"],
        }))
        .run(ctx.db);
      return players;
    }),
  getUserPlayers: protectedProcedure.query(
    async ({ ctx: { session, query, ...ctx } }) => {
      const players = await query
        .select(query.game.Player, (p) => ({
          filter: query.op(p.user.id, "=", session.user.id),
          ...query.game.Player["*"],
        }))
        .run(ctx.db);
      return players;
    },
  ),
  getPlayerData: publicProcedure
    .input(
      z.object({
        playerId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx: { query, ...ctx }, input: { playerId } }) => {
      const player = await query
        .select(query.game.Player, (p) => ({
          filter_single: query.op(p.id, "=", playerId),
          ...query.game.Player["*"],
          stats: {
            ...query.game.Player.stats["*"],
          },
          inventory: {
            primaryWeapon: query.game.Player.inventory.primaryWeapon["*"],
            secondaryWeapon: query.game.Player.inventory.primaryWeapon["*"],
          },
        }))
        .run(ctx.db);
      return player;
    }),
  createPlayer: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx: { session, query, ...ctx }, input: { name } }) => {
      const stats = query.insert(query.game.EntityStats, createEntityStats());

      const inventory = query.insert(query.game.EntityInventory, {
        primaryWeapon: getUnarmed(),
        secondaryWeapon: null,
      });

      const playerId = await query
        .insert(query.game.Player, {
          name,
          user: query.select(query.default.User, (u) => ({
            filter_single: query.op(u.id, "=", session.user.id),
          })),
          stats,
          inventory,
        })
        .run(ctx.db);

      return playerId;
    }),
  rerollPlayer: protectedProcedure
    .input(
      z.object({
        playerId: z.string().uuid(),
      }),
    )
    .mutation(
      async ({ ctx: { session, query, ...ctx }, input: { playerId } }) => {
        const player = await getPlayer(playerId, session.user.id);

        await query
          .update(query.game.EntityStats, (s) => ({
            filter_single: query.op(s.id, "=", player.stats.id),
            set: createEntityStats(),
          }))
          .run(ctx.db);

        return true;
      },
    ),
  deletePlayer: protectedProcedure
    .input(
      z.object({
        playerId: z.string().uuid(),
      }),
    )
    .mutation(
      async ({ ctx: { session, query, ...ctx }, input: { playerId } }) => {
        const player = await getPlayer(playerId, session.user.id);

        await query
          .delete(query.game.Player, (p) => ({
            filter_single: query.op(p.id, "=", playerId),
          }))
          .run(ctx.db);

        return true;
      },
    ),
  updatePlayer: protectedProcedure
    .input(
      z.object({
        playerId: z.string().uuid(),
        name: z.string().optional(),
        primaryWeapon: z.string().uuid(),
        secondaryWeapon: z.string().uuid(),
      }),
    )
    .mutation(
      async ({
        ctx: { session, query, ...ctx },
        input: { playerId, name, primaryWeapon, secondaryWeapon },
      }) => {
        const player = await getPlayer(playerId, session.user.id);
        
        await query
          .delete(query.game.Player, (p) => ({
            filter_single: query.op(p.id, "=", playerId),
          }))
          .run(ctx.db);

        return true;
      },
    ),
});

async function getPlayer(playerId: string, owningUserId?: string) {
  const player = await e
    .select(e.game.Player, (p) => ({
      filter_single: e.op(p.id, "=", playerId),
      user: true,
      stats: true,
      inventory: true,
    }))
    .run(client);

  if (!player) throw new Error("Player not found");

  if (owningUserId && player.user.id !== owningUserId)
    throw new Error("You do not have permission to do this");
  return player;
}

export function createEntityStats(oldStats?: Partial<game.EntityStats>) {
  return {
    hp: oldStats?.hp ?? rollHiddenDice(4, 10, 40),
    armorClass: oldStats?.armorClass ?? rollHiddenDice(3, 5, 5),
    actionCount: oldStats?.actionCount ?? 1,
    bonusActionCount: oldStats?.bonusActionCount ?? 1,
  };
}
