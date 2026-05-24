import AppPromoBanner from "../components/Home/AppPromoBanner";
import Features from "../components/Home/Features";
import Hero from "../components/Home/Hero";
import HomeCategories from "../components/Home/HomeCategories";
import Newsletter from "../components/Home/Newsletter";
import PopularProducts from "../components/Home/PopularProducts";

const Home = () => {
    return (
        <div className="min-h-screen max-w-8xl mx-auto px-1 sm:px-2 lg:px-2 py-2 sm:py-2">
            <Hero />
            <Features />
            <HomeCategories />
            <PopularProducts />
            <AppPromoBanner />
            <Newsletter />
        </div>
    );
};

export default Home;
