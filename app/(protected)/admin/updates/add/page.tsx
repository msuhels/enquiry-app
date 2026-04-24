"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SaveIcon, MailIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Link as CKLink,
  List,
  Heading,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageResize,
  ImageUpload,
  Undo,
  AutoImage,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

import Breadcrumbs from "@/components/ui/breadCrumbs";
import { useFetch } from "@/hooks/api/useFetch";

export default function NewUpdatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [editorData, setEditorData] = useState("");
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const { data: userData } = useFetch("/api/admin/users/getAuthUser");

  /**
   * Upload image to Supabase
   */
  const uploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "/api/admin/announcements/upload-image",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.url;
  };

  /**
   * Custom CKEditor Upload Adapter
   */
  class MyUploadAdapter {
    loader: any;

    constructor(loader: any) {
      this.loader = loader;
    }

    async upload() {
      const file = await this.loader.file;
      const url = await uploadImageToServer(file);

      toast.success("Image uploaded successfully");

      return {
        default: url,
      };
    }

    abort() {}
  }

  function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return new MyUploadAdapter(loader);
    };
  }

  /**
   * Save announcement
   */
  const createAnnouncement = async () => {
    if (!announcementTitle.trim()) {
      toast.error("Please enter announcement title");
      return null;
    }

    if (!editorData.trim()) {
      toast.error("Please enter announcement content");
      return null;
    }

    const userId = userData?.userDetails?.id;

    if (!userId) {
      toast.error("Unable to identify logged in user");
      return null;
    }

    const response = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: announcementTitle.trim(),
        content: editorData,
        created_by: userId,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create announcement");
    }

    return data.data;
  };

  /**
   * Send emails
   */
  const sendAnnouncementEmail = async (
    announcementId: string
  ) => {
    const response = await fetch(
      "/api/admin/announcements/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          announcementId,
          title: announcementTitle.trim(),
          content: editorData,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to send emails");
    }

    return data;
  };

  /**
   * Save only
   */
  const handleSaveOnly = async () => {
    setIsSubmitting(true);

    try {
      const announcement = await createAnnouncement();

      if (!announcement) return;

      toast.success("Announcement saved successfully!");
      router.push("/admin/updates");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
      setShowEmailDialog(false);
    }
  };

  /**
   * Save and send email
   */
  const handleSaveAndSend = async () => {
    setIsSubmitting(true);

    try {
      const announcement = await createAnnouncement();

      if (!announcement) return;

      const emailResult = await sendAnnouncementEmail(
        announcement.id
      );

      toast.success(
        `Announcement saved! Email sent to ${emailResult.sentCount} users.`
      );

      router.push("/admin/updates");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
      setShowEmailDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      {showEmailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Send Announcement?
            </h2>

            <p className="mt-3 text-gray-600">
              Would you like to send this announcement
              to all registered users via email?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleSaveOnly}
                disabled={isSubmitting}
                className="rounded-lg border px-5 py-2.5 hover:bg-gray-50"
              >
                Save Only
              </button>

              <button
                onClick={handleSaveAndSend}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-[#3a3886] px-5 py-2.5 text-white hover:bg-[#2d2b6b]"
              >
                <MailIcon className="h-4 w-4" />
                Save & Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#3a3886]">
            Create Announcement
          </h1>

          <p className="mt-2 text-xl text-gray-600">
            Create a professional announcement
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-lg font-semibold text-gray-700">
                Title
              </label>

              <input
                type="text"
                value={announcementTitle}
                onChange={(e) =>
                  setAnnouncementTitle(e.target.value)
                }
                placeholder="Enter announcement title"
                className="w-full rounded-xl border px-4 py-3 text-lg focus:border-[#3a3886] focus:outline-none focus:ring-2 focus:ring-[#3a3886]/20"
              />
            </div>

            {/* CKEditor */}
            <div className="overflow-hidden rounded-xl border">
              <CKEditor
                editor={ClassicEditor}
                data={editorData}
                config={{
                  licenseKey: "GPL",
                  plugins: [
                    Essentials,
                    Paragraph,
                    Bold,
                    Italic,
                    Underline,
                    CKLink,
                    List,
                    Heading,
                    Image,
                    ImageToolbar,
                    ImageCaption,
                    ImageResize,
                    ImageUpload,
                    Undo,
                    AutoImage,
                  ],
                  toolbar: [
                    "undo",
                    "redo",
                    "|",
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "link",
                    "uploadImage",
                    "|",
                    "bulletedList",
                    "numberedList",
                  ],
                  image: {
                    toolbar: [
                      "imageTextAlternative",
                      "|",
                      "imageStyle:inline",
                      "imageStyle:block",
                      "imageStyle:side",
                      "|",
                      "resizeImage",
                    ],
                  },
                  extraPlugins: [
                    MyCustomUploadAdapterPlugin,
                  ],
                }}
                onReady={(editor) => {
                  setEditorInstance(editor);
                }}
                onChange={(_, editor) => {
                  setEditorData(editor.getData());
                }}
              />
            </div>

            <p className="text-sm text-gray-500">
              Images are automatically uploaded to
              Supabase Storage when inserted.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <Link
            href="/admin/updates"
            className="rounded-xl bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
          >
            Cancel
          </Link>

          <button
            onClick={() => setShowEmailDialog(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-[#3a3886] px-6 py-3 text-white hover:bg-[#2d2b6b] disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent" />
            ) : (
              <SaveIcon className="h-5 w-5" />
            )}

            {isSubmitting
              ? "Processing..."
              : "Save Announcement"}
          </button>
        </div>
      </div>
    </div>
  );
}