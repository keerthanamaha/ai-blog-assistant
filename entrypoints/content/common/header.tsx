export default function Header({
  title,
  count,
  onRemove,
}: {
  title: string;
  count: number;
  onRemove: () => void;
}) {
  return (
    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">
        {title}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          ({count})
        </span>
      </h2>
      <div className="flex items-center space-x-2">
        <button
          onClick={onRemove}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
