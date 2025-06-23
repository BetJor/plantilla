
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Paperclip, User, Clock } from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';

interface CommentsSectionProps {
  actionId: string;
  readOnly?: boolean;
}

const CommentsSection = ({ actionId, readOnly = false }: CommentsSectionProps) => {
  const { comments, addComment } = useCorrectiveActions();
  const [newComment, setNewComment] = useState('');
  
  const actionComments = comments.filter(c => c.actionId === actionId);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment({
        actionId: actionId,
        userId: 'current-user',
        userName: 'Usuari Actual',
        content: newComment,
        attachments: []
      });
      setNewComment('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Comentaris
          </div>
          <Badge variant="secondary" className="px-2 py-1 text-xs">
            {actionComments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mostrar comentaris existents */}
        {actionComments.length > 0 ? (
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {actionComments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">{comment.userName}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(comment.createdAt).toLocaleDateString('ca-ES')}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                {comment.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {comment.attachments.map((attachment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Paperclip className="w-3 h-3 mr-1" />
                        {attachment}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No hi ha comentaris encara
          </p>
        )}

        {/* Formulari per afegir comentaris */}
        {!readOnly && (
          <div className="border-t pt-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="comment">Afegir comentari</Label>
              <Textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escriu el teu comentari..."
                rows={3}
              />
              <Button 
                onClick={handleAddComment} 
                disabled={!newComment.trim()}
                size="sm"
                className="w-full"
              >
                Afegir Comentari
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
