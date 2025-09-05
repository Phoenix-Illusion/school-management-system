import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-white to-blue-200 flex items-center justify-center">
      <div className="max-w-4xl bg-white bg-opacity-80 rounded-xl shadow-lg p-12 text-center">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-6">
          School Management System
        </h1>
        <p className="text-2xl text-blue-700 mb-10">
          Manage school information with ease
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            href="/addSchool" 
            className="btn-primary inline-block text-center min-w-48"
          >
            Add New School
          </Link>
          <Link 
            href="/showSchools" 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block text-center min-w-48"
          >
            View All Schools
          </Link>
        </div>
      </div>
    </div>
  );
}
