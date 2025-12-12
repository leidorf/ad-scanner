import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router";
import DataTable from "~/components/DataTable";
import PageHeader from "~/components/PageHeader";
import TableSkeleton from "~/components/TableSkeleton";
import { useGroupList } from "~/hooks/fetchData";
import type { AdGroup } from "~/types";

const columnHelper = createColumnHelper<AdGroup>();

// create columns for tanstack table
const columns = [
  columnHelper.accessor((row) => row.distinguished_name, {
    id: "distinguished_name",
    cell: (info) => (
      <Link to={`/groups/${info.getValue()}`}>{info.getValue()}</Link>
    ),
    header: () => <span>Distinguished Name</span>,
  }),
  columnHelper.accessor("description", {
    header: () => "Description",
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

const GroupList = () => {
  const { data, isLoading, error } = useGroupList();

  // error state
  if (error) {
    return <div>Hata: {(error as Error).message}</div>;
  }

  return (
    <div className="p-8 border border-blue-600 rounded-lg">
      <PageHeader title="Grup Listesi" count={data?.length || 0} />
      {isLoading ? (
        // display ad groups
        <TableSkeleton columnCount={4} rowCount={10} />
      ) : (
        // loading state
        <DataTable columns={columns} data={data || []} type="group" />
      )}
    </div>
  );
};

export default GroupList;
