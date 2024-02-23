import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function generateRandomString(length: number): string {
  const randomString = uuidv4().replace(/-/g, '').substr(0, length);
  return randomString;
}

export function getIdentity() {
  return localStorage.getItem("identity")
}

export function setIdentity() {
  localStorage.setItem("identity", generateRandomString(15))
}

export function deleteIdentity() {
    localStorage.removeItem("identity")
}