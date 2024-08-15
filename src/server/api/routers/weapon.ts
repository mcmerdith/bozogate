import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { api } from "~/trpc/server";

import e from "dbschema/edgeql-js";

export const weaponRouter = createTRPCRouter({
  getUnarmed: publicProcedure.query(async ({ ctx: { query, ...ctx } }) => {
    const weapon = await getUnarmed().run(ctx.db);
    return weapon;
  }),
});

export const getUnarmed = () =>
  e.select(
    e
      .insert(e.game.Weapon, {
        name: "Unarmed",
        diceCount: 1,
        diceSides: 4,
        damageOffset: 0,
      })
      .unlessConflict((w) => ({
        on: w.name,
        else: w,
      })),
    () => ({
      ...e.game.Weapon["*"],
    }),
  );
