import React from "react";

interface SkeletonLoaderProps {
  type?: "table" | "card" | "chart";
  rows?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "table",
  rows = 5,
}) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-2xl w-full"></div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-2xl animate-pulse flex items-end p-8 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 w-full rounded-t-lg"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse bg-gray-200 rounded-lg w-full h-10"></div>
  );
};

export default SkeletonLoader;
