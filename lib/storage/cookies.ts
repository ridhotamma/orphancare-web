import Cookies from 'js-cookie';

const cookieStorage = {
  getItem: (key: string) => {
    const item = Cookies.get(key);
    return item ? Promise.resolve(item) : Promise.resolve(null);
  },
  setItem: (key: string, value: string) => {
    Cookies.set(key, value, { expires: 365 });
    return Promise.resolve(true);
  },
  removeItem: (key: string) => {
    Cookies.remove(key);
    return Promise.resolve();
  },
};

export default cookieStorage;
