'use client';
import { useState } from 'react';
import SlideCard from './SlideCard';
import CarouselDots from './CarouselDots';
import NavigationArrows from './NavigationArrows';

const slides = [
  { title: "Wire Transfers are Live", description: "Deposit and withdraw USD with no fees.", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop" },
  { title: "Trade Futures with Leverage", description: "Up to 20x leverage on major cryptocurrencies.", image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400&h=400&fit=crop" },
  { title: "Earn Interest on Your Crypto", description: "Lend your assets and earn competitive yields.", image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=400&fit=crop" }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] rounded-2xl overflow-hidden border border-gray-800">
        <SlideCard {...slides[currentSlide]} />
        <CarouselDots slidesLength={slides.length} currentSlide={currentSlide} />
        <NavigationArrows nextSlide={nextSlide} prevSlide={prevSlide} />
      </div>
    </main>
  );
}
