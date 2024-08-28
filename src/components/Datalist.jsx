import { useState, useRef } from "react";
import { Input } from "./Input";
import { cn } from "../utils/cn";

const CustomOptions = ({ data, className, setInputValue, closeDropdown }) => {
  const handleClick = (key, value) => {
    setInputValue((prev) => {
      const allWords = prev.split(" ");

      return allWords
        .map((word) => (word.startsWith("\\") && key.toLowerCase().includes(word.toLowerCase()) ? value : word))
        .join(" ");
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-md border-[1px] border-white bg-main text-white shadow-lg",
        className,
      )}
    >
      {data.slice(0, 10).map((item, index) => (
        <button
          key={index}
          className={cn(
            "flex items-center justify-between px-2 py-2 text-xs transition-colors duration-150 hover:bg-background",
            index > 0 && "border-t border-gray-700",
          )}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevents focus loss
            handleClick(item[0], item[1]);
            closeDropdown(); // Close dropdown after selection
          }}
        >
          <span className="font-semibold">{item[0]}</span>
          <span className="text-gray-300">{item[1]}</span>
        </button>
      ))}
    </div>
  );
};

const CustomDataList = ({ id, data, className, ...props }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef(null); // Reference to the input field

  const handleFilter = (e) => {
    const inputValue = e.target.value;

    setIsFocused(true);
    setInputValue(inputValue);

    // Break down the search into smaller parts by " "
    const lowerInputValue = inputValue.toLowerCase().split(" ");

    let filtered = [];

    lowerInputValue.forEach((word) => {
      let auxData = Object.entries(data).filter(([key, _]) => {
        const lowerKey = key.toLowerCase();

        return word.length > 1 && word.startsWith("\\") && lowerKey.includes(word);
      });

      filtered.push(...auxData);
    });

    setFilteredData(filtered);
  };

  const closeDropdown = () => {
    setIsFocused(false);
  };

  return (
    <div className={cn("relative flex flex-col gap-2", className)} tabIndex={0}>
      {isFocused && filteredData.length > 0 && (
        <CustomOptions
          data={filteredData}
          className="absolute bottom-10 w-full"
          setInputValue={setInputValue}
          closeDropdown={closeDropdown}
        />
      )}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleFilter(e)}
        id={id}
        className="text-md py-1"
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          // Delay closing dropdown to allow item selection
          setTimeout(() => {
            if (!inputRef.current.contains(document.activeElement)) {
              closeDropdown();
            }
          }, 150);
        }}
        {...props}
      />
    </div>
  );
};

export { CustomDataList, CustomOptions };
