import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomString(length: number): string {
  const randomString = uuidv4().replace(/-/g, "").substr(0, length);
  return randomString;
}

export const isAuthenticated = () => {
  return localStorage.getItem("identity") !== null;
};

export const logout = () => {
  localStorage.removeItem("identity");
  localStorage.removeItem("accessToken");
};

export const isUser = () => {
  return localStorage.getItem("accessToken") !== null;
};

export function getIdentity() {
  return localStorage.getItem("identity");
}

export function setIdentity(id: string) {
  localStorage.setItem("identity", id);
}

export function deleteIdentity() {
  localStorage.removeItem("identity");
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function setAccessToken(string: string) {
  localStorage.setItem("accessToken", string);
}

export function deleteAccessToken() {
  localStorage.removeItem("accessToken");
}
