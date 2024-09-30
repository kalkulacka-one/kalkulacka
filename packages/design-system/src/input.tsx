import { InputHTMLAttributes, forwardRef } from "react";
import cn from "classnames";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input type={type} className={cn("", className)} ref={ref} {...props} />
    );
  },
);
Input.displayName = "Input";

const InputWithIcon = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn("", icon ? "pl-10" : "")}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "InputWithIcon";

export { Input, InputWithIcon };
