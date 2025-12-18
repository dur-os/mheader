import { Input, InputProps } from "@heroui/input";

interface CustomInputProps extends Omit<InputProps, 'size' | 'variant'> {
    size?: InputProps['size'];
    variant?: InputProps['variant'];
}

export const CustomInput = ({
    size = "sm",
    variant = "underlined",
    color = "secondary",
    classNames,
    onFocus,
    ...props
}: CustomInputProps) => {
    const defaultClassNames = {
        input: `font-mono text-tiny`,
        inputWrapper: "h-8 min-h-0 py-0"
    };

    const mergedClassNames = {
        ...defaultClassNames,
        ...classNames,
        input: classNames?.input
            ? `${defaultClassNames.input} ${classNames.input}`
            : defaultClassNames.input,
        inputWrapper: classNames?.inputWrapper
            ? `${defaultClassNames.inputWrapper} ${classNames.inputWrapper}`
            : defaultClassNames.inputWrapper
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
        onFocus?.(e);
    };

    return (
        <Input
            size={size}
            variant={variant}
            color={color}
            classNames={mergedClassNames}
            onFocus={handleFocus}
            {...props}
        />
    );
};
