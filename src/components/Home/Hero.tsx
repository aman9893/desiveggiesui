import { ArrowRightIcon, LeafIcon } from "lucide-react";
import { heroSectionData } from "../../assets/assets";
import { Link } from "react-router-dom";
import SearchLocation from "./SearchLocation";

const Hero = () => {
    return (
        <>
            <SearchLocation />
            <section className="relative overflow-hidden min-h-[300px] sm:min-h-[400px] md:min-h-[540px] mb-1 rounded-3xl flex items-center hidden md:block">
            <img src={heroSectionData.hero_image} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />

            <div className="absolute inset-0 bg-linear-to-r from-app-green via-app-green/65 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20 w-full">
                <div className="max-w-xl xl:pl-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-orange-300 bg-orange-300/10 rounded-full mb-3 sm:mb-5">
                        <LeafIcon className="size-3" /> Farm-Fresh & Organic
                    </span>

                    <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl text-white leading-tight mb-3 sm:mb-5">
                        Desi veggies for your home with <span className="text-orange-300">Earth's finest</span>
                    </h1>

                    <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6 sm:mb-8 max-w-md">{heroSectionData.description}</p>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Link to="/products" className="px-5 sm:px-7 py-2 sm:py-3 text-sm sm:text-base bg-orange-400 text-white font-semibold rounded-full hover:bg-orange-500 transition-all flex-center gap-2 active:scale-[0.98]">
                            Shop Now <ArrowRightIcon className="size-4" />
                        </Link>

                        <Link to="/products" className="px-5 sm:px-7 py-2 sm:py-3 text-sm sm:text-base bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20">
                            Browse Categories
                        </Link>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
};

export default Hero;
