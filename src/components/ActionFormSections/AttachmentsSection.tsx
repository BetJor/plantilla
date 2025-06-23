
import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Paperclip, X, Upload } from 'lucide-react';

interface AttachmentsSectionProps {
  attachments: string[];
  onUpdate: (attachments: string[]) => void;
  readOnly?: boolean;
}

const AttachmentsSection = ({ attachments, onUpdate, readOnly = false }: AttachmentsSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemoveAttachment = (attachment: string) => {
    onUpdate(attachments.filter(a => a !== attachment));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileName = file.name;
      if (!attachments.includes(fileName)) {
        onUpdate([...attachments, fileName]);
      }
      // Reset input per permetre seleccionar el mateix fitxer altra vegada
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            style={{ display: 'none' }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSelectFileClick}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Seleccionar fitxer
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttachmentsSection;
