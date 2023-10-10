import { Cookie, z } from "@deps";

const SessionCookieSchema = z
  .object({
    value: z.string().default(() => globalThis.crypto.randomUUID()),
    expires: z.coerce.date(),
    domain: z.string().min(1),
    secure: z.boolean().default(true),
    email: z.string().email(),
  });

type SessionCookieRaw = z.input<typeof SessionCookieSchema>;
type SessionCookieOutput = z.output<typeof SessionCookieSchema>;

export interface SessionCookie extends SessionCookieOutput {}

export class SessionCookie implements Cookie {
  static parse(properties: unknown) {
    return new SessionCookie(SessionCookieSchema.parse(properties));
  }

  readonly name = "session_token";

  public constructor(properties: SessionCookieRaw) {
    Object.assign(this, SessionCookieSchema.parse(properties));
  }

  public isExpired() {
    const now = new Date();

    return now >= this.expires;
  }
}

export function createSessionCookie(
  email: string,
  config: Express.Locals["config"],
) {
  const now = Date.now();
  const sessionCookie = new SessionCookie({
    expires: new Date(now + config.sessionExpiresIn),
    domain: config.domain,
    secure: config.environment === "PRODUCTION",
    email,
  });

  storeSessionCookie(sessionCookie);

  return sessionCookie;
}

export function parseSessionCookie(cookie: SessionCookieRaw) {
  return SessionCookie.parse(cookie);
}

export function isAuthorized(
  config: Express.Locals["config"],
  email: string,
  password: string,
) {
  const emailIndex = config.adminEmails.indexOf(email);

  if (emailIndex < 0) {
    return false;
  }

  return config.adminPasswords.includes(password);
}

export function retrieveSessionCookie(token: string) {
  const raw = localStorage.getItem(`session:${token}`);

  if (raw === null) {
    return null;
  }

  const sessionCookie = SessionCookie.parse(JSON.parse(raw));

  if (sessionCookie.isExpired()) {
    removeSessionCookie(sessionCookie.email);

    return null;
  }

  return sessionCookie;
}

function storeSessionCookie(cookie: SessionCookie) {
  removeSessionCookie(cookie.email);

  localStorage.setItem(`user:${cookie.email}`, cookie.value);
  localStorage.setItem(`session:${cookie.value}`, JSON.stringify(cookie));
}

export function removeSessionCookie(email: string) {
  console.log("remove session cookie");
  const token = localStorage.getItem(`user:${email}`);

  if (!token) {
    return;
  }

  localStorage.removeItem(`session:${token}`);
  localStorage.removeItem(`user:${email}`);
}

export function isTokenStored(token: string) {
  return typeof localStorage.getItem(`session:${token}`) === "string";
}
