import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./form";
import { cn } from "@/src/lib/utils";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import Image from "next/image";
import { Eye, EyeOff, File } from "lucide-react";

// ✅ Custom Toggle Switch
const SwitchElement = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`${
        checked ? "bg-blue-600" : "bg-gray-300"
      } relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
      <span
        className={`${
          checked ? "translate-x-5" : "translate-x-0"
        } inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

const InputElement = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
InputElement.displayName = "Input";

interface InputProps<TFieldValues extends FieldValues>
  extends React.ComponentProps<"input"> {
  name: Path<TFieldValues>;
  type?: React.HTMLInputTypeAttribute | "switch";
  label?: string;
  placeholder?: string;
  showPreview?: boolean;
  required?: boolean;
}

const Input = <TFieldValues extends FieldValues>({
  label,
  placeholder,
  name,
  type,
  showPreview = false,
  required = false,
  ...props
}: InputProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isSwitch = type === "switch";
  const formInstance = useFormContext<TFieldValues>();

  return (
    <FormField
      control={formInstance.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            {type === "file" ? (
              <InputFileElement
                name={name}
                showPreview={showPreview}
                // Convert form value to array for previews

                //@ts-expect-error ram has to fix this
                value={
                  Array.isArray(field.value)
                    ? field.value
                    : field.value
                    ? [field.value]
                    : []
                }
                onFilesChange={(files) => {
                  // Convert back to original format
                  if (props.multiple) {
                    field.onChange(files);
                  } else {
                    field.onChange(files.length > 0 ? files[0] : null);
                  }
                }}
                multiple={props.multiple}
                {...props}
              />
            ) : isSwitch ? (
              <div className="mt-1">
                <SwitchElement
                  checked={!!field.value}
                  onChange={() => field.onChange(!field.value)}
                />
              </div>
            ) : (
              <div className="relative">
                <InputElement
                  type={
                    isPassword ? (showPassword ? "text" : "password") : type
                  }
                  placeholder={placeholder}
                  {...field}
                  {...props}
                />
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            )}
          </FormControl>
          <FormMessage className="text-xs text-destructive" />
        </FormItem>
      )}
    />
  );
};
export { Input, InputElement };

interface InputFileElementProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  name: string;
  value?: File[];
  onFilesChange: (files: File[]) => void;
  showPreview?: boolean;
}

export const InputFileElement = React.forwardRef<
  HTMLInputElement,
  InputFileElementProps
>(
  (
    {
      className,
      value = [],
      onFilesChange,
      showPreview = true,
      multiple = true,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newFiles = Array.from(files);
      let updatedFiles: File[];

      if (multiple) {
        // Merge files and remove duplicates
        updatedFiles = [...value, ...newFiles].filter(
          (file, index, self) =>
            index ===
            self.findIndex(
              (f) =>
                f.name === file.name &&
                f.size === file.size &&
                f.type === file.type
            )
        );
      } else {
        updatedFiles = newFiles.length > 0 ? [newFiles[0]] : [];
      }

      onFilesChange(updatedFiles);
      if (inputRef.current) inputRef.current.value = ""; // Reset input
    };

    const handleRemove = (index: number) => {
      const updatedFiles = value.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
    };

    return (
      <div className="space-y-2">
        <input
          type="file"
          multiple={multiple}
          title="choose"
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          onChange={handleChange}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          {...props}
        />

        {value.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {value.length} file(s) selected
          </p>
        )}

        {showPreview && value.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-4">
            {value.map((file, index) => {
              const fileUrl = URL.createObjectURL(file);
              return (
                <div key={`${file.name}-${index}`} className="relative w-32">
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={fileUrl}
                      alt={file.name}
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-md object-contain"
                      onLoad={() => URL.revokeObjectURL(fileUrl)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 w-32 rounded-md bg-gray-200">
                      <File className="h-8 w-8 text-gray-500" />
                      <p className="text-xs text-gray-500 truncate w-28 text-center">
                        {file.name}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    title="Remove file"
                    className="absolute top-1 right-1 rounded-full bg-red-600 text-white w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
InputFileElement.displayName = "InputFileElement";
