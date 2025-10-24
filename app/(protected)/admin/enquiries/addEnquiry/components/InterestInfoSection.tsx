// src/app/enquiry/components/InterestInfoSection.tsx
"use client";

import { GraduationCapIcon } from "lucide-react";
import FormInput from "@/components/form/formInput";
import { createClient } from "@/lib/supabase/adapters/client";
import { useEffect, useState } from "react";

interface InterestInfo {
  interested_level: string;
  study_area: string;
  discipline_area: string;
  what_to_pursue: string;
  percentage: string;
  study_year: string;
}

interface InterestInfoSectionProps {
  interestInfo: InterestInfo;
  handleInterestChange: (field: string, value: string) => void;
}

export default function InterestInfoSection({
  interestInfo,
  handleInterestChange,
}: InterestInfoSectionProps) {
  const supabase = createClient();

  const [studyLevelOptions, setStudyLevelOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [streamOptions, setStreamOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Fetch study levels on mount
  useEffect(() => {
    async function fetchStudyLevels() {
      const { data: levels } = await supabase
        .from("education_levels")
        .select("*");
      setStudyLevelOptions(
        levels?.map((l) => ({ value: l.id, label: l.level_name })) || []
      );
    }
    fetchStudyLevels();
  }, []);

  // Handle Interest / Study Level change
  const handleStudyLevelChange = async (levelId: string) => {
    handleInterestChange("interested_level", levelId);

    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .eq("level_id", levelId);

    setCourseOptions(
      courses?.map((c) => ({ value: c.id, label: c.course_name })) || []
    );

    // Reset dependent fields
    handleInterestChange("study_area", "");
    handleInterestChange("discipline_area", "");
    setStreamOptions([]);
  };

  // Handle Area of Study change
  const handleCourseChange = async (courseId: string) => {
    handleInterestChange("study_area", courseId);

    const { data: streams } = await supabase
      .from("streams")
      .select("*")
      .eq("course", courseId);

    setStreamOptions(streams?.map((s) => ({ value: s.id, label: s.name })) || []);

    handleInterestChange("discipline_area", "");
  };

  return (
    <div className="bg-white shadow rounded-lg mt-6 p-6 mb-6">
      <div className="flex items-center mb-4">
        <GraduationCapIcon className="h-5 w-5 mr-2 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Interest Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Interest"
          name="interested_level"
          type="select"
          select={studyLevelOptions}
          value={interestInfo.interested_level || ""}
          onChange={(e) => handleStudyLevelChange(e.target.value)}
        />

        <FormInput
          label="Area of Study (Course)"
          name="study_area"
          type="select"
          select={courseOptions}
          value={interestInfo.study_area || ""}
          onChange={(e) => handleCourseChange(e.target.value)}
        />

        <FormInput
          label="Discipline Area / Stream"
          name="discipline_area"
          type="select"
          select={streamOptions}
          value={interestInfo.discipline_area || ""}
          onChange={(e) =>
            handleInterestChange("discipline_area", e.target.value)
          }
        />

        <FormInput
          label="What You Want to Pursue"
          name="what_to_pursue"
          type="text"
          value={interestInfo.what_to_pursue}
          onChange={(e) =>
            handleInterestChange(e.target.name, e.target.value)
          }
        />

        <FormInput
          label="Percentage or GPA"
          name="percentage"
          type="number"
          step={0.01}
          min={0}
          max={100}
          value={interestInfo.percentage}
          onChange={(e) =>
            handleInterestChange(e.target.name, e.target.value)
          }
        />

        <FormInput
          label="Study Year"
          name="study_year"
          type="text"
          value={interestInfo.study_year}
          onChange={(e) =>
            handleInterestChange(e.target.name, e.target.value)
          }
        />
      </div>
    </div>
  );
}
