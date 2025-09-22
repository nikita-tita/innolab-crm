export default function DebugPage() {
  const timestamp = new Date().toISOString()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <div className="space-y-2">
        <p><strong>Build Time:</strong> {timestamp}</p>
        <p><strong>Admin Pages:</strong> Should be available at /admin</p>
        <p><strong>Login:</strong> admin@innolab.com / admin2024</p>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Available Routes:</h2>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>/admin - Admin Dashboard</li>
            <li>/admin/users - User Management</li>
            <li>/admin/fields - Field Configuration</li>
            <li>/admin/database - Database Management</li>
            <li>/auth/login - Login Page</li>
          </ul>
        </div>
      </div>
    </div>
  )
}