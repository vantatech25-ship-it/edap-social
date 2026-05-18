import Sidebar from "@/components/Sidebar";

export default function Profile({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1">
        <div className="w-full h-48 bg-slate-200"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-24 flex items-end gap-5">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-300"></div>
            <div className="mb-4 flex-1 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold truncate">User {params.id}</h1>
                <p className="text-slate-500">@user_{params.id}</p>
              </div>
              <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-black/90">Follow</button>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold mb-2">Intro</h3>
                <p className="text-sm text-slate-600">Transforming South African talent via AI coaching. #EDAP</p>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-4">
               {/* User's Posts Placeholder */}
               <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4 text-center py-12">
                  <p className="text-sm text-slate-500">No posts yet.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
