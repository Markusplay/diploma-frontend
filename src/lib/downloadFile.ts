import { baseURL } from './api.ts';
import { getToken } from './localStorageUtils.ts';

export enum FileVariant {
  K2 = '/k2',
  K3B = '/k3b',
  K3K = '/k3k',
  K4 = '/k4',
  PLAN = '/plan',
}

export const downloadFile = async (variant: FileVariant, filename: string, id?: string) => {
  try {
    let url = id ? `${baseURL}download${variant}/${id}` : `${baseURL}download${variant}`;
    if (variant === FileVariant.PLAN) {
      url = `${baseURL}plan/download/plan`;
    }

    const response = await fetch(url, {
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
