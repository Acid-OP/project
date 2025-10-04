interface SlideCardProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function SlideCard({ title, description, image }: SlideCardProps) {
  return (
    <div className="relative w-full h-[450px] overflow-hidden">
      {/* Background Image */}
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center h-full p-12">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-gray-200">{description}</p>
        </div>
      </div>
    </div>
  );
}