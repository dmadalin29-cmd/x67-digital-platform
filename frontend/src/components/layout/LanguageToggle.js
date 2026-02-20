import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      className="relative flex items-center gap-1 px-1 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:border-gold-500/50 transition-all duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-testid="language-toggle"
    >
      {/* RO Option */}
      <div
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
          language === "ro"
            ? "text-black"
            : "text-white/60 hover:text-white"
        }`}
      >
        <span className="text-lg">🇷🇴</span>
        <span className="text-xs font-bold uppercase tracking-wider">RO</span>
      </div>

      {/* EN Option */}
      <div
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
          language === "en"
            ? "text-black"
            : "text-white/60 hover:text-white"
        }`}
      >
        <span className="text-lg">🇬🇧</span>
        <span className="text-xs font-bold uppercase tracking-wider">EN</span>
      </div>

      {/* Sliding Background */}
      <motion.div
        className="absolute top-1 bottom-1 w-[calc(50%-2px)] bg-gold-500 rounded-full"
        initial={false}
        animate={{
          x: language === "ro" ? 2 : "calc(100% + 2px)",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </motion.button>
  );
};

export default LanguageToggle;
