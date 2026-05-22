import { LOGO_ALT, LOGO_SRC } from "@/lib/brand";

type BrandLogoProps = {
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
};

export default function BrandLogo({
  className = "h-8 w-8 object-contain",
  alt = LOGO_ALT,
  style,
}: BrandLogoProps) {
  return <img src={LOGO_SRC} alt={alt} className={className} style={style} draggable={false} />;
}
