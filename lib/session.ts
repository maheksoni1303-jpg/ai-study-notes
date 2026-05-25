import { SessionOptions } from "iron-session";

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  userId: "",
  email: "",
  name: "",
  isAdmin: false,
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "studyhub-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};