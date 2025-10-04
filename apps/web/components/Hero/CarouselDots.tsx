interface CarouselDotsProps {
  slidesLength: number;
  currentSlide: number;
}

export default function CarouselDots({ slidesLength, currentSlide }: CarouselDotsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex justify-center space-x-2">
      {Array.from({ length: slidesLength }).map((_, index) => (
        <div 
          key={index}
          className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/40'}`}
        ></div>
      ))}
    </div>
  );
}