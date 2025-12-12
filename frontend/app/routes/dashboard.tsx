import PageHeader from "~/components/PageHeader";
import StatisticCard from "~/components/StatisticCard";
import { useDashboardStats } from "~/hooks/fetchData";

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  // error state
  if (error) {
    return <div>Hata: {(error as Error).message}</div>;
  }

  return (
    <div className="border rounded-xl p-8">
      <PageHeader title="AD Scanner Dashboard" />
      {!isLoading ? (
        /* display active directory stats */
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <StatisticCard title="Grup" type="group" count={stats?.groups || 0} />
        </div>
      ) : (
        /* loading state */
        <div className="mt-6 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          <StatisticCard title="-" type="user" count={0} />
          <StatisticCard title="-" type="computer" count={0} />
          <StatisticCard title="-" type="group" count={0} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
