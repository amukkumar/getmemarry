import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

const Autocomplete = React.forwardRef(({ options, value, onChange = () => { }, className, ...props }, ref) => {
    const [showOptions, setShowOptions] = useState(false);
    const [cursor, setCursor] = useState(-1);
    const inputRef = useRef();
    const optionsListRef = useRef(null);

    const select = useCallback((option) => {
        onChange(option);
        setShowOptions(false);
    }, [onChange]);

    const filteredOptions = useMemo(() => options.filter(option => option.toLowerCase().includes(value.toLowerCase())), [options, value]);

    const handleChange = useCallback((text) => {
        onChange(text);
        setCursor(-1);
        if (!showOptions) {
            setShowOptions(true);
        }
    }, [onChange, showOptions]);

    const moveCursorDown = useCallback(() => {
        if (cursor < filteredOptions.length - 1) {
            setCursor(c => c + 1);
        }
    }, [cursor, filteredOptions.length]);

    const moveCursorUp = useCallback(() => {
        if (cursor > 0) {
            setCursor(c => c - 1);
        }
    }, [cursor]);

    const handleNav = useCallback((e) => {
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                moveCursorUp();
                break;
            case "ArrowDown":
                e.preventDefault();
                moveCursorDown();
                break;
            case "Enter":
                if (cursor >= 0 && cursor < filteredOptions.length) {
                    select(filteredOptions[cursor]);
                }
                break;
            default:
                break;
        }
    }, [moveCursorUp, moveCursorDown, cursor, filteredOptions, select]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Ensure selected option is in view when cursor changes
        if (optionsListRef.current && cursor >= 0) {
            const list = optionsListRef.current;
            const selectedOption = list.children[cursor];
            if (selectedOption) {
                const top = selectedOption.offsetTop;
                const height = selectedOption.offsetHeight;
                const listHeight = list.offsetHeight;
                const scrollTop = list.scrollTop;

                if (top < scrollTop) {
                    list.scrollTop = top;
                } else if (top + height > scrollTop + listHeight) {
                    list.scrollTop = top + height - listHeight;
                }
            }
        }
    }, [cursor, filteredOptions]);

    return (
        <div className={cn("relative text-[14px]", className)} ref={ref}>
            <input
                type="text"
                className={cn(
                    "w-full border border-input shadow-sm px-3 py-[6px] outline-none rounded-md placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                value={value}
                onChange={e => handleChange(e.target.value)}
                onFocus={() => setShowOptions(filteredOptions.length > 0 ? true : false)}
                onKeyDown={handleNav}
                ref={inputRef}
                {...props}
            />
            {showOptions && (
                <ul
                    className="absolute w-full mt-1 border bg-white rounded-lg shadow-lg z-10 select-none max-h-56 overflow-y-auto"
                    ref={optionsListRef}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, i) => {
                            let optionClassName = "px-4 hover:bg-gray-100 cursor-pointer";

                            if (i === 0)
                                optionClassName += " pt-2 pb-1 rounded-t-lg";
                            else if (i === filteredOptions.length - 1)
                                optionClassName += " pt-1 pb-2 rounded-b-lg";
                            else
                                optionClassName += " py-1";

                            if (cursor === i) {
                                optionClassName += " bg-gray-100";
                            }

                            return (
                                <li
                                    className={optionClassName}
                                    key={option}
                                    onClick={() => select(option)}
                                >
                                    {option}
                                </li>
                            );
                        })
                    ) : (
                        ""
                    )}
                </ul>
            )}
        </div>
    );
});

Autocomplete.displayName = "Autocomplete";

export { Autocomplete };
