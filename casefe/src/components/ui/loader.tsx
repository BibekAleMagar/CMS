const Loader = ({
  size = "medium",
}: {
  size?: "small" | "medium" | "large";
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin m-auto`}>
      <div className="h-full w-full border-4 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent rounded-full"></div>
    </div>
  );
};
export default Loader;
