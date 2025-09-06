import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTemplateByIdThunk } from '@/store/slices/templateSlice';
import type { Component } from '@/types/template';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function TemplatePreviewPage() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { selectedTemplate, loading, error } = useAppSelector(
    state => state.template
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchTemplateByIdThunk(id));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!selectedTemplate) return <div>No template found</div>;

  // Extract WhatsApp preview data
  const headerComp = selectedTemplate.components?.find(
    (c: Component) => c.type === 'HEADER'
  );
  const bodyComp = selectedTemplate.components?.find(
    (c: Component) => c.type === 'BODY'
  );
  const footerComp = selectedTemplate.components?.find(
    (c: Component) => c.type === 'FOOTER'
  );
  const buttonsComp = selectedTemplate.components?.find(
    (c: Component) => c.type === 'BUTTONS'
  );

  const hasPreviewContent = headerComp || bodyComp || footerComp || buttonsComp;

  return (
    <div className="flex flex-col h-full w-full ">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold">Template Preview</h1>
        <Link to="/dashboard/advertise/templates">
          <Button variant="outline">Back to Templates</Button>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Left Section - Template Details (unchanged) */}

        <div className="pb-6">
          <p className="text-s text-black-500 uppercase tracking-wide">
            Template Name
          </p>
          <h2 className="text-2xl font-semibold mb-8">
            {selectedTemplate.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Contacts</CardTitle>
              </CardHeader>
            </Card>
            <div className="rounded-2xl border-0   p-4 shadow-sm">
              <p className="text-xs text-black-500 uppercase tracking-wide">
                Category
              </p>
              <p className="text-base font-medium text-gray-800">
                {selectedTemplate.category}
              </p>
            </div>

            {/* Language */}
            <div className="rounded-2xl border-0  p-4 shadow-sm">
              <p className="text-xs text-black-500 uppercase tracking-wide">
                Language
              </p>
              <p className="text-base font-medium text-gray-800">
                {selectedTemplate.language}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-2xl border-0  p-4 shadow-sm">
              <p className="text-xs text-black-500 uppercase tracking-wide">
                Status
              </p>
              <p
                className={`text-base font-medium ${
                  selectedTemplate.status === 'APPROVED'
                    ? 'text-black-600'
                    : selectedTemplate.status === 'REJECTED'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}
              >
                {selectedTemplate.status}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Right Section - WhatsApp Preview */}
        <div className="flex-1 p-4  flex items-center justify-center">
          <div className="bg-[#ece5dd] w-[260px] h-[500px] rounded-2xl shadow-lg border overflow-hidden relative flex flex-col border-5 border-black">
            {/* Top bar */}
            <div className="bg-[#075e54] text-white px-4 py-2 text-sm font-medium">
              WhatsApp Preview
            </div>

            {/* Message preview */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div
                className={`bg-white rounded-lg text-sm max-w-xs ml-2 shadow-md transition-all duration-300 m-6 flex flex-col ${
                  hasPreviewContent ? 'px-4 py-3' : 'px-2 py-1 text-gray-400'
                }`}
              >
                {hasPreviewContent ? (
                  <>
                    {/* ✅ Header */}
                    {headerComp?.format === 'TEXT' && (
                      <div className="font-semibold text-sm mb-1 break-words">
                        {headerComp.text}
                      </div>
                    )}
                    {headerComp?.format === 'IMAGE' &&
                      headerComp.example?.header_handle?.[0] && (
                        <img
                          src={headerComp.example.header_handle[0]}
                          alt="Header"
                          className="rounded-md mb-2 max-h-32 object-cover"
                        />
                      )}
                    {headerComp?.format === 'VIDEO' &&
                      headerComp.example?.header_handle?.[0] && (
                        <video
                          controls
                          className="rounded-md mb-2 max-h-32 w-full object-cover"
                        >
                          <source
                            src={headerComp.example.header_handle[0]}
                            type="video/mp4"
                          />
                        </video>
                      )}
                    {headerComp?.format === 'DOCUMENT' &&
                      headerComp.example?.header_handle?.[0] && (
                        <div className="text-sm text-gray-800 font-medium mb-2">
                          📄 Document Attached
                        </div>
                      )}

                    {/* ✅ Body */}
                    {bodyComp && (
                      <div className="text-gray-800 whitespace-pre-wrap break-words">
                        {bodyComp.text}
                      </div>
                    )}

                    {/* ✅ Footer */}
                    {footerComp && (
                      <div className="text-gray-600 text-xs mt-2 break-words">
                        {footerComp.text}
                      </div>
                    )}

                    {/* ✅ Buttons */}
                    {buttonsComp?.buttons && buttonsComp.buttons.length > 0 && (
                      <>
                        <hr className="border-t border-gray-300 mt-3 mb-2" />
                        <div className="flex flex-col items-center gap-2">
                          {buttonsComp.buttons.map((btn, idx) =>
                            btn.type === 'URL' ? (
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
                                {btn.text}
                              </a>
                            ) : (
                              <button
                                key={idx}
                                className="w-full border border-[#25D366] text-[#25D366] text-sm font-medium py-1 rounded"
                              >
                                {btn.text}
                              </button>
                            )
                          )}
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
      </div>
    </div>
  );
}
