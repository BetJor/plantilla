
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, ExternalLink } from 'lucide-react';

interface GeminiApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySet: () => void;
}

const GeminiApiKeyDialog = ({ open, onOpenChange, onApiKeySet }: GeminiApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey('*'.repeat(20) + storedKey.slice(-4));
      setIsStored(true);
    } else {
      // Set default API key value
      setApiKey('AIzaSyBTEc3ls9wF64gWwoETorO7W6WmmIUJI2M');
      setIsStored(false);
    }
  }, [open]);

  const handleSave = () => {
    if (apiKey && !isStored) {
      localStorage.setItem('gemini-api-key', apiKey);
      onApiKeySet();
      onOpenChange(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('AIzaSyBTEc3ls9wF64gWwoETorO7W6WmmIUJI2M');
    setIsStored(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Configurar Clau API de Gemini
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Clau API de Google Gemini</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Introdueix la teva clau API..."
              disabled={isStored}
            />
            {!isStored && (
              <p className="text-sm text-gray-600">
                Obtén la teva clau API gratuïta a{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Google AI Studio
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {!isStored ? (
              <Button onClick={handleSave} disabled={!apiKey} className="flex-1">
                Guardar Clau
              </Button>
            ) : (
              <>
                <Button onClick={handleClear} variant="outline" className="flex-1">
                  Esborrar Clau
                </Button>
                <Button onClick={() => onOpenChange(false)} className="flex-1">
                  Tancar
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeminiApiKeyDialog;
