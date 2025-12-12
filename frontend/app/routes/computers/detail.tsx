import { createColumnHelper } from "@tanstack/react-table";
import { Computer } from "lucide-react";
import { useParams } from "react-router";
import { useComputerDetail } from "~/hooks/fetchData";
import type { AclEntry } from "~/types";
import DataField from "~/components/DataField";
import DataTable from "~/components/DataTable";
import PageHeader from "~/components/PageHeader";
import TableSkeleton from "~/components/TableSkeleton";

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

const ComputerDetail = () => {
  // get distinguished name from url
  const { dn } = useParams<{ dn: string }>();
  // get computer detail datas by dn
  const { data, isLoading, error } = useComputerDetail(dn);

  // error state
  if (error) {
    return <div>Hata: {(error as Error).message}</div>;
  }

  return (
    <div className="p-8 border rounded-lg border-yellow-500">
      {/* computer details */}
      <PageHeader title="Bilgisayar Detayları" />
      <div className="my-6 p-20 border rounded-xl text-3xl grid grid-cols-12 gap-6 border-yellow-500">
        <div className="col-span-2 flex justify-center items-center text-yellow-500 bg-yellow-50 rounded-xl">
          <Computer size={160} strokeWidth={1} />
        </div>
        <div className="col-span-10 flex flex-col gap-6">
          {/* display computer distinguished name */}
          <DataField
            title="DN"
            data={data?.distinguished_name || "-"}
            type="computer"
          />

          {/* display computer operating system */}
          <DataField
            title="OS"
            data={data?.operating_system || "-"}
            type="computer"
          />
        </div>

        {/* display computer object sid */}
        <DataField
          title="Object SID"
          data={data?.object_sid || "-"}
          type="computer"
        />

        {/* display computer create date */}
        <DataField
          title="Create Date"
          data={data?.when_created || "-"}
          type="computer"
        />
      </div>

      {/* computer acl list */}
      <PageHeader title="ACL Listesi" />
      {!isLoading ? (
        data?.incoming_acls ? (
          // display computer acl list
          <DataTable
            columns={columns}
            data={data.incoming_acls || []}
            type="computer"
          />
        ) : (
          // if there is no acl
          <div className="my-6 p-20 border rounded-xl text-3xl text-center border-yellow-500">
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

export default ComputerDetail;
