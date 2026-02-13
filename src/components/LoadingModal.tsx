import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingModal({ isOpen, message = 'Processando...' }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-sm mx-4">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-center">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
