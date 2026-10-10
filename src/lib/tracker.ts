import { useEffect, useState } from "react";

export const meals = ["Breakfast", "Lunch", "Dinner", "Snacks"] as const;
export type Meal = (typeof meals)[number];
export type FoodEntry = {
  id: string;
  date: string;
  meal: Meal;
  name: string;
  grams: number | null;
  calories: number;
  portion: string;
};
export type TrackerData = {
  target: number | null;
  goalWeight: number | null;
  imported: boolean;
  foods: FoodEntry[];
  weights: { date: string; weight: number }[];
  migrationWarning?: string;
};

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatDate(date: string, short = false) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    undefined,
    short
      ? { month: "short", day: "numeric" }
      : { weekday: "long", month: "short", day: "numeric" },
  );
}

async function requestTracker(
  body?: Record<string, unknown>,
): Promise<TrackerData> {
  const response = await fetch("/.netlify/functions/tracker", {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    ...(body
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Tracking is unavailable right now. Please try again.");
  }
  if (!response.ok)
    throw new Error(
      data.error || "Your log could not be saved. Please try again.",
    );
  return data;
}

function previousLogs() {
  const foods: Omit<FoodEntry, "id">[] = [];
  const weights: { date: string; weight: number }[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key) continue;
    if (key.startsWith("foodLog_")) {
      const entries = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(entries))
        for (const food of entries)
          foods.push({
            date: key.slice(8),
            meal: "Snacks",
            name: food.name,
            grams: food.grams,
            calories: food.calories,
            portion: `${food.grams} g (previous log)`,
          });
    }
    if (key.startsWith("weightLog_"))
      weights.push({
        date: key.slice(10),
        weight: JSON.parse(localStorage.getItem(key) || "null"),
      });
  }
  const saved = JSON.parse(
    localStorage.getItem("weight-loss-calorie-target") || "null",
  );
  const target = saved?.results?.target;
  const previousGoal = localStorage.getItem("weight-goal-kg");
  const goalWeight = previousGoal === null ? null : Number(previousGoal);
  return {
    foods,
    weights,
    target:
      typeof target === "number" && target >= 1200 && target <= 10000
        ? target
        : null,
    goalWeight:
      goalWeight !== null &&
      Number.isFinite(goalWeight) &&
      goalWeight >= 20 &&
      goalWeight <= 500
        ? goalWeight
        : null,
  };
}

let connection: Promise<TrackerData> | null = null;

export async function loadTracker() {
  if (!connection) {
    connection = requestTracker()
      .then(async (data) => {
        if (data.imported) return data;
        let previous;
        try {
          previous = previousLogs();
        } catch {
          return {
            ...data,
            migrationWarning:
              "Previous browser logs could not be read. They have not been deleted. You can still use this tracker for new entries.",
          };
        }
        try {
          return await requestTracker({ kind: "import", ...previous });
        } catch {
          return {
            ...data,
            migrationWarning:
              "Previous browser logs could not be imported. They have not been deleted. You can still add new entries, and we will retry the import on your next visit.",
          };
        }
      })
      .catch((error) => {
        connection = null;
        throw error;
      });
  }
  return connection;
}

export async function saveTracker(body: Record<string, unknown>) {
  await loadTracker();
  const data = await requestTracker(body);
  connection = Promise.resolve(data);
  return data;
}

export function useTracker() {
  const [data, setData] = useState<TrackerData | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function reload() {
    setError("");
    connection = null;
    try {
      setData(await loadTracker());
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to load your tracker.",
      );
    }
  }

  useEffect(() => {
    let active = true;
    loadTracker()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((failure) => {
        if (active) setError(failure.message);
      });
    return () => {
      active = false;
    };
  }, []);

  async function save(body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      setData(await saveTracker(body));
      return true;
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to save. Please try again.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { data, error, busy, save, reload };
}
