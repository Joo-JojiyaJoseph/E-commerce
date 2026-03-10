import { Menu, Bell, Brain } from "lucide-react";

export default function Header({ toggleSidebar }) {

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">

            <div className="flex items-center gap-3">

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu size={22} />
                </button>

                <h2 className="font-semibold text-lg">
                    Admin Dashboard
                </h2>

            </div>

            <div className="flex items-center gap-4">

                

                <Bell size={20} />

                <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

            </div>

        </header>
    );
}
