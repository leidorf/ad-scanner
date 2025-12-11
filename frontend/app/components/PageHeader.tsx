const PageHeader = ({ title, count }: { title: string; count?: number }) => {
  return (
    <h1 className="text-center font-bold text-5xl">
      {title} {count !== undefined ? ` (${count})` : ""}
    </h1>
  );
};

export default PageHeader;
