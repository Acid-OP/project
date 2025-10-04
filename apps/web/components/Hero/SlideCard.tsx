interface SlideCardProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function SlideCard({ title, description, image }: SlideCardProps) {
  return (
    <div className="flex items-center justify-between p-12">
      <div className="flex-1">
        <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
        <p className="text-xl text-gray-400">{description}</p>
      </div>
      <div className="flex-1 flex justify-end">
        <div className="relative w-80 h-80">
          <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
        </div>
      </div>
    </div>
  );
}
