'use client';

interface ApplicationCardProps {
  title: string;
  status: string;
  progress: number;
}

export default function ApplicationCard({ title, status, progress }: ApplicationCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{status}</p>
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}