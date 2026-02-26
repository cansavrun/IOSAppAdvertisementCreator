export function EmptyCanvas() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">
        Your canvas is empty
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        Start creating by describing what you want in the chat panel on the
        left. Your generated images, videos, and screenshots will appear here.
      </p>
    </div>
  );
}
