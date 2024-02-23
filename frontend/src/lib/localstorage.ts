import { v4 as uuidv4 } from 'uuid';

// Function to generate random string
function generateRandomString(length: number): string {
  const randomString = uuidv4().replace(/-/g, '').substr(0, length);
  return randomString;
}

export function setUser(id:string, token: string){
  setIdentity(id)
  setAccessToken(token)
}

export function getIdentity() {
  return localStorage.getItem("identity")
}

export function setIdentity(string : string) {
  localStorage.setItem("identity", string)
}

export function deleteIdentity() {
    localStorage.removeItem("identity")
}

export function getAccessToken() {
  return localStorage.getItem("accessToken")
}

export function setAccessToken(string : string) {
  localStorage.setItem("accessToken", string)
}

export function deleteAccessToken() {
    localStorage.removeItem("accessToken")
}