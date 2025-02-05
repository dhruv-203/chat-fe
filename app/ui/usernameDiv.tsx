import React from "react";

function UsernameDiv({
  className,
  children,
  isActive,
}: {
  className: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <div
      className={`text-lg flex line-clamp-1 shrink-1 items-center justify-center gap-3 font-semibold text-white ${className}`}
    >
      {children}
      {isActive ? (
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
      ) : (
        <div className="h-2 w-2 rounded-full bg-red-500"></div>
      )}
    </div>
  );
}

export default UsernameDiv;
