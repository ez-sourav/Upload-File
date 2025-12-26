import { Files } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border border-gray-200 bg-card/70 backdrop-blur-sm">
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
           <div className="app-icon">
  <Files size={26} color="white" strokeWidth={2.2} />
</div>




          {/* Text */}
          <div>
            <h1 className="text-xl font-bold text-foreground">
              File Upload 
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
