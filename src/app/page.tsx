import Loader from "@/components/Loader";
import PromoBanner from "@/components/PromoBanner";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Lifecycle from "@/components/Lifecycle";
import Services from "@/components/Services";
import BreakerPanel from "@/components/BreakerPanel";
import Cctv from "@/components/Cctv";
import Sectors from "@/components/Sectors";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="site-with-promo">
      <PromoBanner />
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Lifecycle />
        <Services />
        <BreakerPanel />
        <Cctv />
        <Sectors />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
