import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  type: "user" | "computer" | "group";
}

const colorMap = {
  user: {
    color: "text-green-600",
    border: "border-green-600",
    bg: "bg-green-50",
  },
  computer: {
    color: "text-yellow-500",
    border: "border-yellow-500",
    bg: "bg-yellow-50",
  },
  group: {
    color: "text-blue-600",
    border: "border-blue-600",
    bg: "bg-blue-50",
  },
};

// display datas on tanstacktable based on ad object type colors
const DataTable = <TData, TValue>({
  data,
  columns,
  type,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="border p-6 mt-6 rounded-2xl w-full text-2xl table-auto">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={`border p-4 ${colorMap[type].color} ${colorMap[type].bg}`}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index) => (
          <tr
            key={row.id}
            className={` ${index % 2 !== 0 ? colorMap[type].bg : "bg-white"}`}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={`border p-4 ${colorMap[type].border}`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
