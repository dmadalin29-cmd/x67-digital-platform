import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, Trophy, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { href: "/competitions", label: t("competitions") },
    { href: "/winners", label: t("winners") },
    { href: "/faq", label: t("faq") },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card">
      <div className="section-container">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
            <span className="font-heading text-2xl md:text-3xl font-black tracking-tighter">
              <span className="text-gold-500">x67</span>
              <span className="text-white">Digital</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors uppercase tracking-wide"
                data-testid={`nav-${link.href.slice(1)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: Language Toggle + Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <LanguageToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:text-gold-500"
                    data-testid="user-menu-trigger"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-gold-500" />
                    </div>
                    <span className="font-medium">{user.full_name?.split(" ")[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer" data-testid="nav-dashboard">
                      <LayoutDashboard className="w-4 h-4" />
                      {t("dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer" data-testid="nav-admin">
                        <Trophy className="w-4 h-4" />
                        {t("adminPanel")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive"
                    data-testid="nav-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-gold-500" data-testid="nav-login">
                    {t("login")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-primary px-6" data-testid="nav-register">
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Language Toggle + Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white"
              data-testid="mobile-menu-toggle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-white transition-colors uppercase tracking-wide py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        {t("dashboard")}
                      </Button>
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          {t("adminPanel")}
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full justify-start text-destructive"
                    >
                      {t("logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        {t("login")}
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="btn-primary w-full">{t("register")}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
