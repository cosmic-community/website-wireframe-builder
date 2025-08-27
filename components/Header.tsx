import Link from 'next/link'
import { Layout, Home } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Layout className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Wireframe Builder</h1>
              <p className="text-xs text-gray-500">Section-labeled website builder</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}