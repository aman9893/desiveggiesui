import { Outlet } from "react-router-dom";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import FooterMenu from "../components/FooterMenu";

const AppLayout = () => {
    return (
        <>
            <Banner />
            <Navbar />
            <main className="min-h-screen pb-20 md:pb-0">
                <Outlet />
            </main>
            <Footer />
            <CartSidebar />
            <FooterMenu />
        </>
    );
};

export default AppLayout;
