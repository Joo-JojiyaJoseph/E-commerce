import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                fixed lg:static z-50 h-full
                transform ${open ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
                transition duration-300
                `}
            >
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">

                <Header toggleSidebar={() => setOpen(!open)} />

                <main className="p-6 overflow-y-auto">
                    {children}
                </main>

            </div>
        </div>
    );
}
