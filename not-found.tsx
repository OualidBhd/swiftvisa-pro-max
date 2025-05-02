export default function NotFound() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-center px-4">
        <div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }