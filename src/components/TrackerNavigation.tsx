import { Link, NavLink, useLocation } from "react-router-dom";

export default function TrackerNavigation() {
  const { pathname } = useLocation();
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex min-h-12 flex-1 items-center justify-center rounded-full px-4 py-3 text-base font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:text-lg ${
      isActive
        ? "bg-emerald-700 text-white shadow-sm"
        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
    }`;

  return (
    <header className="mx-auto w-full max-w-5xl px-4 pt-5 sm:px-6 sm:pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          to="/"
        >
          <span aria-hidden="true">←</span> Home
        </Link>
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          to="/calorie-calculator"
        >
          Calorie settings
        </Link>
      </div>
      <nav
        aria-label="Learn and track"
        className="mt-5 flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:rounded-full"
      >
        <NavLink className={tabClass} end to="/food-logger">
          Food diary
        </NavLink>
        <NavLink className={tabClass} to="/weight-tracker">
          Weight
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            tabClass({ isActive: isActive || pathname === "/" })
          }
          aria-current={pathname === "/" ? "page" : undefined}
          to="/nutrition-guide"
        >
          Learn &amp; portion
        </NavLink>
      </nav>
    </header>
  );
}
