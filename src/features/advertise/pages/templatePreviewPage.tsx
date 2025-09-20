import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTemplateByIdThunk } from '@/store/slices/templateSlice';
import type { Component } from '@/types/template';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
    <div className="flex flex-col h-full w-full  bg-[#FAFFF4] shadow-[0_0_5px_rgba(0,0,0,0.15)] rounded-b-xl">
      {/* Top Bar */}
      <div className="flex h-20 shrink-0 items-center bg-primary gap-2 border-t-5 border-l-5 border-r-5 border-[#fafff4ff] text-accent transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-20">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <Separator
            orientation="vertical"
            className=" data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{selectedTemplate.name}</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* Right side empty for now */}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Left Section - Template Details (unchanged) */}

        <div className="pb-6">
          <div className="mb-6 flex items-center justify-between">
            <div></div>
            <Link to="/dashboard/advertise/templates">
              <Button>Back to Templates</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Category */}
            <div className="rounded-sm bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col justify-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Category
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {selectedTemplate.category}
              </p>
            </div>

            {/* Language */}
            <div className="rounded-sm bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col justify-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Language
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {selectedTemplate.language}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-sm bg-white p-6 shadow-[0_0_5px_rgba(0,0,0,0.15)] flex flex-col justify-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Status
              </p>
              <p
                className={`text-lg font-semibold ${
                  selectedTemplate.status === 'APPROVED'
                    ? ' text-green-800'
                    : selectedTemplate.status === 'REJECTED'
                      ? ' text-red-700'
                      : ' text-yellow-800'
                }`}
              >
                {selectedTemplate.status}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Right Section - WhatsApp Preview */}
        <div
          className="bg-[##FAFFF4] shadow-[0_0_8px_rgba(0,0,0,0.15)] rounded-sm p-5"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
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
                      {buttonsComp?.buttons &&
                        buttonsComp.buttons.length > 0 && (
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
    </div>
  );
}
