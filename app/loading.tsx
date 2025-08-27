import { Layout, Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Layout className="h-8 w-8 text-blue-600 mr-3" />
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Wireframe</h2>
        <p className="text-gray-600">Building your website wireframe...</p>
      </div>
    </div>
  )
}