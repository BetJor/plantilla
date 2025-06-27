
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const breadcrumbLabels: Record<string, string> = {
  'reports': 'Informes',
  'settings': 'Configuració'
};

const Breadcrumbs = () => {
  const location = useLocation();
  
  const generateBreadcrumbs = () => {
    if (location.pathname === '/') return [];
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    return pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = breadcrumbLabels[segment] || segment;
      
      return { path, label, isLast: index === pathSegments.length - 1 };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Link to="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          <ChevronRight className="w-4 h-4" />
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
