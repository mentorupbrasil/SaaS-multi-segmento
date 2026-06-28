import { Icon } from "@/components/icon";

export interface ListToolbarFilter {
  name: string;
  label: string;
  value?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface ListToolbarProps {
  action?: string;
  searchName?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  filters?: ListToolbarFilter[];
  children?: React.ReactNode;
}

export function ListToolbar({
  action = "",
  searchName = "q",
  searchValue = "",
  searchPlaceholder = "Buscar...",
  filters = [],
  children,
}: ListToolbarProps) {
  return (
    <form method="get" action={action} className="mb-4 flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label htmlFor={searchName} className="sr-only">
          Busca
        </label>
        <div className="relative">
          <Icon
            name="Search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            id={searchName}
            name={searchName}
            type="search"
            defaultValue={searchValue}
            placeholder={searchPlaceholder}
            className="input pl-9"
          />
        </div>
      </div>

      {filters.map((filter) => (
        <div key={filter.name} className="min-w-[160px]">
          <label htmlFor={filter.name} className="label">
            {filter.label}
          </label>
          <select
            id={filter.name}
            name={filter.name}
            defaultValue={filter.value ?? ""}
            className="input"
          >
            <option value="">{filter.placeholder ?? "Todos"}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {children}

      <button type="submit" className="btn-secondary">
        Filtrar
      </button>
    </form>
  );
}
