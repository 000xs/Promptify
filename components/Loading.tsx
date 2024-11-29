import { Loader2 } from 'lucide-react'

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-50">
      <div className="text-center flex flex-col  items-center">
        <Loader2 className="h-16 w-16 animate-spin text-emerald-600" />
        <h2 className="mt-4 text-xl font-semibold text-emerald-800">Loading...</h2>
        <p className="mt-2 text-sm text-emerald-600">Please wait while we prepare your experience</p>
      </div>
    </div>
  )
}

