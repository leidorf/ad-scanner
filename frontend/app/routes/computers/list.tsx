import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router";
import DataTable from "~/components/DataTable";
import PageHeader from "~/components/PageHeader";
import TableSkeleton from "~/components/TableSkeleton";
import { useComputerList } from "~/hooks/fetchData";
import type { AdComputer } from "~/types";

const columnHelper = createColumnHelper<AdComputer>();

// create columns for tanstack table
const columns = [
  columnHelper.accessor((row) => row.distinguished_name, {
    id: "distinguished_name",
    cell: (info) => (
      <Link to={`/computers/${info.getValue()}`}>{info.getValue()}</Link>
    ),
    header: () => <span>Distinguished Name</span>,
  }),
  columnHelper.accessor("operating_system", {
    header: () => "Operating System",
    cell: (info) => info.renderValue() || "-",
  }),
  columnHelper.accessor("object_sid", {
    header: () => "Objet SID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("when_created", {
    header: () => "When Created",
    cell: (info) => info.renderValue(),
  }),
];

const ComputerList = () => {
  const { data, isLoading, error } = useComputerList();

  // error state
  if (error) {
    return <div>Hata: {(error as Error).message}</div>;
  }

  return (
    <div className="p-8 border border-yellow-500 rounded-lg">
      <PageHeader title="Bilgisayar Listesi" count={data?.length || 0} />
      {isLoading ? (
        // display ad computers
        <TableSkeleton columnCount={4} rowCount={10} />
      ) : (
        // loading state
        <DataTable columns={columns} data={data || []} type="computer" />
      )}
    </div>
  );
};

export default ComputerList;
