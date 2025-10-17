import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { parseString } from 'xml2js';
import { ProgramFormData } from './types';

export class BulkUploadService {
  // Parse CSV file
  async parseCSV(file: File): Promise<ProgramFormData[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const programs = this.mapCSVDataToPrograms(results.data as any[]);
            resolve(programs);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  // Parse Excel file
  async parseExcel(file: File): Promise<ProgramFormData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const programs = this.mapExcelDataToPrograms(jsonData as any[]);
          resolve(programs);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Parse XML file
  async parseXML(file: File): Promise<ProgramFormData[]> {
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
              const programs = this.mapXMLDataToPrograms(result);
              resolve(programs);
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

  // Map CSV data to program format
  private mapCSVDataToPrograms(data: any[]): ProgramFormData[] {
    return data.map((row, index) => ({
      university: row['UNIVERSITY'] || row['university'] || '',
      programme_name: row['PROGRAMME Name'] || row['programme_name'] || row['PROGRAMME Name'] || '',
      university_ranking: this.parseNumber(row['University Ranking'] || row['university_ranking']),
      study_level: row['Study Level'] || row['study_level'],
      study_area: row['Study Area'] || row['study_area'],
      campus: row['Campus'] || row['campus'],
      duration: row['Duration'] || row['duration'],
      open_intake: row['Open Intake'] || row['open_intake'],
      open_call: row['Open Call'] || row['open_call'],
      application_deadline: this.parseDate(row['Application Deadline'] || row['application_deadline']),
      entry_requirements: row['Entry REQUIREMENTS'] || row['entry_requirements'],
      percentage_required: this.parseNumber(row['PERCENTAGE Required'] || row['percentage_required']),
      moi: row['MOI'] || row['moi'],
      ielts_score: this.parseNumber(row['Ielts Score'] || row['ielts_score']),
      ielts_no_band_less_than: this.parseNumber(row['No band less than'] || row['ielts_no_band_less_than']),
      toefl_score: this.parseNumber(row['Toefl Score'] || row['toefl_score']),
      toefl_no_band_less_than: this.parseNumber(row['No ban less than'] || row['toefl_no_band_less_than']),
      pte_score: this.parseNumber(row['PTE Score'] || row['pte_score']),
      pte_no_band_less_than: this.parseNumber(row['PTE No band less than'] || row['pte_no_band_less_than']),
      det_score: this.parseNumber(row['DET Score'] || row['det_score']),
      det_no_band_less_than: this.parseNumber(row['DET No band less than'] || row['det_no_band_less_than']),
      tolc_score: this.parseNumber(row['TOLC Score'] || row['tolc_score']),
      sat_score: this.parseNumber(row['SAT Score'] || row['sat_score']),
      gre_score: this.parseNumber(row['GRE Score'] || row['gre_score']),
      gmat_score: this.parseNumber(row['GMAT Score'] || row['gmat_score']),
      cents_score: this.parseNumber(row['CENTS Score'] || row['cents_score']),
      til_score: this.parseNumber(row['TIL Score'] || row['til_score']),
      arched_test: row['ARCHED Test'] || row['arched_test'],
      application_fees: this.parseNumber(row['Application Fees'] || row['application_fees']),
      additional_requirements: row['Additional Requirement'] || row['additional_requirements'],
      remarks: row['Remarks'] || row['remarks'],
    })).filter(program => program.university && program.programme_name);
  }

  // Map Excel data to program format (same as CSV)
  private mapExcelDataToPrograms(data: any[]): ProgramFormData[] {
    return this.mapCSVDataToPrograms(data);
  }

  // Map XML data to program format
  private mapXMLDataToPrograms(xmlResult: any): ProgramFormData[] {
    const programs: ProgramFormData[] = [];
    
    // Handle different XML structures
    const rootKey = Object.keys(xmlResult)[0];
    const root = xmlResult[rootKey];
    
    // Look for programs array
    let programArray: any[] = [];
    if (root.programs && Array.isArray(root.programs)) {
      programArray = root.programs;
    } else if (root.program && Array.isArray(root.program)) {
      programArray = root.program;
    } else if (Array.isArray(root)) {
      programArray = root;
    }

    programArray.forEach((item: any) => {
      const program = item.program || item;
      programs.push({
        university: program.university?.[0] || program.UNIVERSITY?.[0] || '',
        programme_name: program.programme_name?.[0] || program['PROGRAMME Name']?.[0] || '',
        university_ranking: this.parseNumber(program.university_ranking?.[0] || program['University Ranking']?.[0]),
        study_level: program.study_level?.[0] || program['Study Level']?.[0],
        study_area: program.study_area?.[0] || program['Study Area']?.[0],
        campus: program.campus?.[0] || program.Campus?.[0],
        duration: program.duration?.[0] || program.Duration?.[0],
        open_intake: program.open_intake?.[0] || program['Open Intake']?.[0],
        open_call: program.open_call?.[0] || program['Open Call']?.[0],
        application_deadline: this.parseDate(program.application_deadline?.[0] || program['Application Deadline']?.[0]),
        entry_requirements: program.entry_requirements?.[0] || program['Entry REQUIREMENTS']?.[0],
        percentage_required: this.parseNumber(program.percentage_required?.[0] || program['PERCENTAGE Required']?.[0]),
        moi: program.moi?.[0] || program.MOI?.[0],
        ielts_score: this.parseNumber(program.ielts_score?.[0] || program['Ielts Score']?.[0]),
        ielts_no_band_less_than: this.parseNumber(program.ielts_no_band_less_than?.[0] || program['No band less than']?.[0]),
        toefl_score: this.parseNumber(program.toefl_score?.[0] || program['Toefl Score']?.[0]),
        toefl_no_band_less_than: this.parseNumber(program.toefl_no_band_less_than?.[0] || program['No ban less than']?.[0]),
        pte_score: this.parseNumber(program.pte_score?.[0] || program['PTE Score']?.[0]),
        pte_no_band_less_than: this.parseNumber(program.pte_no_band_less_than?.[0] || program['PTE No band less than']?.[0]),
        det_score: this.parseNumber(program.det_score?.[0] || program['DET Score']?.[0]),
        det_no_band_less_than: this.parseNumber(program.det_no_band_less_than?.[0] || program['DET No band less than']?.[0]),
        tolc_score: this.parseNumber(program.tolc_score?.[0] || program['TOLC Score']?.[0]),
        sat_score: this.parseNumber(program.sat_score?.[0] || program['SAT Score']?.[0]),
        gre_score: this.parseNumber(program.gre_score?.[0] || program['GRE Score']?.[0]),
        gmat_score: this.parseNumber(program.gmat_score?.[0] || program['GMAT Score']?.[0]),
        cents_score: this.parseNumber(program.cents_score?.[0] || program['CENTS Score']?.[0]),
        til_score: this.parseNumber(program.til_score?.[0] || program['TIL Score']?.[0]),
        arched_test: program.arched_test?.[0] || program['ARCHED Test']?.[0],
        application_fees: this.parseNumber(program.application_fees?.[0] || program['Application Fees']?.[0]),
        additional_requirements: program.additional_requirements?.[0] || program['Additional Requirement']?.[0],
        remarks: program.remarks?.[0] || program.Remarks?.[0],
      });
    });

    return programs.filter(program => program.university && program.programme_name);
  }

  // Helper function to parse numbers
  private parseNumber(value: any): number | undefined {
    if (!value) return undefined;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  // Helper function to parse dates
  private parseDate(value: any): string | undefined {
    if (!value) return undefined;
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date.toISOString().split('T')[0];
    } catch {
      return undefined;
    }
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