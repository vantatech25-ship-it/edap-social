import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="mr-4 flex">
          <Link href="/feed" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">EDAP Social</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <input
              type="search"
              placeholder="Search..."
              className="h-9 md:w-[300px] lg:w-[400px] rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
            />
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Link href="/register" className="text-sm font-medium hover:underline bg-black text-white px-3 py-1.5 rounded-md">
              Register
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
