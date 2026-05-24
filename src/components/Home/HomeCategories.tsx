import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

const HomeCategories = () => {
    const { categories, loading } = useCategories();

    if (loading) {
        return (
            <section className="py-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold">Browse Categories</h2>
                        <p className="text-xs sm:text-sm text-app-text-light mt-1">Find exactly what you need using</p>
                    </div>
                    <div className="flex items-center mt-8 gap-4 overflow-x-scroll no-scrollbar">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="size-26 rounded-2xl bg-gray-200 animate-pulse flex-shrink-0" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                    <h2 className="text-sm sm:text-sm font-semibold">Browse Categories</h2>
                    <p className="text-xs sm:text-sm text-app-text-light mt-1">Find exactly what you need using</p>
                </div>
                <div className="flex items-center  overflow-x-scroll no-scrollbar">
                    {categories.map((cat) => (
                        <Link key={cat.slug} to={`/products?category=${cat.slug}`} onClick={() => window.scrollTo(0, 0)} className="group flex flex-col items-center gap-3 p-4">
                            <div className="size-18 sm:size-26 sm:p-2 rounded-2xl overflow-hidden bg-orange-100 group-hover:ring-2 ring-orange-300/75 transition-all">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain rounded-full transition-all" />
                            </div>
                            <span className="text-xs font-medium text-zinc-600 text-center leading-tight">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeCategories;
