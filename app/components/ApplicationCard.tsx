'use client';

interface ApplicationCardProps {
  title: string;
  status: string;
  percent: number;
}

export default function ApplicationCard({ title, status, percent }: ApplicationCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-sm text-gray-500 mb-1">{status}</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}