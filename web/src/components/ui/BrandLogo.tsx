import { BRAND_LOGOS, type BrandLogoVariant } from "@/lib/brand";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
};

export default function BrandLogo({
  variant = "playtime",
  className = "h-8 w-8 object-contain",
  alt,
  style,
}: BrandLogoProps) {
  const brand = BRAND_LOGOS[variant];

  return (
    <img
      src={brand.src}
      alt={alt ?? brand.alt}
      className={className}
      style={style}
      draggable={false}
    />
  );
}
