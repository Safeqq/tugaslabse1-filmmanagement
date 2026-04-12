export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-800 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-600 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
      </div>
    </div>
  );
}
