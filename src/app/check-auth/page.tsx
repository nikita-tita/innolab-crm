"use client"

import { useSession } from "next-auth/react"

export default function CheckAuthPage() {
  const { data: session, status } = useSession()

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Auth Check</h1>

      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>

        {session && (
          <div className="space-y-2">
            <div><strong>User ID:</strong> {session.user?.id}</div>
            <div><strong>Name:</strong> {session.user?.name}</div>
            <div><strong>Email:</strong> {session.user?.email}</div>
            <div><strong>Role:</strong> {session.user?.role}</div>
            <div><strong>Is Admin:</strong> {session.user?.role === 'ADMIN' ? 'Yes' : 'No'}</div>
            <div><strong>Can Access Admin:</strong> {(session.user?.role === 'ADMIN' || session.user?.role === 'LAB_DIRECTOR') ? 'Yes' : 'No'}</div>
          </div>
        )}

        {!session && status !== 'loading' && (
          <div className="text-red-600">
            No session found. Please login first.
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Test Links:</h2>
          <div className="space-y-2">
            <div><a href="/admin" className="text-blue-600 hover:underline">/admin</a></div>
            <div><a href="/admin/users" className="text-blue-600 hover:underline">/admin/users</a></div>
            <div><a href="/auth/login" className="text-blue-600 hover:underline">/auth/login</a></div>
            <div><a href="/dashboard" className="text-blue-600 hover:underline">/dashboard</a></div>
          </div>
        </div>
      </div>
    </div>
  )
}