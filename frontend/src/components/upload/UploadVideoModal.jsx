import { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    closeUploadModal,
    uploadVideo,
    resetUploadState,
} from "../../store/slices/videoSlice";
import crossIcon from "../../assets/icons/cross_icon.svg";

const UploadVideoModal = () => {
    const dispatch = useDispatch();
    const { isUploadModalOpen, uploading, uploadSuccess, uploadError } =
        useSelector((state) => state.video);

    // Local state
    const [step, setStep] = useState(1); // 1 = select file, 2 = details
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [errors, setErrors] = useState({});

    const videoInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const resetForm = useCallback(() => {
        setStep(1);
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setThumbnail(null);
        setThumbnailPreview(null);
        setTitle("");
        setDescription("");
        setDragActive(false);
        setErrors({});
        dispatch(resetUploadState());
    }, [dispatch]);

    const handleClose = () => {
        resetForm();
        dispatch(closeUploadModal());
    };

    // --- Drag & Drop handlers ---
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleVideoSelect(e.dataTransfer.files[0]);
        }
    };

    const handleVideoSelect = (file) => {
        if (!file.type.startsWith("video/")) {
            setErrors({ video: "Please select a valid video file" });
            return;
        }
        setErrors({});
        setVideoFile(file);
        setVideoPreviewUrl(URL.createObjectURL(file));
        setStep(2);
    };

    const handleVideoInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleVideoSelect(e.target.files[0]);
        }
    };

    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                thumbnail: "Please select a valid image",
            }));
            return;
        }
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, thumbnail: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!thumbnail) newErrors.thumbnail = "Thumbnail is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpload = async () => {
        if (!validate()) return;
        const formData = new FormData();
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        dispatch(uploadVideo(formData));
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        if (bytes < 1024 * 1024 * 1024)
            return (bytes / (1024 * 1024)).toFixed(1) + " MB";
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    };

    if (!isUploadModalOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl mx-4 rounded-2xl bg-neutral-900 border border-neutral-700/50 shadow-2xl overflow-hidden animate-[modalIn_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                    <h2 className="text-lg font-semibold text-white tracking-tight">
                        Upload video
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 rounded-full hover:bg-neutral-800 transition-colors duration-200"
                    >
                        <img src={crossIcon} alt="Close" className="w-5 h-5 invert" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* ====== STEP 1: File Selection ====== */}
                    {step === 1 && (
                        <div
                            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 py-16 px-6 cursor-pointer ${dragActive
                                    ? "border-red-500 bg-red-500/10"
                                    : "border-neutral-700 hover:border-neutral-500 bg-neutral-800/30"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => videoInputRef.current?.click()}
                        >
                            {/* Upload Icon */}
                            <div
                                className={`mb-5 rounded-full p-5 transition-all duration-300 ${dragActive ? "bg-red-500/20" : "bg-neutral-800"
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-10 h-10 transition-colors duration-300 ${dragActive ? "text-red-400" : "text-neutral-400"
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                    />
                                </svg>
                            </div>

                            <p className="text-neutral-300 text-base font-medium mb-1">
                                Drag and drop a video file to upload
                            </p>
                            <p className="text-neutral-500 text-sm mb-5">
                                Your video will remain private until you publish it
                            </p>

                            <button
                                type="button"
                                className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-neutral-200 transition-colors duration-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    videoInputRef.current?.click();
                                }}
                            >
                                Select file
                            </button>

                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleVideoInputChange}
                            />

                            {errors.video && (
                                <p className="mt-3 text-red-400 text-sm">{errors.video}</p>
                            )}
                        </div>
                    )}

                    {/* ====== STEP 2: Details ====== */}
                    {step === 2 && !uploadSuccess && (
                        <div className="space-y-5">
                            {/* Video file info bar */}
                            <div className="flex items-center gap-3 rounded-lg bg-neutral-800/60 border border-neutral-700/50 p-3">
                                <div className="shrink-0 rounded-lg overflow-hidden w-20 h-14 bg-neutral-700">
                                    {videoPreviewUrl && (
                                        <video
                                            src={videoPreviewUrl}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium truncate">
                                        {videoFile?.name}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {formatFileSize(videoFile?.size || 0)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setVideoFile(null);
                                        setVideoPreviewUrl(null);
                                    }}
                                    className="text-neutral-500 hover:text-white text-xs transition-colors px-2 py-1 rounded hover:bg-neutral-700"
                                >
                                    Change
                                </button>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Add a title that describes your video"
                                    maxLength={100}
                                    className={`w-full rounded-lg bg-neutral-800 border px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-red-500/30 ${errors.title
                                            ? "border-red-500"
                                            : "border-neutral-700 focus:border-neutral-500"
                                        }`}
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.title && (
                                        <p className="text-red-400 text-xs">{errors.title}</p>
                                    )}
                                    <p className="text-neutral-600 text-xs ml-auto">
                                        {title.length}/100
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell viewers about your video"
                                    maxLength={5000}
                                    rows={4}
                                    className={`w-full rounded-lg bg-neutral-800 border px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none resize-none transition-all duration-200 focus:ring-2 focus:ring-red-500/30 ${errors.description
                                            ? "border-red-500"
                                            : "border-neutral-700 focus:border-neutral-500"
                                        }`}
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.description && (
                                        <p className="text-red-400 text-xs">{errors.description}</p>
                                    )}
                                    <p className="text-neutral-600 text-xs ml-auto">
                                        {description.length}/5000
                                    </p>
                                </div>
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                    Thumbnail <span className="text-red-400">*</span>
                                </label>
                                <div className="flex items-start gap-4">
                                    {/* Thumbnail preview / upload box */}
                                    <div
                                        className={`relative w-40 h-24 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 group ${errors.thumbnail
                                                ? "border-red-500 bg-red-500/5"
                                                : "border-neutral-700 hover:border-neutral-500 bg-neutral-800/50"
                                            }`}
                                        onClick={() => thumbnailInputRef.current?.click()}
                                    >
                                        {thumbnailPreview ? (
                                            <>
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Thumbnail preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                    <span className="text-white text-xs font-medium">
                                                        Change
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 text-neutral-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={1.5}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                                                    />
                                                </svg>
                                                <span className="text-neutral-500 text-[10px]">
                                                    Upload
                                                </span>
                                            </div>
                                        )}
                                        <input
                                            ref={thumbnailInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleThumbnailSelect}
                                        />
                                    </div>
                                    <p className="text-neutral-500 text-xs leading-relaxed pt-1">
                                        Select a picture that shows what's in your video. A good
                                        thumbnail stands out and draws viewers' attention.
                                    </p>
                                </div>
                                {errors.thumbnail && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {errors.thumbnail}
                                    </p>
                                )}
                            </div>

                            {/* Upload error */}
                            {uploadError && (
                                <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                                    {uploadError}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ====== Success State ====== */}
                    {uploadSuccess && (
                        <div className="flex flex-col items-center py-10">
                            <div className="rounded-full bg-emerald-500/10 p-5 mb-5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-12 h-12 text-emerald-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Video uploaded!
                            </h3>
                            <p className="text-neutral-400 text-sm text-center max-w-xs">
                                Your video has been uploaded successfully. It's set to
                                unpublished — go to your channel to publish it.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800">
                    {step === 2 && !uploadSuccess && (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setVideoFile(null);
                                    setVideoPreviewUrl(null);
                                }}
                                disabled={uploading}
                                className="rounded-full px-5 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-40"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading}
                                className="rounded-full bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-neutral-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {uploading && (
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                )}
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </>
                    )}
                    {uploadSuccess && (
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-full bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-neutral-200 transition-colors duration-200"
                        >
                            Done
                        </button>
                    )}
                </div>
            </div>

            {/* Keyframe animation */}
            <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default UploadVideoModal;
