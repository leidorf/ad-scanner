import { createColumnHelper } from "@tanstack/react-table";
import { Boxes } from "lucide-react";
import { useParams } from "react-router";
import DataField from "~/components/DataField";
import DataTable from "~/components/DataTable";
import PageHeader from "~/components/PageHeader";
import { useGroupDetail } from "~/hooks/fetchData";
import type { AclEntry } from "~/types";

const columnHelper = createColumnHelper<AclEntry>();

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

const GroupDetail = () => {
  const { dn } = useParams<{ dn: string }>();
  const { data, isLoading, error } = useGroupDetail(dn);

  return (
    <div className="p-8 border rounded-lg border-blue-600">
      <PageHeader title="Grup Detayları" />
      <div className="my-6 p-20 border rounded-xl text-3xl grid grid-cols-12 gap-6 border-blue-600">
        <div className="col-span-2 flex justify-center items-center text-blue-600 bg-blue-100 rounded-xl">
          <Boxes size={160} strokeWidth={1} />
        </div>
        <div className="col-span-10 flex flex-col gap-6">
          <DataField
            title="DN"
            data={data?.distinguished_name || "-"}
            type="group"
          />
          <DataField title="OS" data={data?.description || "-"} type="group" />
        </div>
        <DataField
          title="Object SID"
          data={data?.object_sid || "-"}
          type="group"
        />
        <DataField
          title="Create Date"
          data={data?.when_created || "-"}
          type="group"
        />
      </div>

      <PageHeader title="ACL Listesi" />
      {data?.incoming_acls ? (
        <DataTable
          columns={columns}
          data={data.incoming_acls || []}
          type="group"
        />
      ) : (
        <div className="my-6 p-20 border rounded-xl text-3xl text-center border-blue-600">
          <p>ACL bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
