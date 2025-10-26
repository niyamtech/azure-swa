import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CreditCard,
  Building2,
  File,
  CheckCircle,
  Menu,
  Home,
  FolderOpen,
  Phone,
  LogIn,
  Trash2,
  User,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Smile,
} from "lucide-react";

const Logo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" rx="10" fill="#E15C31" />
    <path
      d="M12 14L20 10L28 14V26L20 30L12 26V14Z"
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M20 10V30" stroke="white" strokeWidth="2" />
    <path d="M12 14L28 26" stroke="white" strokeWidth="2" />
    <path d="M28 14L12 26" stroke="white" strokeWidth="2" />
  </svg>
);

const AppHeader = ({ onMenuClick }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-2xl font-bold text-gray-900">TaxVault</h1>
        </div>

        <nav className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#E15C31] transition">
            <Home size={18} />
            <span>Home</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-[#E15C31] bg-orange-50 rounded-lg font-medium">
            <Upload size={18} />
            <span>Upload</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#E15C31] transition">
            <FolderOpen size={18} />
            <span>Documents</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#E15C31] transition">
            <Phone size={18} />
            <span>Contact</span>
          </button>
          <div className="flex items-center gap-3 ml-4 text-gray-700">
            <User size={20} className="hover:text-[#E15C31] cursor-pointer" />
            <Settings
              size={20}
              className="hover:text-[#E15C31] cursor-pointer"
            />
          </div>
        </nav>

        <button onClick={onMenuClick} className="md:hidden p-2 text-gray-700">
          <Menu size={24} />
        </button>
      </div>
    </div>
  </header>
);

const ProgressBar = ({ value }) => (
  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
    <div
      className="h-full bg-[#E15C31] transition-all duration-500 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
);

const DropzoneCard = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesSelected(droppedFiles);
  };
  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesSelected(selectedFiles);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
        isDragging
          ? "border-[#E15C31] bg-orange-50"
          : "border-gray-300 bg-gray-50 hover:border-[#E15C31] hover:bg-orange-50"
      }`}
    >
      <Upload size={48} className="text-[#E15C31] mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-900">
        Drag and drop files here
      </h3>
      <p className="text-gray-600 mb-4">or click to browse from your device</p>
      <button className="px-6 py-3 bg-[#E15C31] text-white rounded-xl font-medium hover:bg-orange-600 transition">
        Browse Files
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      <p className="mt-4 text-sm text-gray-500">
        Supported: PDF, JPG, PNG, DOC (Max 10MB per file)
      </p>
    </div>
  );
};

const FileTile = ({ file, onRemove, progress }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
    <FileText size={32} className="text-gray-500 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 truncate">{file.name}</p>
      <p className="text-sm text-gray-500">
        {(file.size / 1024).toFixed(1)} KB
      </p>
      {progress !== undefined && progress < 100 && (
        <div className="mt-2">
          <ProgressBar value={progress} />
        </div>
      )}
      {progress === 100 && (
        <div className="flex items-center gap-1 mt-1">
          <CheckCircle size={14} className="text-emerald-500" />
          <span className="text-sm text-emerald-500 font-medium">Uploaded</span>
        </div>
      )}
    </div>
    <button
      onClick={onRemove}
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
    >
      <Trash2 size={18} />
    </button>
  </div>
);

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [documentType, setDocumentType] = useState("");
  const [comment, setComment] = useState("");

  const documentTypes = [
    { label: "Receipt", icon: <CreditCard size={20} />, value: "receipt" },
    { label: "Invoice", icon: <FileText size={20} />, value: "invoice" },
    { label: "ID Document", icon: <User size={20} />, value: "id" },
    { label: "Bank Statement", icon: <Building2 size={20} />, value: "bank" },
    { label: "Other", icon: <File size={20} />, value: "other" },
  ];

  const steps = ["Welcome", "Select & Upload", "Comments", "Review", "Done"];
  const overallProgress = ((activeStep + 1) / steps.length) * 100;

  const handleFilesSelected = (newFiles) => {
    const validFiles = newFiles.filter((f) => f.size <= 10 * 1024 * 1024);
    setFiles([...files, ...validFiles]);
    validFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        if (progress >= 100) clearInterval(interval);
      }, 200);
    });
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const next = () => setActiveStep((s) => s + 1);
  const back = () => setActiveStep((s) => s - 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Document Upload
          </h2>
          <p className="text-lg text-gray-600">
            Follow the simple steps to upload and submit your documents.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-medium text-gray-900">Progress</span>
            <span className="text-gray-600">{Math.round(overallProgress)}%</span>
          </div>
          <ProgressBar value={overallProgress} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 min-h-[400px]">
          {activeStep === 0 && (
            <div className="text-center py-16">
              <Smile size={48} className="text-[#E15C31] mx-auto mb-4" />
              <h3 className="text-3xl font-semibold text-gray-900 mb-3">
                Welcome to TaxVault
              </h3>
              <p className="text-gray-600 mb-8">
                Upload your tax documents quickly and securely in just a few
                steps.
              </p>
              <button
                onClick={next}
                className="px-8 py-3 bg-[#E15C31] text-white rounded-xl hover:bg-orange-600 transition font-medium"
              >
                Start Now
              </button>
            </div>
          )}

          {activeStep === 1 && (
            <>
              <h3 className="text-2xl font-semibold mb-2">
                Select & Upload Documents
              </h3>
              <p className="text-gray-600 mb-6">
                Choose a type and upload your files.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {documentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setDocumentType(type.value)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium border transition-all ${
                      documentType === type.value
                        ? "bg-[#E15C31] text-white border-[#E15C31]"
                        : "bg-gray-100 text-gray-700 hover:border-[#E15C31]"
                    }`}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>

              <DropzoneCard onFilesSelected={handleFilesSelected} />
              <div className="mt-6 space-y-3">
                {files.map((file, i) => (
                  <FileTile
                    key={i}
                    file={file}
                    onRemove={() => handleRemoveFile(i)}
                    progress={uploadProgress[file.name] || 0}
                  />
                ))}
              </div>
            </>
          )}

          {activeStep === 2 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Add an Optional Comment
              </h3>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Any notes or details you’d like to share..."
                className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-[#E15C31] focus:outline-none"
              />
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Review & Submit</h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <p className="text-gray-600">
                  <strong>Document Type:</strong> {documentType || "Not selected"}
                </p>
                <p className="text-gray-600">
                  <strong>Files:</strong> {files.length} uploaded
                </p>
                {comment && (
                  <p className="text-gray-600">
                    <strong>Comment:</strong> {comment}
                  </p>
                )}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={next}
                  className="px-8 py-3 bg-[#E15C31] text-white rounded-xl hover:bg-orange-600 transition font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="text-center py-20">
              <CheckCircle
                size={64}
                className="text-emerald-500 mx-auto mb-6"
              />
              <h3 className="text-3xl font-semibold text-gray-900 mb-3">
                Thank You!
              </h3>
              <p className="text-gray-600">
                Your documents have been successfully submitted.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            disabled={activeStep === 0 || activeStep === 4}
            onClick={back}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium disabled:opacity-50 hover:bg-gray-50 transition"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          {activeStep < 3 && activeStep > 0 && (
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-3 bg-[#E15C31] text-white rounded-xl font-medium hover:bg-orange-600 transition"
            >
              Next
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-6 text-center mt-16">
        <p className="text-gray-400 text-sm">
          © 2025 TaxVault. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
