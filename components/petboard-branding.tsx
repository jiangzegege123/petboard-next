import { PawPrint } from 'lucide-react';

export function PetboardBranding() {
  return (
    <div className="flex items-center gap-2 px-1 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <PawPrint className="h-4 w-4" />
      </div>
      <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">PetBoard</span>
    </div>
  );
}
