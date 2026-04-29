import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Task } from "../../types";
import { STATUS_OPTIONS } from "../../constants";
import styles from "./StatusDropdown.module.scss";

type Option<T extends string> = { value: T; label: string };

function isTaskStatus(value: string): value is Task["status"] {
    return value === "todo" || value === "in_progress" || value === "done";
}

interface StatusDropdownProps<T extends string = Task["status"]> {
    value: T;
    onChange: (value: T) => void;
    disabled?: boolean;
    options?: Option<T>[];
    id?: string;
    portal?: boolean;
}

export function StatusDropdown<T extends string = Task["status"]>({
    value,
    onChange,
    disabled = false,
    options = STATUS_OPTIONS as Option<T>[],
    id,
    portal = false,
}: StatusDropdownProps<T>) {
    const autoId = useId();
    const triggerId = id ?? `status-${autoId}`;
    const listboxId = `${triggerId}-listbox`;
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [menuPos, setMenuPos] = useState<{ left: number; top: number; width: number } | null>(null);

    const labelByValue = useMemo(() => {
        const entries = options.map((opt) => [opt.value, opt.label] as const);
        return Object.fromEntries(entries) as Record<T, string>;
    }, [options]);

    useEffect(() => {
        if (!open) return;

        function updatePosition() {
            if (!portal) return;
            const el = triggerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setMenuPos({
                left: rect.left,
                top: rect.bottom + 6,
                width: rect.width,
            });
        }

        updatePosition();

        function onPointerDown(e: PointerEvent) {
            const el = rootRef.current;
            const menuEl = menuRef.current;
            if (!(e.target instanceof Node)) return;
            const clickedInsideRoot = !!el && el.contains(e.target);
            const clickedInsideMenu = !!menuEl && menuEl.contains(e.target);
            if (!clickedInsideRoot && !clickedInsideMenu) setOpen(false);
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        function onScrollOrResize() {
            updatePosition();
        }

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        if (portal) {
            window.addEventListener("scroll", onScrollOrResize, true);
            window.addEventListener("resize", onScrollOrResize);
        }
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
            if (portal) {
                window.removeEventListener("scroll", onScrollOrResize, true);
                window.removeEventListener("resize", onScrollOrResize);
            }
        };
    }, [open, portal]);

    return (
        <div className={styles.root} ref={rootRef}>
            <button
                type="button"
                className={styles.trigger}
                id={triggerId}
                ref={triggerRef}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listboxId}
                onClick={() => setOpen((v) => !v)}
            >
                {labelByValue[value] ?? value}
            </button>

            {open &&
                (portal
                    ? menuPos &&
                      createPortal(
                          <div
                              ref={menuRef}
                              className={[styles.menu, styles.menuPortal].join(" ")}
                              id={listboxId}
                              role="listbox"
                              style={{ left: menuPos.left, top: menuPos.top, width: menuPos.width }}
                          >
                              {options.map((opt) => {
                                  const isSelected = opt.value === value;
                                  return (
                                      <button
                                          key={opt.value}
                                          type="button"
                                          role="option"
                                          aria-selected={isSelected}
                                          className={[styles.option, isSelected ? styles.optionSelected : ""]
                                              .filter(Boolean)
                                              .join(" ")}
                                          onClick={() => {
                                              setOpen(false);
                                              if (!isSelected) onChange(opt.value);
                                          }}
                                      >
                                          {opt.label}
                                      </button>
                                  );
                              })}
                          </div>,
                          document.body,
                      )
                    : (
                          <div
                              ref={menuRef}
                              className={[styles.menu, styles.menuInline].join(" ")}
                              id={listboxId}
                              role="listbox"
                          >
                              {options.map((opt) => {
                                  const isSelected = opt.value === value;
                                  return (
                                      <button
                                          key={opt.value}
                                          type="button"
                                          role="option"
                                          aria-selected={isSelected}
                                          className={[styles.option, isSelected ? styles.optionSelected : ""]
                                              .filter(Boolean)
                                              .join(" ")}
                                          onClick={() => {
                                              setOpen(false);
                                              if (!isSelected) onChange(opt.value);
                                          }}
                                      >
                                          {opt.label}
                                      </button>
                                  );
                              })}
                          </div>
                      ))}

            {!id && isTaskStatus(value) && <div className={[styles.badge, styles[value]].join(" ")} />}
        </div>
    );
}

export default StatusDropdown;
