"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

type Props = {
  onClick: () => void;
  isOpen: boolean;
};

export default function FloatingWhatsAppButton({ onClick, isOpen }: Props) {
  const t = useTranslations("contactChat");

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={t("floatingAriaLabel")}
      title={t("floatingTitle")}
      aria-expanded={isOpen}
      className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg end-6"
      style={{
        bottom: "max(1.5rem, env(safe-area-inset-bottom))",
        background: "#25D366",
        boxShadow: "0 8px 32px rgba(37,211,102,0.45)",
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
    >
      <WhatsAppIcon size={30} />
    </motion.button>
  );
}
