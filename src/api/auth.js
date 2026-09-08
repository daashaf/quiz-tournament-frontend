export function login(username, password) {
    const credentials = btoa(`${username}:${password}`);
    localStorage.setItem('authHeader', `Basic ${credentials}`);
    localStorage.setItem('username', username);
}

export function logout() {
    localStorage.removeItem('authHeader');
    localStorage.removeItem('username');
}

export function getAuthHeader() {
    return localStorage.getItem('authHeader');
}

export function isLoggedIn() {
    return getAuthHeader() !== null;
}