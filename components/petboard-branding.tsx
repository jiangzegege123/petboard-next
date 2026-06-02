import { PawPrint } from 'lucide-react';

export function PetboardBranding() {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <PawPrint className="h-4 w-4" />
      </div>
      <span className="font-semibold text-sm">PetBoard</span>
    </div>
  );
}
