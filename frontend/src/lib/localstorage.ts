import { v4 as uuidv4 } from 'uuid';

// Function to generate random string
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