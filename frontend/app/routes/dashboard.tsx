import PageHeader from "~/components/PageHeader";
import StatisticCard from "~/components/StatisticCard";
import { useDashboardStats } from "~/hooks/fetchData";

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  return (
    <div>
      <PageHeader title="AD Scanner Dashboard" />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatisticCard
          title="Kullanıcı"
          type="user"
          count={stats?.users || 0}
        />
        <StatisticCard
          title="Bilgisayar"
          type="computer"
          count={stats?.computers || 0}
        />
        <StatisticCard
          title="Grup"
          type="group"
          count={stats?.groups || 0}
        />
      </div>
    </div>
  );
};

export default Dashboard;
