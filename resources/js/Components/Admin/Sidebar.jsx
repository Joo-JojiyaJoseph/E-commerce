import {
    LayoutDashboard,
    Boxes,
    Layers,
    Tag,
    ListTree,
    SlidersHorizontal,
    Database,
    Package,
    ShoppingCart
} from "lucide-react";

export default function Sidebar() {

    const menu = [
        { name: "Dashboard", icon: LayoutDashboard, url: "/admin/dashboard" },

        { name: "Types", icon: Boxes, url: "/admin/types" },

        { name: "Categories", icon: Layers, url: "/admin/categories" },

        { name: "Sub Categories", icon: ListTree, url: "/admin/subcategories" },

        { name: "Products", icon: Package, url: "/admin/products" },

        { name: "Attributes", icon: SlidersHorizontal, url: "/admin/attributes" },

        { name: "Attribute Values", icon: Database, url: "/admin/attribute-values" },

        { name: "Specifications", icon: Tag, url: "/admin/specifications" },

        { name: "Variants", icon: Boxes, url: "/admin/variants" },

        { name: "Orders", icon: ShoppingCart, url: "/admin/orders" },
    ];

    return (
        <aside className="w-64 h-full bg-white shadow-lg flex flex-col">

            {/* Logo */}
            <div className="p-6 text-xl font-bold border-b">
                Ecommerce Admin
            </div>

            {/* Menu */}
            <nav className="p-4 space-y-2 overflow-y-auto">

                {menu.map((item, index) => {

                    const Icon = item.icon;

                    return (
                        <a
                            key={index}
                            href={item.url}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
                        >
                            <Icon size={18} />
                            {item.name}
                        </a>
                    );
                })}

            </nav>

        </aside>
    );
}
