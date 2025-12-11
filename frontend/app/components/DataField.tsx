const colorMap = {
  user: {
    color: "text-green-600",
    border: "border-green-600",
  },
  computer: {
    color: "text-yellow-500",
    border: "border-yellow-500",
  },
  group: {
    color: "text-blue-600",
    border: "border-blue-600",
  },
};

const DataField = ({
  title,
  data,
  type,
}: {
  title: string;
  data: string;
  type: "user" | "computer" | "group";
}) => {
  return (
    <div className="flex flex-col col-span-full">
      <p className={`font-bold ${colorMap[type].color}`}>{title}:</p>
      <p className={`p-6 border rounded-lg ${colorMap[type].border}`}>{data ?? "-"}</p>
    </div>
  );
};

export default DataField;
