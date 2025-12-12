import { createColumnHelper } from "@tanstack/react-table";
import { User } from "lucide-react";
import { useParams } from "react-router";
import DataField from "~/components/DataField";
import DataTable from "~/components/DataTable";
import PageHeader from "~/components/PageHeader";
import TableSkeleton from "~/components/TableSkeleton";
import { useUserDetail } from "~/hooks/fetchData";
import type { AclEntry } from "~/types";

const columnHelper = createColumnHelper<AclEntry>();

// create columns for tanstack table
const columns = [
  columnHelper.accessor((row) => row.source_dn, {
    id: "source_dn",
    cell: (info) => info.renderValue() || "-",
    header: () => <span>Source DN</span>,
  }),
  columnHelper.accessor("source_type", {
    header: () => "Source Type",
    cell: (info) => info.renderValue() || "-",
  }),
  columnHelper.accessor("permission", {
    header: () => "Permission",
    cell: (info) => info.renderValue(),
  }),
];

const UserDetail = () => {
  // get distinguished name from url
  const { dn } = useParams<{ dn: string }>();
  // get user detail datas by dn
  const { data, isLoading, error } = useUserDetail(dn);

  // error state
  if (error) {
    return <div>Hata: {(error as Error).message}</div>;
  }

  return (
    <div className="p-8 border rounded-lg border-green-600">
      {/* user details */}
      <PageHeader title="Kullanıcı Detayları" />
      <div className="my-6 p-10 border rounded-xl text-xl grid grid-cols-12 gap-6 border-green-600">
        <div className="col-span-2 flex justify-center items-center text-green-600 bg-green-50 rounded-xl">
          <User size={160} strokeWidth={1} />
        </div>
        <div className="col-span-10 flex flex-col gap-4">
          {/* display user distinguished name */}
          <DataField
            title="DN"
            data={data?.distinguished_name || "-"}
            type="user"
          />

          {/* display user service principal name */}
          <DataField
            title="SPN"
            data={data?.service_principal_name || "-"}
            type="user"
          />
        </div>

        {/* display user object sid */}
        <DataField
          title="Object SID"
          data={data?.object_sid || "-"}
          type="user"
        />

        {/* display user create date */}
        <DataField
          title="Create Date"
          data={data?.when_created || "-"}
          type="user"
        />
      </div>

      {/* user acl list */}
      <PageHeader title="ACL Listesi" />
      {!isLoading ? (
        data?.incoming_acls ? (
          // display user acl list
          <DataTable
            columns={columns}
            data={data.incoming_acls || []}
            type="user"
          />
        ) : (
          // if there is no acl
          <div className="my-6 p-20 border rounded-xl text-3xl text-center border-green-600">
            <p>ACL bulunamadı.</p>
          </div>
        )
      ) : (
        // loading state
        <TableSkeleton />
      )}
    </div>
  );
};

export default UserDetail;
