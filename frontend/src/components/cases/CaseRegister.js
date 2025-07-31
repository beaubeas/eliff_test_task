import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Scale, Upload, ArrowLeft } from "lucide-react";
import { caseAPI } from "../../lib/api";
import { getStoredUser } from "../../lib/auth";

export default function CaseRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [proofPreview, setProofPreview] = useState(null);
  const [uploadedProof, setUploadedProof] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }

      const allowedTypes = [
        "image/",
        "video/",
        "audio/",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const isAllowed = allowedTypes.some(
        (type) => file.type.startsWith(type) || file.type === type
      );

      if (!isAllowed) {
        toast.error("Please select a valid file type");
        return;
      }

      setUploadedProof(file);

      // Create preview for images only
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setProofPreview(file.name);
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = getStoredUser();
      if (!user) {
        toast.error("User not found. Please login again.");
        navigate("/auth/login");
        return;
      }

      if (!uploadedProof) {
        toast.error("Please upload proof documents");
        setIsLoading(false);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("caseType", parseInt(data.caseType));
      formData.append("description", data.description);
      formData.append("oppositePartyName", data.oppositePartyName);
      formData.append("oppositePartyContact", data.oppositePartyContact);
      formData.append("oppositePartyAddress", data.oppositePartyAddress);
      formData.append("issuePendingStatus", data.issuePendingStatus);
      formData.append("proof", uploadedProof);

      await caseAPI.register(formData);
      toast.success("Case registered successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Case registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Case registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                ResolveIt
              </span>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Register New Case
          </h1>
          <p className="mt-2 text-gray-600">
            Provide details about your dispute to start the mediation process.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Case Information
            </h2>
          </div>
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Case Type */}
              <div>
                <label
                  htmlFor="caseType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Case Type
                </label>
                <select
                  {...register("caseType", {
                    required: "Case type is required",
                  })}
                  className="input-field mt-1"
                >
                  <option value="">Select case type</option>
                  <option value="0">Family</option>
                  <option value="1">Business</option>
                  <option value="2">Criminal</option>
                </select>
                {errors.caseType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.caseType.message}
                  </p>
                )}
              </div>

              {/* Issue Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Issue Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Issue description is required",
                    minLength: {
                      value: 50,
                      message: "Description must be at least 50 characters",
                    },
                  })}
                  rows={4}
                  className="input-field mt-1"
                  placeholder="Describe your dispute in detail..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Opposite Party Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Opposite Party Details
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="oppositePartyName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      {...register("oppositePartyName", {
                        required: "Opposite party name is required",
                      })}
                      type="text"
                      className="input-field mt-1"
                      placeholder="Enter opposite party name"
                    />
                    {errors.oppositePartyName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.oppositePartyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="oppositePartyContact"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Contact
                    </label>
                    <input
                      {...register("oppositePartyContact", {
                        required: "Contact information is required",
                      })}
                      type="text"
                      className="input-field mt-1"
                      placeholder="Phone number or email"
                    />
                    {errors.oppositePartyContact && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.oppositePartyContact.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="oppositePartyAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <textarea
                    {...register("oppositePartyAddress", {
                      required: "Address is required",
                    })}
                    rows={3}
                    className="input-field mt-1"
                    placeholder="Enter complete address"
                  />
                  {errors.oppositePartyAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.oppositePartyAddress.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Legal Status */}
              <div>
                <label
                  htmlFor="issuePendingStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Legal Status
                </label>
                <textarea
                  {...register("issuePendingStatus", {
                    required: "Legal status information is required",
                  })}
                  rows={3}
                  className="input-field mt-1"
                  placeholder="Is this case pending in any court or police station? If yes, provide case number, FIR number, court/police station name, etc."
                />
                {errors.issuePendingStatus && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.issuePendingStatus.message}
                  </p>
                )}
              </div>

              {/* Proof Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proof Documents
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {proofPreview ? (
                      <div className="mb-4">
                        {proofPreview.startsWith("data:image") ? (
                          <img
                            src={proofPreview}
                            alt="Proof Preview"
                            className="mx-auto h-32 w-auto rounded-md object-cover"
                          />
                        ) : (
                          <div className="mx-auto h-32 w-32 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-sm text-gray-500">
                              File uploaded
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="proof-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload proof documents</span>
                        <input
                          id="proof-upload"
                          name="proof-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                          onChange={handleProofUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Images, videos, audio, PDF, DOC up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Registering Case..." : "Register Case"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
