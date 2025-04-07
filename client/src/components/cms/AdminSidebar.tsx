import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCMSAuth } from '@/hooks/use-cms-auth';
import { 
  BookOpenText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type NavItem = {
  title: string;
  href: string;
  icon: JSX.Element;
}

export default function AdminSidebar() {
  const { logout, user } = useCMSAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Blog Posts',
      href: '/admin/blog',
      icon: <BookOpenText className="h-5 w-5" />,
    },
    {
      title: 'Messages',
      href: '/admin/messages',
      icon: <MessagesSquare className="h-5 w-5" />,
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 flex justify-between items-center">
          <div className="font-semibold">Admin Dashboard</div>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Sidebar - always visible on desktop, conditional on mobile */}
      <aside 
        className={cn(
          "flex flex-col bg-muted/40 border-r w-64 h-screen fixed top-0 left-0 z-40 transition-transform duration-300 ease-in-out",
          isMobile && !mobileMenuOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="p-6 border-b">
          <h2 className="font-semibold text-xl">Admin Dashboard</h2>
          {user && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.name || user.username}</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive(item.href) 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {item.title === 'Messages' && (
                      <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium rounded-full px-2 py-0.5">
                        New
                      </span>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
      
      {/* Content padding to offset the sidebar on desktop */}
      <div className={cn(
        "transition-all duration-300",
        !isMobile && "ml-64",
        isMobile && "mt-16"
      )}>
        {/* No content here - this just provides the offset */}
      </div>
    </>
  );
}