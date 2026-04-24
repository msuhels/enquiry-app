"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import Breadcrumbs from "@/components/ui/breadCrumbs";

type Announcement = {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
};

export default function ViewUpdatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(`/api/admin/announcements/${id}`);
        const data = await res.json();
        if (data.success) setAnnouncement(data.data);
      } catch (error) {
        console.error("Error fetching announcement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-600">Loading announcement...</p>
      </div>
    );

  if (!announcement)
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center text-gray-500">
        Announcement not found.
      </div>
    );

    console.log(announcement.content);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <Breadcrumbs />
        
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {announcement.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Created on{" "}
              {new Date(announcement.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="p-6">
            <div
              className="ckeditorTextContent"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}