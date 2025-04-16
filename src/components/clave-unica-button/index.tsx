import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ClaveUnicaIcon } from "./clave-unica-icon";

const claveUnicaButtonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap text-base font-bold ring-offset-background cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#FFBE5C] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#0F69C4] text-white hover:bg-[#0B4E91] active:bg-[#07305A]",
        highContrast:
          "bg-[#625AF6] text-white hover:bg-[#4943B6] active:bg-[#2D2971] focus-visible:ring-[#D8D7FA]",
      },
      size: {
        default: "h-[calc(2rem+16px)] px-[14px] py-4",
        lg: "h-11 px-8 w-full",
      },
      border: {
        none: "rounded-none",
        rounded: "rounded-md",
        oval: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      border: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof claveUnicaButtonVariants> {
  asChild?: boolean;
  label?: "Iniciar sesión" | "ClaveÚnica";
}

const ClaveUnicaButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      border,
      asChild = false,
      label = "Iniciar sesión",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          claveUnicaButtonVariants({ variant, size, border, className })
        )}
        ref={ref}
        {...props}
        aria-label={
          label === "Iniciar sesión"
            ? "Iniciar sesión con ClaveÚnica"
            : "Continuar con ClaveÚnica"
        }
      >
        <ClaveUnicaIcon />
        {label}
      </Comp>
    );
  }
);
ClaveUnicaButton.displayName = "ClaveUnicaButton";

export { ClaveUnicaButton, claveUnicaButtonVariants };
