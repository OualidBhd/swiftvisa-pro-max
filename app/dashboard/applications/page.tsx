import ApplicationsTable from '@/components/ApplicationsTable';

export default function ApplicationsPage() {
  const userId = 'demo-user-id';

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-[#1F2D5A]">Visa Applications</h1>
      <ApplicationsTable userId={userId} />
    </div>
  );
}