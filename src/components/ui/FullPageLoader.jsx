export default function FullPageLoader() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}
