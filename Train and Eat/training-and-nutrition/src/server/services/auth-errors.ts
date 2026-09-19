/**
 * Съпоставя кодовете за грешки на Supabase Auth към кодовете на нашето API.
 *
 * Клиентът вижда само нашите кодове — те са договорът на API-то.
 * Supabase е имплементационна подробност зад него, затова кодовете му
 * не изтичат към компонентите.
 *
 * Текстовете за потребителя се определят в getAuthErrorMessage() в @/lib/utils.
 */

type Mapped = { code: string; status: number };

const AUTH_ERROR_MAP: Record<string, Mapped> = {
  // --- Регистрация ---
  email_exists: { code: "EMAIL_ALREADY_EXISTS", status: 409 },
  user_already_exists: { code: "EMAIL_ALREADY_EXISTS", status: 409 },
  signup_disabled: { code: "SIGNUP_DISABLED", status: 403 },
  weak_password: { code: "WEAK_PASSWORD", status: 400 },
  email_address_invalid: { code: "INVALID_EMAIL", status: 400 },
  email_address_not_authorized: { code: "INVALID_EMAIL", status: 400 },

  // --- Вход ---
  invalid_credentials: { code: "INVALID_CREDENTIALS", status: 401 },
  email_not_confirmed: { code: "EMAIL_NOT_CONFIRMED", status: 403 },
  user_banned: { code: "ACCOUNT_LOCKED", status: 403 },
  user_not_found: { code: "INVALID_CREDENTIALS", status: 401 },

  // --- Сесия ---
  session_expired: { code: "UNAUTHORIZED", status: 401 },
  session_not_found: { code: "UNAUTHORIZED", status: 401 },
  refresh_token_not_found: { code: "UNAUTHORIZED", status: 401 },
  refresh_token_already_used: { code: "UNAUTHORIZED", status: 401 },
  bad_jwt: { code: "UNAUTHORIZED", status: 401 },
  no_authorization: { code: "UNAUTHORIZED", status: 401 },

  // --- Смяна на парола / профил ---
  same_password: { code: "SAME_PASSWORD", status: 400 },
  reauthentication_needed: { code: "REAUTH_REQUIRED", status: 403 },

  // --- Ограничения на честотата ---
  over_email_send_rate_limit: { code: "TOO_MANY_REQUESTS", status: 429 },
  over_request_rate_limit: { code: "TOO_MANY_REQUESTS", status: 429 },

  // --- Вход ---
  validation_failed: { code: "INVALID_INPUT", status: 400 },
};

const FALLBACK: Mapped = { code: "INTERNAL_SERVER_ERROR", status: 500 };

/**
 * Приема `error.code` от Supabase AuthError и връща кода и HTTP статуса,
 * с които route-ът да отговори. Непознат или липсващ код дава 500 —
 * никога undefined статус.
 */
export function mapAuthError(code?: string): Mapped {
  if (!code) return FALLBACK;
  return AUTH_ERROR_MAP[code] ?? FALLBACK;
}
