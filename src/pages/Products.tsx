import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { useCategories } from "../hooks/useCategories";
import { ChevronDown, Home, SlidersHorizontal, XIcon, Search, ArrowLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import FilterPanel from "../components/FilterPanel";
import api from "../config/api";
import toast from "react-hot-toast";

const Products = () => {
    const { categories = [] } = useCategories();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState("");

    const category = searchParams.get("category") || "";
    const organic = searchParams.get("organic") || "";
    const sort = searchParams.get("sort") || "";
    const page = Number(searchParams.get("page")) || 1;
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";

    // Filter products based on local search
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(localSearch.toLowerCase())
    );

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category) params.set("category", category);
            if (organic) params.set("organic", organic);
            if (sort) params.set("sort", sort);
            if (sort) params.set("sort", sort);
            if (maxPrice) params.set("maxPrice", maxPrice);
            params.set("page", String(page));
            params.set("limit", "12");

            const { data } = await api.get(`/products?${params.toString()}`);
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== "page") {
            newParams.delete("page");
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => setSearchParams({});

    const activeCategory = categories.find((c) => c.slug === category);
    const hasFilters = category || organic || minPrice || maxPrice;

    useEffect(() => {
        fetchProducts();
    }, [category, organic, sort, page, minPrice, maxPrice]);

    return (
        <div className="min-h-screen bg-app-cream">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* Breadcrumb */}
                <nav className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-app-text-light mb-6">
                    <Link to="/" className="hover:text-app-green transition-colors">
                        <Home className="size-4" />
                    </Link>
                    <span>/</span>
                    <span className="text-app-green font-medium">{activeCategory ? activeCategory.name : "All Products"}</span>
                </nav>

                {/* Mobile Search Box */}
                <div className="mb-4 sm:hidden flex gap-2 items-center">
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 bg-white rounded-lg border border-app-border hover:bg-app-cream transition-colors flex-shrink-0"
                        title="Go Home"
                    >
                        <ArrowLeft className="w-4 h-4 text-app-green" />
                    </button>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-lg border border-app-border focus:border-app-green outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-4 sm:gap-8 xl:gap-10">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="bg-white rounded-2xl p-4 sticky top-24">
                            <FilterPanel categories={categories} category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} updateFilter={updateFilter} clearFilters={clearFilters} hasFilters={hasFilters} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                                <h1 className="text-lg sm:text-2xl font-semibold text-app-green">{activeCategory ? activeCategory.name : "All Products"}</h1>
                                <p className="text-xs sm:text-sm text-app-text-light mt-0.5">{filteredProducts.length} products found</p>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Mobile filter toggle */}
                                <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden p-2 bg-white rounded-lg border border-app-border hover:bg-app-cream transition-colors" title="Filters">
                                    <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-app-green" />
                                </button>

                                {/* Sort */}
                                <div className="relative">
                                    <select value={sort} onChange={(e) => updateFilter("sort", e.target.value)} className="appearance-none pl-2 sm:pl-3 pr-6 sm:pr-8 py-2 text-xs sm:text-sm bg-white rounded-lg border border-app-border focus:border-app-green outline-none cursor-pointer">
                                        <option value="">Newest</option>
                                        <option value="price_asc">Price: Low → High</option>
                                        <option value="price_desc">Price: High → Low</option>
                                        <option value="rating">Top Rated</option>
                                        <option value="name">A → Z</option>
                                    </select>
                                    <ChevronDown className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-app-text-light pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <Loading />
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12 sm:py-16">
                                <p className="text-base sm:text-lg font-semibold text-app-green mb-2">No products found</p>
                                <p className="text-xs sm:text-sm text-app-text-light mb-4">Try adjusting your filters or search terms</p>
                                <button onClick={clearFilters} className="px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-app-green text-white rounded-lg hover:bg-app-green-light transition-colors">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 xl:gap-6">{filteredProducts.map((product) => product.stock > 0 && <ProductCard key={product.id} product={product} />)}</div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && filteredProducts.length > 0 && (
                            <div className="flex-center gap-1 sm:gap-2 mt-8 sm:mt-16">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            updateFilter("page", String(i + 1));
                                            scrollTo(0, 0);
                                        }}
                                        className={`w-7 sm:w-9 h-7 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-colors ${page === i + 1 ? "bg-app-green text-white" : "bg-white text-app-text-light hover:bg-app-cream"}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {mobileFiltersOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setMobileFiltersOpen(false)} />

                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-in-up">
                        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-app-border">
                            <h3 className="text-base sm:text-lg font-semibold text-app-green">Filters</h3>
                            <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-app-cream rounded-lg">
                                <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        <div className="p-3 sm:p-4">
                            <FilterPanel categories={categories} category={category} organic={organic} minPrice={minPrice} maxPrice={maxPrice} updateFilter={updateFilter} clearFilters={clearFilters} hasFilters={hasFilters} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Products;
