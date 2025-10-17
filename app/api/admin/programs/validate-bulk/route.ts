import { NextRequest, NextResponse } from "next/server";

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

/**
 * POST - Validate programs before bulk upload
 * Returns validation errors without inserting to database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programs } = body;

    if (!Array.isArray(programs)) {
      return NextResponse.json(
        { error: "Programs must be an array" },
        { status: 400 }
      );
    }

    const validationErrors: ValidationError[] = [];

    programs.forEach((program, index) => {
      const rowNumber = index + 1;

      // Required field validation
      if (!program.university || program.university.trim() === '') {
        validationErrors.push({
          row: rowNumber,
          field: 'university',
          message: 'University is required',
          value: program.university,
        });
      }

      if (!program.programme_name || program.programme_name.trim() === '') {
        validationErrors.push({
          row: rowNumber,
          field: 'programme_name',
          message: 'Programme name is required',
          value: program.programme_name,
        });
      }

      // Number field validation
      const numberFields = [
        'university_ranking', 'percentage_required', 'ielts_score',
        'ielts_no_band_less_than', 'toefl_score', 'toefl_no_band_less_than',
        'pte_score', 'pte_no_band_less_than', 'det_score', 'det_no_band_less_than',
        'tolc_score', 'sat_score', 'gre_score', 'gmat_score',
        'cents_score', 'til_score', 'application_fees'
      ];

      numberFields.forEach(field => {
        if (program[field] !== undefined && program[field] !== null && program[field] !== '') {
          const value = Number(program[field]);
          if (isNaN(value)) {
            validationErrors.push({
              row: rowNumber,
              field,
              message: `${field} must be a valid number`,
              value: program[field],
            });
          } else if (value < 0) {
            validationErrors.push({
              row: rowNumber,
              field,
              message: `${field} cannot be negative`,
              value: program[field],
            });
          }
        }
      });

      // Date validation
      if (program.application_deadline) {
        const date = new Date(program.application_deadline);
        if (isNaN(date.getTime())) {
          validationErrors.push({
            row: rowNumber,
            field: 'application_deadline',
            message: 'Invalid date format',
            value: program.application_deadline,
          });
        }
      }

      // Score range validation
      if (program.ielts_score !== undefined && program.ielts_score !== null) {
        const score = Number(program.ielts_score);
        if (score < 0 || score > 9) {
          validationErrors.push({
            row: rowNumber,
            field: 'ielts_score',
            message: 'IELTS score must be between 0 and 9',
            value: program.ielts_score,
          });
        }
      }

      if (program.toefl_score !== undefined && program.toefl_score !== null) {
        const score = Number(program.toefl_score);
        if (score < 0 || score > 120) {
          validationErrors.push({
            row: rowNumber,
            field: 'toefl_score',
            message: 'TOEFL score must be between 0 and 120',
            value: program.toefl_score,
          });
        }
      }

      if (program.pte_score !== undefined && program.pte_score !== null) {
        const score = Number(program.pte_score);
        if (score < 0 || score > 90) {
          validationErrors.push({
            row: rowNumber,
            field: 'pte_score',
            message: 'PTE score must be between 0 and 90',
            value: program.pte_score,
          });
        }
      }
    });

    const isValid = validationErrors.length === 0;

    console.log(`LOGGING : Validated ${programs.length} programs - Valid: ${isValid}, Errors: ${validationErrors.length}`);

    return NextResponse.json({
      valid: isValid,
      totalPrograms: programs.length,
      validPrograms: programs.length - validationErrors.length,
      invalidPrograms: validationErrors.length,
      errors: validationErrors,
    });

  } catch (error) {
    console.error("API validation error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}