import { heroSectionData } from "../../assets/assets";

const Features = () => {
    return (
        <section className="bg-white py-4 sm:py-5 border border-app-border/80 rounded-xl mb-8 sm:mb-12">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {heroSectionData.hero_features.map((feature, i) => (
                        <div key={i} className="flex items-center sm:items-start gap-2 sm:gap-3 py-2 sm:py-3">
                            <div className="size-8 sm:size-10 rounded-lg bg-app-cream flex-center shrink-0">
                                <feature.icon className="size-4 sm:size-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-semibold text-app-green line-clamp-1">{feature.title}</p>
                                <p className="text-xs text-app-text-light line-clamp-2">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
