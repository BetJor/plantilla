
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  userName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar = ({ userName, size = 'sm', className }: UserAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src="" />
      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
        {getInitials(userName)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
