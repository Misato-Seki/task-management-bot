export default function Task () {
    return (
        <section className="bg-[#A2D2E2] rounded-2xl p-6 w-full flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-white">Task</h2>
            {/* Task 1 */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-4">
                <input type="checkbox" className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]" />
                <span>Buy toilet paper</span>
            </div>
            {/* Task 2 */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-4">
                <input type="checkbox" checked className="accent-[#F9C8C9] w-5 h-5 rounded border-2 border-[#49454F]" readOnly />
                <span>Organize desk drawer</span>
            </div>
            {/* Task 3 (with subtasks) */}
            <div className="bg-white rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span>Develop Task Bot</span>
                    <span className="text-[#5093B4] cursor-pointer">▼</span>
                </div>
                <div className="flex flex-col gap-1 pl-4">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked className="accent-[#F9C8C9] w-4 h-4 rounded border-2 border-[#49454F]" readOnly />
                        <span>create README</span>
                        <span className="ml-auto text-xs text-gray-400">5.6.2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" className="accent-[#5093B4] w-4 h-4 rounded border-2 border-[#49454F]" />
                        <span>create wireframe</span>
                        <span className="ml-auto text-xs text-gray-400">7.6.2025</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-[#5093B4]">20%</span>
                    <div className="w-full h-3 bg-[#F1F7F8] rounded">
                        <div className="h-3 bg-[#5093B4] rounded" style={{ width: '20%' }} />
                    </div>
                </div>
            </div>
            {/* Add New Task Button */}
            <button className="mt-2 w-full bg-[#5093B4] text-white py-2 rounded-lg font-medium">Add New Task</button>
        </section>
    )
}