const TOKEN_KEY = "userToken";

/**
 * @description: save token
 * @param {string} token
 * @return {*}
 */
export const saveToken = (token) => {
    sessionStorage.setItem(TOKEN_KEY,token)
};

/**
 * @description: get Token
 * @return {*}
 */
export const getToken = () => {
    return sessionStorage.getItem(TOKEN_KEY)
};