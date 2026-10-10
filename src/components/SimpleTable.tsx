type TableRow = {
  dailyChange: string;
  weeklyEstimate: string;
  note: string;
};

type SimpleTableProps = {
  rows: TableRow[];
};

export default function SimpleTable({ rows }: SimpleTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full border-collapse text-left text-base sm:text-lg">
        <thead className="bg-emerald-50 text-slate-800">
          <tr>
            <th className="px-4 py-4 font-bold sm:px-6" scope="col">
              Daily difference
            </th>
            <th className="px-4 py-4 font-bold sm:px-6" scope="col">
              Rough weekly estimate
            </th>
            <th className="hidden px-6 py-4 font-bold sm:table-cell" scope="col">
              What that means
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr className="bg-white" key={row.dailyChange}>
              <th
                className="px-4 py-4 font-semibold text-slate-800 sm:px-6"
                scope="row"
              >
                {row.dailyChange}
              </th>
              <td className="px-4 py-4 font-bold text-emerald-800 sm:px-6">
                {row.weeklyEstimate}
              </td>
              <td className="hidden px-6 py-4 text-slate-600 sm:table-cell">
                {row.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 sm:hidden">
        These are rough estimates. Your body and scale can change at a different
        pace.
      </div>
    </div>
  );
}
