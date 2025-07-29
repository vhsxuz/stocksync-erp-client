import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="bg-[#0F1114] text-white font-sans min-h-screen grid grid-rows-[auto_1fr_auto] p-6 sm:p-12 gap-16">
      {/* Header */}
      <Header />
      {/* Hero */}
      <Hero />

      {/* Footer */}
      <Footer />
    </div>
  );
}
