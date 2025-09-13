export default function NotificationsLoading() {
  return (
    <div className="p-6">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="space-y-2">
        <div className="h-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-24 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}


