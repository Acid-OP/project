import Hero from "../components/Hero/Hero";
import Navbar from "../components/Navbar/Navbar";
import ThreeSections from "../components/ThreeSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f14]">
      <Navbar />
      <Hero />
      <ThreeSections />
    </div>
  );
}