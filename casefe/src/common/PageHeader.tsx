export const PageHeader = ({
  heading,
  description,
}: {
  heading: string;
  description?: string;
}) => {
  return (
    <>
      <h1 className="text-black text-2l font-bold ">{heading}</h1>
      <h1>{description}</h1>
    </>
  );
};
