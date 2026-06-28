"use client";

import { useEffect, useState } from "react";
import type { MasterDataType } from "@prisma/client";
import type { MasterDataOption } from "@/lib/master-data";
import { fetchMasterDataOptions } from "@/lib/master-data-server";

const CUSTOM_VALUE = "__custom__";

export interface LookupSelectProps {
  name: string;
  type: MasterDataType;
  /** Opções pré-carregadas (uso em Server Components). */
  items?: MasterDataOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  allowCustom?: boolean;
  customLabel?: string;
  id?: string;
}

export function LookupSelect({
  name,
  type,
  items: initialItems,
  value,
  defaultValue,
  placeholder = "Selecione",
  required,
  disabled,
  className,
  allowCustom = false,
  customLabel = "Outro (informar)",
  id,
}: LookupSelectProps) {
  const [items, setItems] = useState<MasterDataOption[]>(initialItems ?? []);
  const [loading, setLoading] = useState(!initialItems);
  const initialSelectValue =
    defaultValue && items.some((item) => item.value === defaultValue)
      ? defaultValue
      : defaultValue
        ? CUSTOM_VALUE
        : "";
  const [selectValue, setSelectValue] = useState(initialSelectValue);
  const [customText, setCustomText] = useState(
    defaultValue && !items.some((item) => item.value === defaultValue) ? defaultValue : "",
  );

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchMasterDataOptions(type).then((options) => {
      if (cancelled) return;
      setItems(options);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [type, initialItems]);

  useEffect(() => {
    if (value === undefined) return;
    if (items.some((item) => item.value === value)) {
      setSelectValue(value);
      setCustomText("");
    } else if (value) {
      setSelectValue(CUSTOM_VALUE);
      setCustomText(value);
    } else {
      setSelectValue("");
      setCustomText("");
    }
  }, [value, items]);

  const showCustom = allowCustom && selectValue === CUSTOM_VALUE;

  return (
    <div className="space-y-2">
      <select
        id={id}
        name={showCustom ? undefined : name}
        value={selectValue}
        required={required && !showCustom}
        disabled={disabled || loading}
        className={className ?? "input"}
        onChange={(event) => setSelectValue(event.target.value)}
      >
        <option value="">{loading ? "Carregando..." : placeholder}</option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
        {allowCustom && <option value={CUSTOM_VALUE}>{customLabel}</option>}
      </select>

      {showCustom && (
        <input
          name={name}
          type="text"
          className={className ?? "input"}
          value={customText}
          required={required}
          disabled={disabled}
          placeholder="Informe o valor"
          onChange={(event) => setCustomText(event.target.value)}
        />
      )}
    </div>
  );
}
