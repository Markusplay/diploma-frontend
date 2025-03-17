import { downloadFile, FileVariant } from '@/lib/downloadFile.ts';

const K2_FILENAME: string = 'K2.xlsx';

class K2Service {
  static download(selectedTeacherId?: string) {
    return downloadFile(FileVariant.K2, K2_FILENAME, selectedTeacherId);
  }
}

export default K2Service;
