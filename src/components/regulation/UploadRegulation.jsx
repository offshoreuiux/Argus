import React, { useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import TextareaField from "../common/TextareaField";
import PrimaryButton from "../common/PrimaryButton";
import OutlinedButton from "../common/OutlinedButton";
import FileUploadField from "../common/FileUploadField";
import { useToast } from "../../contexts/ToastContext";
import UploadProgressCard from "./UploadProgressCard";
import {
  extractObligationsApi,
  normalizeRegulationApi,
  uploadRegulationApi,
} from "../../../connections/apis/regulation/regulation";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function UploadRegulation({ fetchRegulationsList }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    document: null,
    title: "",
    jurisdiction: "",
    regulationType: "",
    effectiveDate: "",
    primaryArticles: "",
  });
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PDF, DOC, or DOCX files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 500MB.");
      return;
    }

    setError("");
    setFormData((prev) => ({ ...prev, document: file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault?.();

    const missing =
      !formData.document ||
      !formData.title.trim() ||
      !formData.jurisdiction ||
      !formData.regulationType;

    if (missing) {
      showToast("Upload Failed", "Please fill all required fields.", "error");
      return;
    }

    if (error) {
      showToast("Upload Failed", error, "error");
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);

      const metadataObj = {
        title: formData.title,
        jurisdiction: formData.jurisdiction,
        regulationType: formData.regulationType,
        effectiveDate: formData.effectiveDate,
        primaryArticles: formData.primaryArticles,
      };

      const payload = {
        file: formData.document,
        metadata: JSON.stringify(metadataObj),
      };

      // ✅ 1) UPLOAD (progress will update via setProgress)
      const uploadRes = await uploadRegulationApi(payload, setProgress);
      const doc_id = uploadRes?.data?.doc_id;

      if (!doc_id) {
        throw new Error("doc_id not found in upload response");
      }
      setProgress(100);

      const normRes = await normalizeRegulationApi(doc_id);
      const normalized = normRes?.data;

      const article_ids = Array.isArray(normalized?.articles)
        ? normalized.articles.map((a) => a?.article_id || a?.id).filter(Boolean)
        : [];

      const extractPayload = {
        article_ids: article_ids.length ? article_ids : ["string"], // fallback if backend requires non-empty
        source_doc_version: "unknown",
        version: "v1",
      };

      await extractObligationsApi(doc_id, extractPayload);

      showToast(
        "Uploaded Successful",
        "Regulation uploaded, normalized, and obligations extracted successfully!",
        "success",
      );

      setFormData({
        document: null,
        title: "",
        jurisdiction: "",
        regulationType: "",
        effectiveDate: "",
        primaryArticles: "",
      });
      fetchRegulationsList();
    } catch (err) {
      console.log("upload/normalize/extract err", err);
      showToast(
        "Process Failed",
        err?.response?.data?.message || err?.message || "Something went wrong.",
        "error",
      );
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 400);
    }
  };

  const handleCancel = () => {
    if (isUploading) return;
    setFormData({
      document: null,
      title: "",
      jurisdiction: "",
      regulationType: "",
      effectiveDate: "",
      primaryArticles: "",
    });
    setError("");
  };

  return (
    <Card className="max-w-[520px]">
      <p className="text-[20px] font-bold text-[#242424] mb-4">
        Upload New Regulation
      </p>
      <div className="flex flex-col gap-4">
        <FileUploadField
          labelTitle="Regulation Document"
          required
          value={formData.document}
          accept=".pdf,.doc,.docx"
          helperText="PDF, DOC or DOCX files (max 500MB)"
          error={error && !formData.document ? error : ""}
          onFileSelect={handleFileChange}
          onRemove={() => {
            if (isUploading) return;
            setFormData((p) => ({ ...p, document: null }));
            setError("");
          }}
        />

        <InputField
          labelTitle="Regulation Title"
          required
          name="title"
          placeholder="e.g., GDPR 2018, HIPAA, PCI-DSS"
          value={formData.title}
          handleChange={handleChange}
          disabled={isUploading}
        />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            labelTitle="Jurisdiction"
            required
            name="jurisdiction"
            value={formData.jurisdiction}
            handleChange={handleChange}
            placeholder="Select jurisdiction"
            options={[
              { label: "EU", value: "EU" },
              { label: "US", value: "US" },
              { label: "UK", value: "UK" },
            ]}
            disabled={isUploading}
          />
          <SelectField
            labelTitle="Regulation Type"
            required
            name="regulationType"
            value={formData.regulationType}
            handleChange={handleChange}
            placeholder="Select type"
            options={[
              { label: "Privacy", value: "privacy" },
              { label: "Security", value: "security" },
              { label: "Financial", value: "financial" },
            ]}
            disabled={isUploading}
          />
        </div>

        <InputField
          labelTitle="Effective Date"
          type="date"
          name="effectiveDate"
          value={formData.effectiveDate}
          handleChange={handleChange}
          disabled={isUploading}
        />

        <TextareaField
          labelTitle="Primary Articles (Optional)"
          name="primaryArticles"
          placeholder="e.g., Article 32..., Article 33..."
          value={formData.primaryArticles}
          handleChange={handleChange}
          rows={4}
          disabled={isUploading}
        />

        {isUploading && <UploadProgressCard progress={progress} />}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-4 pt-2">
          <OutlinedButton
            className="flex-1"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </OutlinedButton>

          <PrimaryButton
            type="submit"
            className="flex-1"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Regulation"}
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
}

export default UploadRegulation;
