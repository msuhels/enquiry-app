import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { parseString } from 'xml2js';

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export class BulkUploadUserService {
  // Parse CSV file
  async parseCSV(file: File): Promise<UserFormData[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const users = this.mapCSVDataToUsers(results.data as any[]);
            resolve(users);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error),
      });
    });
  }

  // Parse Excel file
  async parseExcel(file: File): Promise<UserFormData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const users = this.mapExcelDataToUsers(jsonData as any[]);
          resolve(users);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Parse XML file
  async parseXML(file: File): Promise<UserFormData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xmlData = e.target?.result as string;
          parseString(xmlData, (err: any, result: any) => {
            if (err) {
              reject(err);
              return;
            }
            try {
              const users = this.mapXMLDataToUsers(result);
              resolve(users);
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read XML file'));
      reader.readAsText(file);
    });
  }

  // Map CSV data
  private mapCSVDataToUsers(data: any[]): UserFormData[] {
    return data.map(row => ({
      name: row['Name'] || row['name'] || '',
      email: row['Email'] || row['email'] || '',
      phone: row['Phone'] || row['phone'],
      role: row['Role'] || row['role'],
    })).filter(user => user.name && user.email);
  }

  // Map Excel data (same as CSV)
  private mapExcelDataToUsers(data: any[]): UserFormData[] {
    return this.mapCSVDataToUsers(data);
  }

  // Map XML data
  private mapXMLDataToUsers(xmlResult: any): UserFormData[] {
    const users: UserFormData[] = [];
    const rootKey = Object.keys(xmlResult)[0];
    const root = xmlResult[rootKey];

    let userArray: any[] = [];
    if (root.users && Array.isArray(root.users)) {
      userArray = root.users;
    } else if (root.user && Array.isArray(root.user)) {
      userArray = root.user;
    } else if (Array.isArray(root)) {
      userArray = root;
    }

    userArray.forEach((item: any) => {
      const user = item.user || item;
      users.push({
        name: user.name?.[0] || user.Name?.[0] || '',
        email: user.email?.[0] || user.Email?.[0] || '',
        phone: user.phone?.[0] || user.Phone?.[0],
        role: user.role?.[0] || user.Role?.[0],
      });
    });

    return users.filter(user => user.name && user.email);
  }

  // Validate file type
  validateFileType(file: File): boolean {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/xml',
      'application/xml'
    ];
    const allowedExtensions = ['.csv', '.xls', '.xlsx', '.xml'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
  }

  // Get file extension
  getFileExtension(filename: string): string {
    return filename.toLowerCase().substring(filename.lastIndexOf('.') + 1);
  }
}
