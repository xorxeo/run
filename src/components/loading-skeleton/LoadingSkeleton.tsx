import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
      </div>
      {/* <div className="w-40 h-4 bg-gray-300 mb-2"></div>
      <div className="w-32 h-4 bg-gray-300 mb-2"></div>
      <div className="w-48 h-4 bg-gray-300 mb-2"></div> */}
    </div>
  );
};
