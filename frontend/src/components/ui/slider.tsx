"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

interface SliderProps extends React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> {
  showTooltip?: boolean;
  formatTooltip?: (value: number) => string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showTooltip = true, formatTooltip, ...props }, ref) => {
  const initialValue = Array.isArray(props.value)
    ? props.value
    : Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [props.min ?? 0];

  const [currentValues, setCurrentValues] =
    React.useState<number[]>(initialValue);

  // Đồng bộ giá trị khi prop value từ bên ngoài thay đổi
  React.useEffect(() => {
    if (Array.isArray(props.value)) {
      setCurrentValues(props.value);
    }
  }, [props.value]);

  const handleValueChange = (newValues: number[]) => {
    setCurrentValues(newValues);
    props.onValueChange?.(newValues);
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
      onValueChange={handleValueChange}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>

      {/* Render từng nút kéo tương ứng với số lượng giá trị */}
      {currentValues.map((val, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="relative block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {showTooltip && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-[11px] font-medium text-primary-foreground shadow select-none whitespace-nowrap">
              {formatTooltip ? formatTooltip(val) : val}
            </span>
          )}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
