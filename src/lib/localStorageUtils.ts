export const loadFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      console.error('Error loading from localStorage', error);
      return [];
    }
  }
};

export const getToken = () => {
  return loadFromLocalStorage('token');
};
