import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../../lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value); // Update internal state when prop changes
  }, [value]);

  const handleChange = (newValue: number[]) => {
    setInternalValue(newValue); // Update UI immediately
    if (onValueChange) {
      onValueChange(newValue); //Ensure API call happens
    }
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={internalValue} // Use internal state
      onValueChange={handleChange}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "cursor-pointer py-2",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 transition-all duration-200 ease-in-out" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-6 w-6 rounded-full border-2 border-indigo-500 bg-white dark:bg-gray-800 shadow-md ring-offset-background 
                   transition-all duration-200 ease-in-out hover:scale-110 active:scale-90 
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 
                   disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
