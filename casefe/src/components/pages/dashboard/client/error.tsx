export function DashboardError({ message }: { message?: string }) {
  return (
    <div className="m-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
      {message ?? "Failed to load dashboard data. Please try again."}
    </div>
  );
}
