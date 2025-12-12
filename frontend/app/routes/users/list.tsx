import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router";
import DataTable from "~/components/DataTable";
import PageHeader from "~/components/PageHeader";
import TableSkeleton from "~/components/TableSkeleton";
import { useUserList } from "~/hooks/fetchData";
import type { AdUser } from "~/types";

const columnHelper = createColumnHelper<AdUser>();

// create columns for tanstack table
const columns = [
  columnHelper.accessor((row) => row.distinguished_name, {
    id: "distinguished_name",
    cell: (info) => (
      <Link to={`/users/${info.getValue()}`}>{info.getValue()}</Link>
    ),
    header: () => <span>Distinguished Name</span>,
  }),
  columnHelper.accessor("service_principal_name", {
    header: () => "Service Principal Name",
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

const UserList = () => {
  const { data, isLoading, error } = useUserList();

  // error state
  if (error) {
    return <div>Hata: {(error as Error).message}</div>;
  }

  return (
    <div className="p-8 border border-green-600 rounded-lg">
      <PageHeader title="Kullanıcı Listesi" count={data?.length || 0} />
      {isLoading ? (
        // display ad users
        <TableSkeleton columnCount={4} rowCount={10} />
      ) : (
        // loading state
        <DataTable columns={columns} data={data || []} type="user" />
      )}
    </div>
  );
};

export default UserList;
