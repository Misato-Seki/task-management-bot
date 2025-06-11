export default function Dashboard() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F7F8]">
        <div className="w-[410px] bg-white rounded-lg shadow-lg border border-[#5093B4] p-10 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-[#5093B4] mb-2">Dashboard</h1>
            <p className="text-base text-gray-700">Welcome to my dashboard!</p>
            {/* Add more dashboard content here */}
        </div>
        </div>
    );
    }