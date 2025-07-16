import { Search as SearchIcon } from "lucide-react";
import React, { JSX } from "react";

export default function Search({
  handleSearch,
}: {
  handleSearch: (searchQuery: string) => void;
}): JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleButtonClick = () => {
    handleSearch(searchQuery);
  };

  return (
    <div className="p-4 border-b border-border flex items-center">
      <div className="flex items-center w-full space-x-2">
        <input
          type="text"
          className="w-10/12 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground dark:bg-gray-800 dark:text-white"
          placeholder="Ask anything..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleButtonClick();
            }
          }}
        />
        <button
          onClick={handleButtonClick}
          className="w-2/12 py-2 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <SearchIcon className="h-4 w-4 mr-2 text-muted-foreground" />{" "}
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
