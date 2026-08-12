"use client";

import { useEffect, useId, useRef, useState } from "react";

type FilterMenuProps = {
  label: string;
  options: readonly string[];
  /** Selected values. Single-select menus (Sort) always hold exactly one. */
  selected: readonly string[];
  onSelect: (value: string) => void;
  /** Sort behaves as a radio group; the filter menus are multi-select checkboxes. */
  single?: boolean;
  /** The menu's resting option ("All"): selected on its own it means no narrowing, so it never
   *  contributes to the count badge on the trigger. */
  defaultOption?: string;
  /** Class names from the host page, so the menu carries that proposal's styling. */
  classes: {
    root: string;
    trigger: string;
    triggerOpen: string;
    count: string;
    panel: string;
    option: string;
    optionSelected: string;
  };
};

/** Dropdown used by the companies toolbar. Closes on outside click, Escape, or blur out of
 *  the panel, so it behaves for keyboard users the same way it does for the mouse. */
export function FilterMenu({ label, options, selected, onSelect, single = false, defaultOption, classes }: FilterMenuProps) {
  const [open, setOpen] = useState(false);
  const narrowed = selected.filter((value) => value !== defaultOption);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={classes.root} ref={rootRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
    }}>
      <button
        type="button"
        className={`${classes.trigger} ${open ? classes.triggerOpen : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        {label}
        {single
          ? <span className={classes.count}>{selected[0]}</span>
          : narrowed.length > 0 && <span className={classes.count}>{narrowed.length}</span>}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div className={classes.panel} id={panelId} role={single ? "radiogroup" : "group"} aria-label={label}>
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                className={`${classes.option} ${isSelected ? classes.optionSelected : ""}`}
                role={single ? "radio" : "checkbox"}
                aria-checked={isSelected}
                onClick={() => {
                  onSelect(option);
                  if (single) setOpen(false);
                }}
              >
                <span aria-hidden>{isSelected ? "✓" : ""}</span>
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
