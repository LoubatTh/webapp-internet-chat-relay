import { v4 as uuidv4 } from 'uuid';

// Function to generate random string
function generateRandomString(length: number): string {
  const randomString = uuidv4().replace(/-/g, '').substr(0, length);
  return randomString;
}

/*
 * General utils for managing cookies in Typescript.
 */
export function setCookie() {
    const date = new Date();
    const value = generateRandomString(15); 
    console.log(value)
    // Set it expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = "epicookie"+"="+value+"; expires="+date.toUTCString()+"; path=/";
}                    

// Function to get cookie
export function getCookie() {
    const value = "; " + document.cookie;
    const parts = value.split("; epicookie=");
    
    if (parts.length == 2) {
        return parts.pop()?.split(";").shift()!;
    }
}

// Function to delete cookie
export function deleteCookie(name: string) {
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}