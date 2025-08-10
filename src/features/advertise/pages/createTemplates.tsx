import { useState, type SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function CreateTemplatePage() {
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');
  const [ctaButtons, setCtaButtons] = useState([
    { label: '', url: '' }, // One default CTA
  ]);

  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
      'application/pdf': [],
      'video/*': [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: SetStateAction<File | null>[]) => {
      setUploadedFile(acceptedFiles[0]);
    },
  });

  const hasPreviewContent =
    !!header ||
    !!body ||
    !!footer ||
    ctaButtons.some(btn => btn.label && btn.url) ||
    !!uploadedFile;

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="flex justify-end p-4 border-b">
        <Button className="bg-green-600 text-white hover:bg-green-700">
          Send to Review
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Section - Input Fields */}
        <div className="w-2/3 p-6 overflow-y-auto space-y-4 border-r">
          <h2 className="text-2xl font-semibold mb-4">
            {templateName || 'Template Name'}
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Template Name</label>
            <Input
              placeholder="Template Name"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
            />

            <label className="block text-sm font-medium">Category</label>
            <Select
              value={templateCategory}
              onValueChange={setTemplateCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="otp">OTP</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>

            <label className="block text-sm font-medium">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
              </SelectContent>
            </Select>
            <label className="block text-sm font-medium mt-4">
              Upload Media
            </label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer hover:bg-gray-50 relative"
            >
              <input
                {...getInputProps({
                  accept: `
                        image/*,
                        application/pdf,
                        application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                        application/vnd.ms-excel,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                        application/vnd.ms-powerpoint,
                        application/vnd.openxmlformats-officedocument.presentationml.presentation,
                        text/plain,
                        video/mp4,
                        video/3gpp,
                        video/avi,
                        video/mkv,
                        video/quicktime,
                        video/x-flv
                        `.replace(/\s+/g, ''),
                })}
              />

              {isDragActive ? (
                <p>Drop the file here ...</p>
              ) : uploadedFile ? (
                <div className="flex items-center justify-between">
                  <p className="truncate max-w-[80%]">{uploadedFile.name}</p>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <p>
                  Drag & drop an image, video, or document here, or click to
                  select
                </p>
              )}
            </div>

            <label className="block text-sm font-medium">Header Message</label>
            <Input
              placeholder="Header Message"
              value={header}
              onChange={e => setHeader(e.target.value)}
            />

            <label className="block text-sm font-medium">Body Message</label>
            <Textarea
              placeholder="Body Message"
              value={body}
              onChange={e => setBody(e.target.value)}
            />

            <label className="block text-sm font-medium">
              Footer Message (optional)
            </label>
            <Input
              placeholder="Footer Message"
              value={footer}
              onChange={e => setFooter(e.target.value)}
            />

            <div className="grid gap-4">
              {ctaButtons.map((cta, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center"
                >
                  {/* CTA Label Input */}
                  <div>
                    <label className="block text-sm font-medium">
                      CTA Label
                    </label>
                    <Input
                      placeholder="Visit Now"
                      value={cta.label}
                      onChange={e => {
                        const updated = [...ctaButtons];
                        updated[index].label = e.target.value;
                        setCtaButtons(updated);
                      }}
                    />
                  </div>

                  {/* CTA URL Input */}
                  <div>
                    <label className="block text-sm font-medium">CTA URL</label>
                    <Input
                      placeholder="https://..."
                      value={cta.url}
                      onChange={e => {
                        const updated = [...ctaButtons];
                        updated[index].url = e.target.value;
                        setCtaButtons(updated);
                      }}
                    />
                  </div>

                  {/* Action Button: Add or Delete */}
                  <div className="flex items-end justify-center h-full pt-6">
                    {index === 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10"
                        onClick={() => {
                          if (ctaButtons.length >= 3) {
                            setShowLimitDialog(true);
                          } else {
                            setCtaButtons([
                              ...ctaButtons,
                              { label: '', url: '' },
                            ]);
                          }
                        }}
                      >
                        + Add CTA
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const filtered = ctaButtons.filter(
                            (_, i) => i !== index
                          );
                          setCtaButtons(filtered);
                        }}
                      >
                        <Trash2 className="w-5 h-5 " />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Media */}
          </div>
        </div>

        {/* Right Section - WhatsApp Preview */}
        <div className="flex-1 border-l p-4 bg-white flex items-center justify-center">
          <div className="bg-[#ece5dd] w-[260px] h-[500px] rounded-2xl shadow-lg border overflow-hidden relative flex flex-col border-5 border-black">
            {/* Top bar */}
            <div className="bg-[#075e54] text-white px-4 py-2 text-sm font-medium">
              WhatsApp Preview
            </div>

            {/* Message preview */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden ">
              <div
                className={`bg-white rounded-lg text-sm max-w-xs ml-2 shadow-md transition-all duration-300 m-6 flex flex-col ${
                  hasPreviewContent ? 'px-4 py-3' : 'px-2 py-1 text-gray-400'
                }`}
              >
                {hasPreviewContent ? (
                  <>
                    {/* ✅ Image Preview */}
                    {uploadedFile && uploadedFile.type.startsWith('image/') && (
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Uploaded preview"
                        className="rounded-md mb-2 max-h-32 object-cover"
                      />
                    )}

                    {/* ✅ Video Preview */}
                    {uploadedFile && uploadedFile.type.startsWith('video/') && (
                      <>
                        <video
                          controls
                          className="rounded-md mb-2 max-h-32 w-full object-cover"
                        >
                          <source
                            src={URL.createObjectURL(uploadedFile)}
                            type={uploadedFile.type}
                          />
                          Your browser does not support previewing this video
                          format.
                        </video>
                      </>
                    )}

                    {/* ✅ PDF Preview */}
                    {uploadedFile &&
                      uploadedFile.type === 'application/pdf' && (
                        <div className="text-sm text-gray-800 font-medium mb-2">
                          📄 {uploadedFile.name}
                        </div>
                      )}

                    {/* ❌ Unsupported File Format Fallback */}
                    {uploadedFile &&
                      !uploadedFile.type.startsWith('image/') &&
                      !uploadedFile.type.startsWith('video/') &&
                      uploadedFile.type !== 'application/pdf' && (
                        <p className="text-sm text-red-500">
                          This file type is not supported for preview.
                        </p>
                      )}

                    {header && (
                      <div className="font-semibold text-sm mb-1 break-words w-full max-w-full">
                        {header}
                      </div>
                    )}
                    {body && (
                      <div className="text-gray-800 whitespace-pre-wrap break-words w-full max-w-full">
                        {body}
                      </div>
                    )}
                    {footer && (
                      <div className="text-gray-600 text-xs mt-2 break-words w-full max-w-full">
                        {footer}
                      </div>
                    )}
                    {ctaButtons.filter(btn => btn.label && btn.url).length >
                      0 && (
                      <>
                        <hr className="border-t border-gray-300 mt-3 mb-2" />
                        <div className="flex flex-col items-center gap-2">
                          {ctaButtons
                            .filter(btn => btn.label && btn.url)
                            .map((btn, idx) => (
                              <a
                                key={idx}
                                href={btn.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[#25D366] text-sm font-medium"
                              >
                                <span className="border border-[#25D366] rounded p-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="#25D366"
                                    className="w-4 h-4"
                                  >
                                    <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3Z" />
                                  </svg>
                                </span>
                                {btn.label}
                              </a>
                            ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <span>Message preview will appear here</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Limit Reached</DialogTitle>
            </DialogHeader>
            <p>You can only add up to 3 CTA buttons.</p>
            <DialogFooter>
              <Button onClick={() => setShowLimitDialog(false)}>Okay</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
