export const OPEN_CONTACT_CHAT_EVENT = "playtime:open-contact-chat";

export type OpenContactChatDetail = {
  prefillMessage?: string;
};

export function openContactChat(detail?: OpenContactChatDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_CONTACT_CHAT_EVENT, { detail: detail ?? {} }));
}
