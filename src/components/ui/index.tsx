import React from "react";

/** Crisp Hairline + Soft Lift container primitive */
export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`bg-white border border-[#E6E7E5] rounded-2xl shadow-[0_2px_10px_rgba(14,42,32,0.06)] ${
        interactive
          ? "transition-all duration-200 hover:border-[#176B3A]/40 hover:shadow-[0_6px_20px_rgba(14,42,32,0.09)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "gold" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const BTN_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-[#0E2A20] text-[#C8A838] hover:bg-[#143B2D]",
  secondary: "bg-[#176B3A] text-white hover:bg-[#135830]",
  gold: "bg-[#C8A838] text-[#0E2A20] hover:bg-[#B8982E]",
  outline: "bg-white border border-[#E6E7E5] text-[#0E2A20] hover:border-[#176B3A]/50",
  ghost: "bg-transparent text-[#5C6B64] hover:text-[#0E2A20] hover:bg-[#EAEDEA]",
};

const BTN_SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-xs sm:text-sm rounded-xl",
  lg: "px-5 py-3 text-sm rounded-xl",
};

/** Unified action button with Outfit display typography */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-display font-bold tracking-tight transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Interactive City & Sport filter pill */
export function Chip({
  active = false,
  tone = "forest",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  tone?: "forest" | "evergreen" | "gold";
}) {
  const activeStyle =
    tone === "gold"
      ? "bg-[#C8A838] text-[#0E2A20] border-[#C8A838]"
      : tone === "evergreen"
        ? "bg-[#0E2A20] text-[#C8A838] border-[#0E2A20]"
        : "bg-[#176B3A] text-white border-[#176B3A]";

  return (
    <button
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition-all cursor-pointer ${
        active
          ? `${activeStyle} shadow-sm`
          : "bg-white text-[#5C6B64] border-[#E6E7E5] hover:border-[#176B3A]/40 hover:text-[#0E2A20]"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type BadgeTone = "forest" | "gold" | "evergreen" | "alert" | "neutral";

const BADGE_TONES: Record<BadgeTone, string> = {
  forest: "bg-[#176B3A]/10 text-[#176B3A] border-[#176B3A]/20",
  gold: "bg-[#C8A838]/20 text-[#8D7216] border-[#C8A838]/35",
  evergreen: "bg-[#0E2A20] text-[#C8A838] border-[#0E2A20]",
  alert: "bg-[#E94A10]/10 text-[#E94A10] border-[#E94A10]/25",
  neutral: "bg-[#F4F5F3] text-[#5C6B64] border-[#E6E7E5]",
};

/** Semantic status pill */
export function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Interactive time-slot picker button */
export function SlotButton({
  selected = false,
  booked = false,
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  booked?: boolean;
}) {
  return (
    <button
      disabled={booked}
      className={`px-3 py-2.5 rounded-xl font-display text-xs font-bold border transition-all text-center ${
        booked
          ? "bg-[#F4F5F3] border-[#E6E7E5] text-[#5C6B64]/50 line-through cursor-not-allowed"
          : selected
            ? "bg-[#176B3A] border-[#176B3A] text-white shadow-sm cursor-pointer"
            : "bg-white border-[#E6E7E5] text-[#0E2A20] hover:border-[#176B3A] cursor-pointer"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Unified text input */
export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAF9] border border-[#E6E7E5] text-xs sm:text-sm text-[#0E2A20] placeholder-[#5C6B64]/70 focus:outline-none focus:border-[#176B3A] focus:bg-white transition-colors ${className}`}
      {...props}
    />
  );
}

/** Tactile switch for Admin/Caretaker pitch controls */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label || "Toggle"}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer shrink-0 ${
        checked ? "bg-[#176B3A] justify-end" : "bg-[#D1D5D3] justify-start"
      }`}
    >
      <span className="w-5 h-5 rounded-full bg-white shadow-sm block" />
    </button>
  );
}

/** Hand-drawn tactical line-art empty state */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  illustration = "pitch",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: "pitch" | "ticket" | "trophy";
}) {
  return (
    <Card className="p-10 text-center flex flex-col items-center justify-center">
      {illustration === "pitch" && (
        <svg
          width="140"
          height="84"
          viewBox="0 0 160 96"
          fill="none"
          className="mb-3"
          aria-hidden="true"
        >
          <path
            d="M18 76 L34 26 L126 26 L142 76"
            stroke="#0E2A20"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#176B3A"
            fillOpacity="0.1"
          />
          <path
            d="M34 26 L44 58 L116 58 L126 26"
            stroke="#0E2A20"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line x1="10" y1="76" x2="150" y2="76" stroke="#0E2A20" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="80" cy="60" r="11" fill="#C8A838" stroke="#0E2A20" strokeWidth="2.5" />
          <path d="M128 16 L132 10 M136 20 L143 18" stroke="#C8A838" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
      {illustration === "ticket" && (
        <svg
          width="140"
          height="84"
          viewBox="0 0 160 96"
          fill="none"
          className="mb-3"
          aria-hidden="true"
        >
          <path
            d="M22 24 H138 V40 A8 8 0 0 0 138 56 V72 H22 V56 A8 8 0 0 0 22 40 Z"
            fill="#176B3A"
            fillOpacity="0.08"
            stroke="#0E2A20"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="56" y1="26" x2="56" y2="70" stroke="#0E2A20" strokeWidth="1.75" strokeDasharray="4 4" />
          <rect x="68" y="36" width="52" height="7" rx="3.5" fill="#176B3A" fillOpacity="0.25" />
          <rect x="68" y="50" width="36" height="6" rx="3" fill="#5C6B64" fillOpacity="0.25" />
          <circle cx="39" cy="48" r="8" fill="#C8A838" stroke="#0E2A20" strokeWidth="2.2" />
          <path d="M132 14 L136 9 M141 18 L147 16" stroke="#C8A838" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
      {illustration === "trophy" && (
        <svg
          width="140"
          height="84"
          viewBox="0 0 160 96"
          fill="none"
          className="mb-3"
          aria-hidden="true"
        >
          <path
            d="M54 22 H106 V44 C106 58 94 66 80 66 C66 66 54 58 54 44 Z"
            fill="#C8A838"
            fillOpacity="0.28"
            stroke="#0E2A20"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M54 28 H40 C40 42 46 48 54 48" stroke="#0E2A20" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M106 28 H120 C120 42 114 48 106 48" stroke="#0E2A20" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="80" y1="66" x2="80" y2="78" stroke="#0E2A20" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="62" y="78" width="36" height="7" rx="3.5" fill="#176B3A" stroke="#0E2A20" strokeWidth="2.2" />
          <path d="M36 16 L40 10 M122 14 L126 9 M129 20 L136 18" stroke="#C8A838" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
      <h3 className="text-base font-display font-bold text-[#0E2A20]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#5C6B64] mt-1 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
