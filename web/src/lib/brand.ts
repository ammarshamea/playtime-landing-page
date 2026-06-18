export const PLAYTIME_LOGO_SRC = "/logo.svg";
export const PLAYTIME_LOGO_ALT = "Playtime";

export const NIVX_LOGO_SRC = "/nivx_logo.svg";
export const NIVX_LOGO_ALT = "Nivx";

/** @deprecated Use PLAYTIME_LOGO_SRC */
export const LOGO_SRC = PLAYTIME_LOGO_SRC;
export const LOGO_ALT = PLAYTIME_LOGO_ALT;

export type BrandLogoVariant = "playtime" | "nivx";

export const BRAND_LOGOS = {
  playtime: { src: PLAYTIME_LOGO_SRC, alt: PLAYTIME_LOGO_ALT },
  nivx: { src: NIVX_LOGO_SRC, alt: NIVX_LOGO_ALT },
} as const;
