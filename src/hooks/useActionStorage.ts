
import { useState } from 'react';
import { CorrectiveAction, Comment } from '@/types';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'corrective-actions-data';
const COMMENTS_STORAGE_KEY = 'corrective-actions-comments';

export const useActionStorage = () => {
  // Funció per guardar accions a localStorage
  const saveToStorage = (updatedActions: CorrectiveAction[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActions));
      console.log('saveToStorage: Guardades', updatedActions.length, 'accions');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        title: "Error",
        description: "No s'han pogut guardar les dades.",
        variant: "destructive"
      });
    }
  };

  // Funció per guardar comentaris a localStorage
  const saveCommentsToStorage = (updatedComments: Comment[]) => {
    try {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updatedComments));
      console.log('saveCommentsToStorage: Guardats', updatedComments.length, 'comentaris');
    } catch (error) {
      console.error('Error saving comments to localStorage:', error);
      toast({
        title: "Error",
        description: "No s'han pogut guardar els comentaris.",
        variant: "destructive"
      });
    }
  };

  // Funció per carregar accions del localStorage
  const loadActions = (): CorrectiveAction[] => {
    try {
      console.log('loadActions: Carregant accions del localStorage...');
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        const parsedActions = JSON.parse(savedData);
        if (Array.isArray(parsedActions)) {
          console.log('loadActions: Carregades', parsedActions.length, 'accions del localStorage');
          return parsedActions;
        } else {
          console.warn('loadActions: Dades invàlides al localStorage, retornant array buit');
          return [];
        }
      } else {
        console.log('loadActions: No hi ha dades guardades, retornant array buit');
        return [];
      }
    } catch (error) {
      console.error('loadActions: Error carregant del localStorage:', error);
      return [];
    }
  };

  // Funció per carregar comentaris del localStorage
  const loadComments = (): Comment[] => {
    try {
      console.log('loadComments: Carregant comentaris del localStorage...');
      const savedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
      
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments);
        if (Array.isArray(parsedComments)) {
          console.log('loadComments: Carregats', parsedComments.length, 'comentaris del localStorage');
          return parsedComments;
        } else {
          console.warn('loadComments: Dades invàlides al localStorage per comentaris, retornant array buit');
          return [];
        }
      } else {
        console.log('loadComments: No hi ha comentaris guardats, retornant array buit');
        return [];
      }
    } catch (error) {
      console.error('loadComments: Error carregant comentaris del localStorage:', error);
      return [];
    }
  };

  const clearAllStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COMMENTS_STORAGE_KEY);
      toast({
        title: "Accions eliminades",
        description: "Totes les accions correctives i comentaris han estat eliminats correctament."
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      toast({
        title: "Error",
        description: "Error en eliminar les dades.",
        variant: "destructive"
      });
    }
  };

  return {
    saveToStorage,
    saveCommentsToStorage,
    loadActions,
    loadComments,
    clearAllStorage
  };
};
