import { FileImage, ExternalLink } from "lucide-react";

interface DocumentPreviewProps {
  url: string | null;
  label: string;
}

export function DocumentPreview({ url, label }: DocumentPreviewProps) {
  if (!url) {
    return (
      <div className="document-preview p-6 flex flex-col items-center justify-center gap-2 min-h-[140px] opacity-50">
        <FileImage className="w-8 h-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No {label}</span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="document-preview group block overflow-hidden"
    >
      <div className="aspect-video bg-muted/50 flex items-center justify-center relative">
        <img
          src={url}
          alt={label}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden flex-col items-center justify-center gap-2">
          <FileImage className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <ExternalLink className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">View Document</span>
        </div>
      </div>
      <div className="p-3 border-t border-border/50">
        <p className="text-sm font-medium truncate">{label}</p>
      </div>
    </a>
  );
}
