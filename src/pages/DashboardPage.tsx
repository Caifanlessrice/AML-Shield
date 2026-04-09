import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { KpiRow } from '../components/dashboard/KpiRow';
import { RecentAlertsFeed } from '../components/dashboard/RecentAlertsFeed';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { AlertTrendChart } from '../components/charts/AlertTrendChart';
import { SarPipelineChart } from '../components/charts/SarPipelineChart';
import { GeoRiskMap } from '../components/charts/GeoRiskMap';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Risk Overview</h1>
          <p className="text-sm text-text-secondary mt-1">Real-time AML compliance monitoring and alert management</p>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp}>
            <KpiRow />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={fadeUp}>
              <RiskDistributionChart />
            </motion.div>
            <motion.div variants={fadeUp}>
              <AlertTrendChart />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={fadeUp}>
              <SarPipelineChart />
            </motion.div>
            <motion.div variants={fadeUp}>
              <GeoRiskMap />
            </motion.div>
          </div>

          <motion.div variants={fadeUp}>
            <RecentAlertsFeed />
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
