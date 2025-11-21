// lib\user-bulk-upload-service.ts

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { parseString } from 'xml2js';

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  organization?: string;
  state?: string;
  city?: string;
}

// Parse CSV file
export async function parseCSV(file: File): Promise<UserFormData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const users = mapCSVDataToUsers(results.data as any[]);
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
export async function parseExcel(file: File): Promise<UserFormData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Get the raw data with defval to handle empty cells
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '',
          raw: false // This ensures values are converted to strings
        });

        // console.log('Excel parsed data sample:', jsonData[0]); // Debug log
        const users = mapExcelDataToUsers(jsonData as any[]);
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
export async function parseXML(file: File): Promise<UserFormData[]> {
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
            const users = mapXMLDataToUsers(result);
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

// Helper function to safely get value from row with multiple possible keys
// Also handles keys with leading/trailing spaces
function getValueFromRow(row: any, keys: string[]): string {
  // First try exact matches
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return String(row[key]).trim();
    }
  }
  
  // If no exact match, try trimmed keys (handles " State" -> "State")
  const rowKeys = Object.keys(row);
  for (const key of keys) {
    const matchingKey = rowKeys.find(k => k.trim().toLowerCase() === key.toLowerCase());
    if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null && row[matchingKey] !== '') {
      return String(row[matchingKey]).trim();
    }
  }
  
  return '';
}

// Map CSV data
function mapCSVDataToUsers(data: any[]): UserFormData[] {
  // console.log('CSV data sample:', data[0]); // Debug log
  // console.log('CSV column headers:', Object.keys(data[0] || {})); // Debug log
  
  const result = data.map((row) => ({
    name: getValueFromRow(row, ['Name', 'name', 'NAME']),
    email: getValueFromRow(row, ['Email', 'email', 'EMAIL']),
    phone: getValueFromRow(row, ['Phone', 'phone', 'PHONE']),
    role: getValueFromRow(row, ['Role', 'role', 'ROLE']),
    organization: getValueFromRow(row, ['Organization', 'organization', 'ORGANIZATION']),
    state: getValueFromRow(row, ['State', 'state', 'STATE']),
    city: getValueFromRow(row, ['City', 'city', 'CITY']),
  }));
  
  // console.log('Mapped CSV result sample:', result[0]); // Debug log
  return result;
}

// Map Excel data with special handling for duplicate headers
function mapExcelDataToUsers(data: any[]): UserFormData[] {
  if (!data || data.length === 0) {
    return [];
  }

  // Check for duplicate headers in the first row (for debugging)
  const firstRow = data[0];
  const keys = Object.keys(firstRow);
  // console.log('Excel column headers found:', keys);

  const result = data.map((row) => ({
    name: getValueFromRow(row, ['Name', 'name', 'NAME']),
    email: getValueFromRow(row, ['Email', 'email', 'EMAIL']),
    phone: getValueFromRow(row, ['Phone', 'phone', 'PHONE']),
    role: getValueFromRow(row, ['Role', 'role', 'ROLE']),
    organization: getValueFromRow(row, ['Organization', 'organization', 'ORGANIZATION']),
    // Check for State with possible duplicate suffix
    state: getValueFromRow(row, ['State', 'state', 'STATE', 'State__1', 'state__1', 'STATE__1']),
    city: getValueFromRow(row, ['City', 'city', 'CITY']),
  }));

  // console.log('Mapped Excel result sample:', result[0]); // Debug log
  return result;
}

// Map XML data
function mapXMLDataToUsers(xmlResult: any): UserFormData[] {
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
      organization: user.organization?.[0] || user.Organization?.[0],
      state: user.state?.[0] || user.State?.[0],
      city: user.city?.[0] || user.City?.[0],
    });
  });

  return users.filter((user) => user.name && user.email);
}

// Validate file type
export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/xml',
    'application/xml',
  ];
  const allowedExtensions = ['.csv', '.xls', '.xlsx', '.xml'];
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf('.'));
  return (
    allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)
  );
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.toLowerCase().substring(filename.lastIndexOf('.') + 1);
}