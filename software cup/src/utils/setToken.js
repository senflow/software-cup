export function setToken(key,token){
    return localStorage.setItem(key,token)
}
export function getToken(key){
    return localStorage.getItem(key)
}
export function removeToken(key){
    return localStorage.removeItem(key)
}
