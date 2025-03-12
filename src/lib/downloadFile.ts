import { baseURL } from './api.ts';
import { getToken } from './localStorageUtils.ts';

export enum FileVariant {
  K3B = '/k3b',
  K3K = '/k3k',
  PLAN = '/plan',
}

export const downloadFile = async (variant: FileVariant, filename: string) => {
  try {
    const response = await fetch(`${baseURL}download${variant}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } else {
      console.error('Failed to download the file');
    }
  } catch (error) {
    console.error('Error while downloading file:', error);
  }
};
