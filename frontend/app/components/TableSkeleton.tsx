// display this for better ux while datas loading 
const TableSkeleton = ({
  rowCount = 5,
  columnCount = 4,
}: {
  rowCount?: number;
  columnCount?: number;
}) => {
  return (
    <table className="border p-6 mt-6 rounded-2xl w-full text-2xl table-auto animate-pulse">
      <thead>
        <tr>
          {Array.from({ length: columnCount }).map((_, index) => (
            <th key={index} className="border p-4">
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 !== 0 ? "bg-zinc-50" : "bg-white"}>
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <td key={colIndex} className="border p-4">
                <div className="h-6 bg-gray-200 rounded w-full"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;