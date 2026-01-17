"use client";

import { useFormContext } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils"; // optional utility class merger

type Props = {
  name: string;
  placeholder?: string;
  className?: string;
};

export function CommaSeparatedInput({ name, placeholder, className }: Props) {
  const { setValue, getValues, register } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const initial = getValues(name);
    if (initial) {
      // Check if it's an array first
      if (Array.isArray(initial)) {
        setItems(initial);
      } else if (typeof initial === "string") {
        // Only split if it's a string
        const parsed = initial
          .split(",")
          .map((w: string) => w.trim())
          .filter(Boolean);
        setItems(parsed);
      }
    }
  }, [getValues, name]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !items.includes(value)) {
        const newItems = [...items, value];
        setItems(newItems);
        setValue(name, newItems, { shouldValidate: true }); // ← Send as array
        e.currentTarget.value = "";
      }
    }
  };

  const removeItem = (item: string) => {
    const newItems = items.filter((i) => i !== item);
    setItems(newItems);
    setValue(name, newItems, { shouldValidate: true }); // ← Send as array
  };
  return (
    <div
      className={cn(
        "flex min-h-[42px] flex-wrap items-center gap-2 rounded-md border border-input px-2 py-1",
        className,
      )}
    >
      {items.map((item, i) => (
        <span
          key={i}
          className=" px-2 py-1 text-sm rounded flex items-center gap-1 bg-blue-200"
        >
          {item}
          <X
            size={14}
            onClick={() => removeItem(item)}
            className="cursor-pointer hover:text-red-600"
          />
        </span>
      ))}

      <input
        type="text"
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Type and press comma or enter"}
        className="flex-1 border-none outline-none text-base bg-transparent"
        ref={(e) => {
          register(name);
          inputRef.current = e;
        }}
      />
    </div>
  );
}
