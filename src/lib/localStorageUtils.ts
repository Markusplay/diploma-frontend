import { K3ItemType } from '../types/K3ItemType';

export const loadFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    try {
      const loads = JSON.parse(localStorage.getItem(key) || '[]');
      return loads;
    } catch (error) {
      console.error('Error loading from localStorage', error);
      return [];
    }
  }
};

export const getToken = () => {
  return loadFromLocalStorage('token');
};

export const saveToLocalStorage = (key: string, value: K3ItemType[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage', error);
  }
};
