export type ContactMessagePayload = {
  phone: string;
  message: string;
  page_url?: string;
  source?: string;
  locale?: string;
  user_agent?: string;
  website?: string;
};

export type ContactMessageResponse = {
  success: boolean;
  message: string;
  /** True when Evolution API delivered the notification to the work WhatsApp number. */
  whatsapp_delivered?: boolean;
  errors?: Record<string, string[]>;
};

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  return base;
}

export async function submitContactMessage(
  payload: ContactMessagePayload,
): Promise<ContactMessageResponse> {
  const response = await fetch(`${apiBase()}/api/contact-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...payload,
      source: payload.source ?? "floating_whatsapp_widget",
      page_url: payload.page_url ?? (typeof window !== "undefined" ? window.location.href : ""),
      user_agent: payload.user_agent ?? (typeof navigator !== "undefined" ? navigator.userAgent : ""),
      website: "",
    }),
  });

  const data = (await response.json().catch(() => ({}))) as ContactMessageResponse;

  if (!response.ok) {
    const err = new Error(data.message || "Request failed") as Error & {
      status?: number;
      errors?: Record<string, string[]>;
    };
    err.status = response.status;
    err.errors = data.errors;
    throw err;
  }

  return data;
}
