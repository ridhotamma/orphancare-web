import Cookies from 'js-cookie';

const cookieStorage = {
  getItem: (key: string): string | null => {
    return Cookies.get(key) || null;
  },
  setItem: (key: string, value: string, options?: Cookies.CookieAttributes): void => {
    Cookies.set(key, value, { expires: 365, ...options });
  },
  removeItem: (key: string, options?: Cookies.CookieAttributes): void => {
    Cookies.remove(key, options);
  },
};

export default cookieStorage;
