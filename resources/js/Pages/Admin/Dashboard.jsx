import AdminLayout from "@/Components/Admin/AdminLayout";
import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, ShoppingCart, Package, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {

    const stats = [
        { title: "Today Revenue", value: "₹48,200", icon: ShoppingCart },
        { title: "Monthly Revenue", value: "₹12,40,000", icon: TrendingUp },
        { title: "Yearly Revenue", value: "₹1.2 Cr", icon: Calendar },
        { title: "Products", value: "320", icon: Package },
    ];

    const chartData = [
        { name: "Mon", sales: 400 },
        { name: "Tue", sales: 800 },
        { name: "Wed", sales: 600 },
        { name: "Thu", sales: 1200 },
        { name: "Fri", sales: 900 },
        { name: "Sat", sales: 1400 },
        { name: "Sun", sales: 1100 },
    ];

    return (
        <AdminLayout>

            {/* Header */}
            <div className="flex justify-between items-center mb-20">

                <h1 className="text-3xl font-bold">
                    💡 Insights Drive Success
                </h1>

            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {stats.map((item, index) => {

                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity:0, y:20 }}
                            animate={{ opacity:1, y:0 }}
                            transition={{ delay:index * 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-lg"
                        >

                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {item.title}
                                    </p>

                                    <h2 className="text-2xl font-bold">
                                        {item.value}
                                    </h2>
                                </div>

                                <Icon className="text-indigo-600"/>

                            </div>

                        </motion.div>
                    );
                })}

            </div>

            {/* Chart + AI Assistant */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">

                {/* Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">

                    <h3 className="font-semibold mb-4">
                        Weekly Sales Report
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="sales" stroke="#6366f1"/>
                        </LineChart>
                    </ResponsiveContainer>

                </div>

                {/* AI Assistant */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">

                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles/>
                        <h3 className="font-semibold">
                            AI Assistant
                        </h3>
                    </div>

                    <p className="text-sm mb-4">
                        Ask AI about store analytics, products or marketing ideas.
                    </p>

                    <input
                        type="text"
                        placeholder="Ask AI something..."
                        className="w-full p-2 rounded-lg text-black"
                    />

                    <button className="mt-3 w-full bg-white text-indigo-600 py-2 rounded-lg">
                        Ask AI
                    </button>

                </div>
            </div>

        </AdminLayout>
    );
}

