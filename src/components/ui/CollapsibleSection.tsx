
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleSection = ({
  id,
  title,
  icon,
  badge,
  summary,
  children,
  defaultOpen = false,
  className
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Remember state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`collapsible-${id}`);
    if (savedState !== null) {
      setIsOpen(JSON.parse(savedState));
    }
  }, [id]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    localStorage.setItem(`collapsible-${id}`, JSON.stringify(newOpen));
  };

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
              {badge}
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          {!isOpen && summary && (
            <div className="text-sm text-gray-600 mt-2">
              {summary}
            </div>
          )}
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsibleSection;
