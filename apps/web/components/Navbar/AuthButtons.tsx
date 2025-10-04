interface ButtonProps {
  variant: 'outline' | 'solid';
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant, children, onClick }: ButtonProps) {
  const baseStyles = "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer";
  
  const variantStyles = {
    outline: "bg-[#0d2c24] border border-[#0d2c24] text-[#00D395] hover:bg-[#0d2c24]/60 hover:text-[#00D395]/80",
    solid: "bg-[#18243a] border border-[#18243a] text-[#3E7EE2] hover:bg-[#18243a]/60 hover:text-[#3E7EE2]/80"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
}

export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-3 ml-auto">
      <Button variant="outline">
        Sign up
      </Button>
      <Button variant="solid">
        Sign in
      </Button>
    </div>
  );
}