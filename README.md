# Weight Loss for Beginners

A React and Vite application that teaches balanced meals, portion awareness, and practical food and weight tracking without making quizzes or calorie targets a prerequisite.

## Beginner journey

The home page and `/nutrition-guide` introduce carbohydrates, protein, fibre, and fats, a visual plate guide, approximate hand portions, inexpensive meal ideas, and a five-question practice quiz with explanations. Existing calorie basics and food-scale lessons remain available.

The calorie calculator accepts centimetres or feet and inches, and kilograms or pounds. It starts with no assumed height and provides measurement instructions. Its estimates are for adults and are not personalised medical advice.

The food diary groups entries by meal, supports food search and label-based entries, offers familiar approximate portions for common foods, and shows daily totals and recent-day history. The weight tracker supports kg/lb input, same-day corrections, a chart, editable history, and optional goal tracking.

## Saved data

Food entries, weigh-ins, calorie targets, and optional weight goals are stored in Netlify Database using Drizzle. The schema is defined in `db/schema.ts`; generated migrations are in `netlify/database/migrations` and are applied by Netlify during deployment. After changing the schema, generate a new migration with `npx drizzle-kit generate --name descriptive_change`.

There are no accounts or cross-device syncing. A randomly generated, HttpOnly, SameSite cookie links this browser to its private tracker. Only its hash is stored with the data, and server queries are scoped to that tracker. Clearing the cookie or moving to another device makes the old history inaccessible from that browser. This limitation is explained in the interface.

On first use, previous browser food logs, weigh-ins, calorie targets, and weight goals are imported once. Original local storage is left untouched. If an import fails, the interface reports it without preventing new tracking, and retries on a subsequent visit.

## Local development

Install dependencies with `npm install`. Use the Netlify development server to serve the frontend and function together:

```sh
/opt/buildhome/node-deps/node_modules/.bin/netlify dev --port 8889
```

Persistent tracking requires an available Netlify Database branch with the migrations applied; it does not fall back to local files or browser storage. A fresh preview branch may not be available until deployment. The learning pages and calculator remain usable independently of the database.

Frontend types can be checked without creating build output:

```sh
npx tsc --noEmit -p tsconfig.app.json
```

Nutrition guidance links to NHS and USDA resources. Portion conversions and recipe calories are approximate; listed recipe totals include the specified ingredients and oil, not unlisted additions or substitutions.
