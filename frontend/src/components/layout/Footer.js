import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-card border-t border-border">
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-heading text-2xl font-black tracking-tighter">
                <span className="text-gold-500">x67</span>
                <span className="text-white">Digital</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footerDescription")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-gold-500 transition-colors" data-testid="social-facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gold-500 transition-colors" data-testid="social-twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gold-500 transition-colors" data-testid="social-instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gold-500 transition-colors" data-testid="social-youtube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-4 uppercase tracking-wide text-sm">{t("quickLinks")}</h4>
            <ul className="space-y-3">
              {[
                { to: "/competitions", label: t("allCompetitionsLink") },
                { to: "/winners", label: t("previousWinners") },
                { to: "/faq", label: t("faq") },
                { to: "/terms", label: t("termsConditions") },
                { to: "/privacy", label: t("privacyPolicy") },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-gold-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-bold text-white mb-4 uppercase tracking-wide text-sm">{t("categories")}</h4>
            <ul className="space-y-3">
              {[
                { to: "/competitions?category=cars", label: t("carCompetitions") },
                { to: "/competitions?category=electronics", label: t("electronics") },
                { to: "/competitions?category=cash", label: t("cashPrizes") },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-gold-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-white mb-4 uppercase tracking-wide text-sm">{t("contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-gold-500" />
                <span>support@x67digital.co.uk</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-gold-500" />
                <span>+44 (0) 20 1234 5678</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-500" />
                <span>x67 Digital Media Groupe<br />London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <svg className="w-8 h-5" viewBox="0 0 50 30" fill="currentColor">
                <rect width="50" height="30" rx="4" fill="#1A1F71"/>
                <text x="25" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VISA</text>
              </svg>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <svg className="w-8 h-5" viewBox="0 0 50 30" fill="currentColor">
                <rect width="50" height="30" rx="4" fill="#EB001B"/>
                <circle cx="20" cy="15" r="8" fill="#EB001B"/>
                <circle cx="30" cy="15" r="8" fill="#F79E1B"/>
              </svg>
            </div>
            <div className="text-muted-foreground text-xs flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <span>{t("sslSecured")}</span>
            </div>
            <div className="text-muted-foreground text-xs flex items-center gap-2">
              <span>18+</span>
              <span>{t("responsibleGaming")}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} x67 Digital Media Groupe. {t("allRightsReserved")} {t("registeredEngland")}
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            {t("operatesPrizeCompetitions")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
