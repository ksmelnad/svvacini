import BookTitlesMarquee from "@/components/BookTitleAnimation";
import BookTitleAnimation from "@/components/BookTitleAnimation";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="font-serif">
      <Hero />
      <BookTitlesMarquee />
      <Features />
      <Newsletter />
      <Footer />
    </main>
  );
}
