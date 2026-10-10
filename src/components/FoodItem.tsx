export type LoggedFood = {
  id: string;
  foodId: string;
  name: string;
  grams: number;
  calories: number;
};

type FoodItemProps = {
  item: LoggedFood;
  onDelete: (id: string) => void;
};

export default function FoodItem({ item, onDelete }: FoodItemProps) {
  return (
    <li className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-4 first:border-0 sm:px-5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-slate-900 sm:text-lg">
          {item.name}
        </p>
        <p className="mt-1 text-sm text-slate-500">{item.grams} g</p>
      </div>
      <p className="shrink-0 text-base font-bold tabular-nums text-slate-800 sm:text-lg">
        {item.calories} cal
      </p>
      <button
        aria-label={`Delete ${item.name}`}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-rose-700 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        onClick={() => onDelete(item.id)}
        type="button"
      >
        <span aria-hidden="true" className="text-xl">
          ×
        </span>
      </button>
    </li>
  );
}
