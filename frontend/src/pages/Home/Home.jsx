import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import CategorySection from "../../components/home/CategorySection";
import NewArrivals from "../../components/home/NewArrivals";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Footer from "../../components/layout/Footer";
import PromoBanner from "../../components/home/PromoBanner";
import Testimonial from "../../components/home/Testimonial";
import Newsletter from "../../components/home/Newsletter";



const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <CategorySection />
      <NewArrivals />
      <WhyChooseUs />
      <PromoBanner />
      <Testimonial />
      <Newsletter />
      
<Footer />
    </>
  );
};

export default Home;