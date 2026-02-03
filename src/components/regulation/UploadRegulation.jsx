import React, { useRef, useState } from "react";
import Card from "../common/Card";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import TextareaField from "../common/TextareaField";
import PrimaryButton from "../common/PrimaryButton";
import OutlinedButton from "../common/OutlinedButton";
import FileUploadField from "../common/FileUploadField";
import { useToast } from "../../contexts/ToastContext";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function UploadRegulation() {
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

  const handleSubmit = (e) => {
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

    // If file validation error exists, block submit too
    if (error) {
      showToast("Upload Failed", error, "error");
      return;
    }

    console.log("Submitting Regulation:", formData);

    showToast(
      "Uploaded Successful",
      "Regulation uploaded successfully!",
      "success",
    );
  };

  return (
    <Card className="max-w-[520px]">
      <p className="text-[20px] font-bold text-[#242424] mb-4">
        Upload New Regulation
      </p>

      <div className="flex flex-col gap-4">
        {/* Regulation Document */}
        <FileUploadField
          labelTitle="Regulation Document"
          required
          value={formData.document}
          accept=".pdf,.doc,.docx"
          helperText="PDF, DOC or DOCX files (max 500MB)"
          error={error && !formData.document ? error : ""}
          onFileSelect={handleFileChange}
        />

        {/* Regulation Title */}
        <InputField
          labelTitle="Regulation Title"
          required
          name="title"
          placeholder="e.g., GDPR 2018, HIPAA, PCI-DSS"
          value={formData.title}
          handleChange={handleChange}
        />

        {/* Jurisdiction & Regulation Type */}
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
          />
        </div>

        {/* Effective Date */}
        <InputField
          labelTitle="Effective Date"
          type="date"
          name="effectiveDate"
          value={formData.effectiveDate}
          handleChange={handleChange}
        />

        {/* Primary Articles */}
        <TextareaField
          labelTitle="Primary Articles (Optional)"
          name="primaryArticles"
          placeholder="e.g., Article 32 (Security of Processing), Article 33 (Notification of a Personal Data Breach)"
          value={formData.primaryArticles}
          handleChange={handleChange}
          rows={4}
        />

        {/* Error */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <OutlinedButton
            className={"flex-1"}
            onClick={() =>
              setFormData({
                document: null,
                title: "",
                jurisdiction: "",
                regulationType: "",
                effectiveDate: "",
                primaryArticles: "",
              })
            }
          >
            Cancel
          </OutlinedButton>

          <PrimaryButton
            type="submit"
            className={"flex-1"}
            onClick={handleSubmit}
          >
            Upload Regulation
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
}

export default UploadRegulation;
