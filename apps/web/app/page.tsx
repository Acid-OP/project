import Hero from "../components/Hero/Hero";
import Navbar from "../components/Navbar/Navbar";


export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f14]">
      <Navbar />
      <Hero />
    </div>
  );
}
