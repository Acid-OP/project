interface CarouselDotsProps {
  slidesLength: number;
  currentSlide: number;
}

export default function CarouselDots({ slidesLength, currentSlide }: CarouselDotsProps) {
  return (
    <div className="flex justify-center space-x-2 pb-6">
      {Array.from({ length: slidesLength }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-600'}`}
        ></div>
      ))}
    </div>
  );
}
