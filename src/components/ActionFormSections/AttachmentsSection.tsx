
import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Paperclip, X, Upload } from 'lucide-react';

interface AttachmentsSectionProps {
  attachments: string[];
  onUpdate: (attachments: string[]) => void;
  readOnly?: boolean;
}

const AttachmentsSection = ({ attachments, onUpdate, readOnly = false }: AttachmentsSectionProps) => {
  const [newAttachment, setNewAttachment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddAttachment = () => {
    if (newAttachment.trim() && !attachments.includes(newAttachment.trim())) {
      onUpdate([...attachments, newAttachment.trim()]);
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (attachment: string) => {
    onUpdate(attachments.filter(a => a !== attachment));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulem l'upload afegint el nom del fitxer
      const fileName = file.name;
      if (!attachments.includes(fileName)) {
        onUpdate([...attachments, fileName]);
      }
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label>Adjunts</Label>
      
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {attachment}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(attachment)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {!readOnly && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="flex-1"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSelectFileClick}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-1" />
              Seleccionar fitxer
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newAttachment}
              onChange={(e) => setNewAttachment(e.target.value)}
              placeholder="O escriu el nom d'un fitxer..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddAttachment()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAttachment}
              disabled={!newAttachment.trim()}
            >
              Afegir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsSection;
