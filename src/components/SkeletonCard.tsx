const SkeletonCard = () => {
  return (
    <div className="card bg-base-100 w-80 sm:w-96 shadow-xl animate-pulse">
      {/* Image Skeleton */}
      <div className="px-6 pt-6">
        <div className="rounded-xl h-72 w-full bg-gray-300" />
      </div>

      <div className="card-body items-center text-center">
        {/* Name */}
        <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>

        {/* Age */}
        <div className="h-4 w-20 bg-gray-300 rounded mb-4"></div>

        {/* Skills badges */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-14 bg-gray-300 rounded-full"></div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
