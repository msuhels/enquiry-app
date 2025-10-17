import { Program, EnquiryFormData, Suggestion } from './types';

export class SuggestionService {
  // Generate suggestions based on enquiry criteria
  async generateSuggestions(programs: Program[], enquiry: EnquiryFormData): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = [];

    programs.forEach(program => {
      const matchScore = this.calculateMatchScore(program, enquiry);
      const reasons = this.generateMatchReasons(program, enquiry);

      if (matchScore > 0) {
        suggestions.push({
          program,
          match_score: matchScore,
          reasons
        });
      }
    });

    // Sort by match score (highest first)
    return suggestions.sort((a, b) => b.match_score - a.match_score);
  }

  // Calculate match score between program and enquiry
  private calculateMatchScore(program: Program, enquiry: EnquiryFormData): number {
    let score = 0;
    let totalPossibleScore = 0;

    // Study Level Match (30 points)
    totalPossibleScore += 30;
    if (enquiry.study_level && program.study_level) {
      if (enquiry.study_level.toLowerCase() === program.study_level.toLowerCase()) {
        score += 30;
      } else {
        score += 10; // Partial match for similar levels
      }
    } else if (program.study_level) {
      score += 5; // Default score if enquiry doesn't specify
    }

    // Study Area Match (25 points)
    totalPossibleScore += 25;
    if (enquiry.study_area && program.study_area) {
      if (enquiry.study_area.toLowerCase().includes(program.study_area.toLowerCase()) ||
          program.study_area.toLowerCase().includes(enquiry.study_area.toLowerCase())) {
        score += 25;
      } else {
        score += 10; // Partial match for related areas
      }
    } else if (program.study_area) {
      score += 5;
    }

    // University Preference Match (20 points)
    totalPossibleScore += 20;
    if (enquiry.preferred_university && program.university) {
      if (program.university.toLowerCase().includes(enquiry.preferred_university.toLowerCase())) {
        score += 20;
      } else {
        score += 5; // Partial match for similar names
      }
    } else if (program.university) {
      score += 5;
    }

    // Academic Requirements Match (15 points)
    totalPossibleScore += 15;
    const academicScore = this.calculateAcademicMatch(program, enquiry);
    score += academicScore;

    // English Language Requirements Match (10 points)
    totalPossibleScore += 10;
    const englishScore = this.calculateEnglishLanguageMatch(program, enquiry);
    score += englishScore;

    // Normalize score to percentage
    return totalPossibleScore > 0 ? (score / totalPossibleScore) * 100 : 0;
  }

  // Calculate academic requirements match
  private calculateAcademicMatch(program: Program, enquiry: EnquiryFormData): number {
    let score = 0;

    // Percentage match
    if (enquiry.percentage && program.percentage_required) {
      if (enquiry.percentage >= program.percentage_required) {
        score += 8; // Full match
      } else if (enquiry.percentage >= program.percentage_required * 0.9) {
        score += 4; // Close match
      }
    } else if (program.percentage_required) {
      score += 2; // Default if enquiry doesn't specify
    }

    // GRE Score match
    if (enquiry.gre_score && program.gre_score) {
      if (enquiry.gre_score >= program.gre_score) {
        score += 4;
      } else if (enquiry.gre_score >= program.gre_score * 0.9) {
        score += 2;
      }
    } else if (program.gre_score) {
      score += 1;
    }

    // GMAT Score match
    if (enquiry.gmat_score && program.gmat_score) {
      if (enquiry.gmat_score >= program.gmat_score) {
        score += 3;
      } else if (enquiry.gmat_score >= program.gmat_score * 0.9) {
        score += 1.5;
      }
    } else if (program.gmat_score) {
      score += 1;
    }

    return Math.min(score, 15); // Cap at 15 points
  }

  // Calculate English language requirements match
  private calculateEnglishLanguageMatch(program: Program, enquiry: EnquiryFormData): number {
    let score = 0;

    // IELTS Score match
    if (enquiry.ielts_score && program.ielts_score) {
      if (enquiry.ielts_score >= program.ielts_score) {
        score += 4;
      } else if (enquiry.ielts_score >= program.ielts_score - 0.5) {
        score += 2;
      }
    } else if (program.ielts_score) {
      score += 1;
    }

    // TOEFL Score match
    if (enquiry.toefl_score && program.toefl_score) {
      if (enquiry.toefl_score >= program.toefl_score) {
        score += 3;
      } else if (enquiry.toefl_score >= program.toefl_score - 10) {
        score += 1.5;
      }
    } else if (program.toefl_score) {
      score += 1;
    }

    // PTE Score match
    if (enquiry.pte_score && program.pte_score) {
      if (enquiry.pte_score >= program.pte_score) {
        score += 2;
      } else if (enquiry.pte_score >= program.pte_score - 5) {
        score += 1;
      }
    } else if (program.pte_score) {
      score += 1;
    }

    // DET Score match
    if (enquiry.det_score && program.det_score) {
      if (enquiry.det_score >= program.det_score) {
        score += 1;
      }
    } else if (program.det_score) {
      score += 0.5;
    }

    return Math.min(score, 10); // Cap at 10 points
  }

  // Generate reasons for match
  private generateMatchReasons(program: Program, enquiry: EnquiryFormData): string[] {
    const reasons: string[] = [];

    // Study level match
    if (enquiry.study_level && program.study_level) {
      if (enquiry.study_level.toLowerCase() === program.study_level.toLowerCase()) {
        reasons.push(`Perfect match for ${program.study_level} study level`);
      } else {
        reasons.push(`Related to your preferred ${enquiry.study_level} study level`);
      }
    }

    // Study area match
    if (enquiry.study_area && program.study_area) {
      if (enquiry.study_area.toLowerCase().includes(program.study_area.toLowerCase()) ||
          program.study_area.toLowerCase().includes(enquiry.study_area.toLowerCase())) {
        reasons.push(`Exact match in ${program.study_area} field`);
      } else {
        reasons.push(`Related field to your interest in ${enquiry.study_area}`);
      }
    }

    // University preference
    if (enquiry.preferred_university && program.university) {
      if (program.university.toLowerCase().includes(enquiry.preferred_university.toLowerCase())) {
        reasons.push(`Matches your preferred university: ${program.university}`);
      }
    }

    // Academic requirements
    if (enquiry.percentage && program.percentage_required) {
      if (enquiry.percentage >= program.percentage_required) {
        reasons.push(`You meet the academic requirements (${program.percentage_required}% required)`);
      } else {
        reasons.push(`Close to meeting academic requirements (${program.percentage_required}% required)`);
      }
    }

    // English language requirements
    if (enquiry.ielts_score && program.ielts_score) {
      if (enquiry.ielts_score >= program.ielts_score) {
        reasons.push(`IELTS score meets requirements (${program.ielts_score} required)`);
      }
    }

    if (enquiry.toefl_score && program.toefl_score) {
      if (enquiry.toefl_score >= program.toefl_score) {
        reasons.push(`TOEFL score meets requirements (${program.toefl_score} required)`);
      }
    }

    // University ranking
    if (program.university_ranking) {
      if (program.university_ranking <= 100) {
        reasons.push(`Top-ranked university (#${program.university_ranking})`);
      } else if (program.university_ranking <= 500) {
        reasons.push(`Well-ranked university (#${program.university_ranking})`);
      }
    }

    // Application deadline
    if (program.application_deadline) {
      const deadline = new Date(program.application_deadline);
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDeadline > 0) {
        reasons.push(`Application deadline: ${deadline.toLocaleDateString()} (${daysUntilDeadline} days remaining)`);
      }
    }

    // Duration
    if (program.duration) {
      reasons.push(`Program duration: ${program.duration}`);
    }

    // Campus location
    if (program.campus) {
      reasons.push(`Campus: ${program.campus}`);
    }

    return reasons;
  }

  // Filter suggestions by minimum match score
  filterSuggestions(suggestions: Suggestion[], minScore: number = 30): Suggestion[] {
    return suggestions.filter(suggestion => suggestion.match_score >= minScore);
  }

  // Get top N suggestions
  getTopSuggestions(suggestions: Suggestion[], limit: number = 10): Suggestion[] {
    return suggestions.slice(0, limit);
  }
}