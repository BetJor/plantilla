
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Paperclip } from 'lucide-react';
import { CorrectiveAction } from '@/types';
import AttachmentsSection from './AttachmentsSection';

interface AttachmentsFormSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const AttachmentsFormSection = ({ action, onUpdate, readOnly = false }: AttachmentsFormSectionProps) => {
  const handleAttachmentsUpdate = (attachments: string[]) => {
    onUpdate({ attachments });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Paperclip className="w-5 h-5 mr-2" />
          Adjunts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AttachmentsSection
          attachments={action.attachments}
          onUpdate={handleAttachmentsUpdate}
          readOnly={readOnly}
        />
      </CardContent>
    </Card>
  );
};

export default AttachmentsFormSection;
