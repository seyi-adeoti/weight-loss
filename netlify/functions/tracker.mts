import { createHash, randomBytes } from "node:crypto";
import { and, asc, eq, sql } from "drizzle-orm";
import { getDatabase } from "../../db/index.js";
import {
  foodEntries,
  trackerProfiles,
  weightEntries,
} from "../../db/schema.js";

class ValidationError extends Error {}

function numeric(value: unknown, min: number, max: number) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  )
    throw new ValidationError("Enter a valid number within the allowed range.");
  return value;
}

function text(value: unknown, max = 160) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new ValidationError("Enter a valid name or portion.");
  return value.trim();
}

function validDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new ValidationError("Choose a valid date.");
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value ||
    value < "1900-01-01" ||
    parsed.getTime() > Date.now() + 86400000
  )
    throw new ValidationError("Choose today or an earlier date.");
  return value;
}

function validateFood(raw: Record<string, unknown>, profileId: string) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new ValidationError("Invalid food entry.");
  const meal = text(raw.meal);
  if (!["Breakfast", "Lunch", "Dinner", "Snacks"].includes(meal))
    throw new ValidationError("Choose a meal.");
  return {
    profileId,
    date: validDate(raw.date),
    meal,
    name: text(raw.name),
    grams: raw.grams === null ? null : numeric(raw.grams, 1, 5000),
    calories: Math.round(numeric(raw.calories, 0, 20000)),
    portion: text(raw.portion),
  };
}

export default async function handler(request: Request) {
  const headers = new Headers({ "Cache-Control": "no-store", Vary: "Cookie" });
  if (!["GET", "POST"].includes(request.method))
    return Response.json(
      { error: "Method not allowed." },
      { status: 405, headers },
    );
  if (request.method === "POST") {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
      return Response.json(
        { error: "Request not allowed." },
        { status: 403, headers },
      );
    if (!request.headers.get("content-type")?.includes("application/json"))
      return Response.json(
        { error: "Expected JSON." },
        { status: 415, headers },
      );
  }

  const existingCookie = request.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)beginner_tracker=([a-f0-9]{64})(?:;|$)/)?.[1];
  if (request.method === "POST" && !existingCookie)
    return Response.json(
      { error: "Reload the page to reconnect your tracker." },
      { status: 401, headers },
    );
  const session = existingCookie ?? randomBytes(32).toString("hex");
  const profileId = createHash("sha256").update(session).digest("hex");
  headers.set(
    "Set-Cookie",
    `beginner_tracker=${session}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`,
  );

  try {
    const database = getDatabase();
    await database
      .insert(trackerProfiles)
      .values({ id: profileId })
      .onConflictDoNothing();
    if (request.method === "POST") {
      const raw = await request.text();
      if (raw.length > 1_000_000)
        return Response.json(
          { error: "This log is too large to save in one request." },
          { status: 413, headers },
        );
      let body: Record<string, unknown>;
      try {
        body = JSON.parse(raw);
      } catch {
        return Response.json(
          { error: "Invalid request." },
          { status: 400, headers },
        );
      }
      if (!body || typeof body !== "object" || Array.isArray(body))
        return Response.json(
          { error: "Invalid request." },
          { status: 400, headers },
        );
      try {
        if (body.kind === "food") {
          const food = validateFood(body, profileId);
          await database.insert(foodEntries).values(food);
        } else if (body.kind === "delete-food") {
          const id = text(body.id, 36);
          if (
            !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
              id,
            )
          )
            throw new ValidationError("Invalid food entry.");
          await database
            .delete(foodEntries)
            .where(
              and(eq(foodEntries.profileId, profileId), eq(foodEntries.id, id)),
            );
        } else if (body.kind === "weight") {
          const date = validDate(body.date);
          const weight = numeric(body.weight, 20, 500);
          await database
            .insert(weightEntries)
            .values({ profileId, date, weight })
            .onConflictDoUpdate({
              target: [weightEntries.profileId, weightEntries.date],
              set: { weight },
            });
        } else if (body.kind === "delete-weight") {
          await database
            .delete(weightEntries)
            .where(
              and(
                eq(weightEntries.profileId, profileId),
                eq(weightEntries.date, validDate(body.date)),
              ),
            );
        } else if (body.kind === "target") {
          const target = Math.round(numeric(body.target, 1200, 10000));
          await database
            .update(trackerProfiles)
            .set({ target })
            .where(eq(trackerProfiles.id, profileId));
        } else if (body.kind === "goal-weight") {
          const goalWeight =
            body.weight === null ? null : numeric(body.weight, 20, 500);
          await database
            .update(trackerProfiles)
            .set({ goalWeight })
            .where(eq(trackerProfiles.id, profileId));
        } else if (body.kind === "import") {
          const importedFoods = Array.isArray(body.foods) ? body.foods : [];
          const importedWeights = Array.isArray(body.weights)
            ? body.weights
            : [];
          if (importedFoods.length > 3000 || importedWeights.length > 3000)
            throw new ValidationError(
              "Your previous log is too large to import automatically. Your original browser logs have not been deleted.",
            );
          const foods = importedFoods.map((food) =>
            validateFood(food, profileId),
          );
          const weights = importedWeights.map((entry) => {
            if (!entry || typeof entry !== "object")
              throw new ValidationError(
                "An older weigh-in could not be imported. Your browser logs have not been deleted.",
              );
            return {
              profileId,
              date: validDate(entry.date),
              weight: numeric(entry.weight, 20, 500),
            };
          });
          const target =
            body.target == null
              ? null
              : Math.round(numeric(body.target, 1200, 10000));
          const goalWeight =
            body.goalWeight == null ? null : numeric(body.goalWeight, 20, 500);
          await database.transaction(async (transaction) => {
            const claimed = await transaction
              .update(trackerProfiles)
              .set({
                imported: true,
                target: sql`coalesce(${trackerProfiles.target}, ${target})`,
                goalWeight: sql`coalesce(${trackerProfiles.goalWeight}, ${goalWeight})`,
              })
              .where(
                and(
                  eq(trackerProfiles.id, profileId),
                  eq(trackerProfiles.imported, false),
                ),
              )
              .returning({ id: trackerProfiles.id });
            if (!claimed.length) return;
            if (foods.length)
              await transaction.insert(foodEntries).values(foods);
            if (weights.length)
              await transaction.insert(weightEntries).values(weights);
          });
        } else {
          throw new ValidationError("Unknown tracker action.");
        }
      } catch (error) {
        if (error instanceof ValidationError)
          return Response.json(
            { error: error.message },
            { status: 400, headers },
          );
        throw error;
      }
    }
    const [profile] = await database
      .select()
      .from(trackerProfiles)
      .where(eq(trackerProfiles.id, profileId));
    const foods = await database
      .select({
        id: foodEntries.id,
        date: foodEntries.date,
        meal: foodEntries.meal,
        name: foodEntries.name,
        grams: foodEntries.grams,
        calories: foodEntries.calories,
        portion: foodEntries.portion,
      })
      .from(foodEntries)
      .where(eq(foodEntries.profileId, profileId))
      .orderBy(asc(foodEntries.date));
    const weights = await database
      .select({ date: weightEntries.date, weight: weightEntries.weight })
      .from(weightEntries)
      .where(eq(weightEntries.profileId, profileId))
      .orderBy(asc(weightEntries.date));
    return Response.json(
      {
        target: profile.target,
        goalWeight: profile.goalWeight,
        imported: profile.imported,
        foods,
        weights,
      },
      { headers },
    );
  } catch {
    return Response.json(
      {
        error:
          "Your tracker could not connect. Please try again; your saved entries have not been cleared.",
      },
      { status: 503, headers },
    );
  }
}
