import { ProMetricsCards } from '../components/pro/ProMetricsCards';
import { ProMiniChart } from '../components/pro/ProMiniChart';
import { ProStablecoinTable } from '../components/pro/ProStablecoinTable';

export function ProDashboardPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <ProMetricsCards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <ProMiniChart />
        </div>
        <div className="xl:col-span-2">
          <ProStablecoinTable />
        </div>
      </div>
    </div>
  );
}
