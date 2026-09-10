import MainLayout from "@/components/layout/MainLayout";
import { DashboardContent } from "@/components/dashboard/Dashboard";
import "@/styles/dashboard/dashboard.css";

export default function Dashboard() {
  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  );
}
