import { Calculator } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-primary rounded-xl shadow-medium">
        <Calculator className={`${sizeClasses[size]} text-primary-foreground`} />
      </div>
      {showText && (
        <div>
          <h1 className={`${textSizeClasses[size]} font-bold text-foreground`}>
            Calc Jus Pro
          </h1>
          <p className="text-xs text-muted-foreground">
            Calculadora Jurídica Profissional
          </p>
        </div>
      )}
    </div>
  );
}