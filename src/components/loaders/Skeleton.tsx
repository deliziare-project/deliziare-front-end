export const Skeleton = () => (
    <div className="animate-pulse space-y-5">
      <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-10 bg-gray-200 rounded-xl w-full" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-10 bg-gray-200 rounded-xl w-full" />
      </div>
      <div className="h-10 bg-gray-300 rounded-xl w-full" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
    </div>
  );
  