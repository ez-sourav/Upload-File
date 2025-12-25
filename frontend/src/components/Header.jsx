import { Files } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/70 backdrop-blur-sm">
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          
          {/* Icon */}
          <div className="p-2 rounded-xl gradient-primary glow-primary">
            <Files className="h-6 w-6 text-primary-foreground" />
          </div>

          {/* Text */}
          <div>
            <h1 className="text-xl font-bold text-foreground">
              File Upload System
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload, manage, and download your files
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}
