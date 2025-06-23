
import { useState } from 'react';
import { Comment } from '@/types';
import { useActionStorage } from './useActionStorage';

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { saveCommentsToStorage, loadComments } = useActionStorage();

  const initializeComments = () => {
    const loadedComments = loadComments();
    setComments(loadedComments);
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveCommentsToStorage(updatedComments);
    
    console.log('addComment: Comentari afegit i guardat:', newComment);
    
    return newComment;
  };

  const clearComments = () => {
    setComments([]);
  };

  return {
    comments,
    addComment,
    clearComments,
    initializeComments
  };
};
