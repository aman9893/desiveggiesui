import AppPromoBanner from "../components/Home/AppPromoBanner";
import Features from "../components/Home/Features";
import Hero from "../components/Home/Hero";
import HomeCategories from "../components/Home/HomeCategories";
import Newsletter from "../components/Home/Newsletter";
import PopularProducts from "../components/Home/PopularProducts";
import RecentOrders from "../components/Home/RecentOrders";

const Home = () => {
    return (
        <div className="min-h-screen max-w-8xl mx-auto px-1 sm:px-1 lg:px-2 py-1 sm:py-0">
            <Hero />
            <Features />
            <HomeCategories />
            <PopularProducts />
            <AppPromoBanner />
            <Newsletter />
            <RecentOrders />
        </div>
    );
};

export default Home;
