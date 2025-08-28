import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTemplateByIdThunk } from '@/store/slices/templateSlice';

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

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold">Template Preview</h1>
        <Link to="/dashboard/advertise/templates">
          <Button variant="outline">Back to Templates</Button>
        </Link>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left Section - Template Details */}
        <div className="w-2/3 p-6 overflow-y-auto space-y-4 border-r">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedTemplate.name}
          </h2>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Category: </span>
              {selectedTemplate.category}
            </p>
            <p>
              <span className="font-medium">Language: </span>
              {(selectedTemplate.components &&
                selectedTemplate.components[0]?.example?.body_text) ||
                'N/A'}
            </p>
            {/* {/* <p>
              <span className="font-medium">Header: </span>
              {selectedTemplate.components || '-'}
            </p>
            <p>
              <span className="font-medium">Body: </span>
              {selectedTemplate.components || '-'}
            </p>
            <p>
              <span className="font-medium">Footer: </span>
              {selectedTemplate.components || '-'}
            </p>
            {selectedTemplate.components > 0 && (
              <div>
                <span className="font-medium">CTA Buttons:</span>
                {/* <ul className="list-disc list-inside">
                  {selectedTemplate.ctaButtons.map((btn, idx) => (
                    <li key={idx}>
                      {btn.label} →{' '}
                      <a
                        href={btn.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {btn.url}
                      </a>
                    </li>
                  ))}
                </ul> */}
          </div>
        </div>
      </div>
      {/* Right Section - WhatsApp Preview */}
      {/* <div className="flex-1 border-l p-4 bg-white flex items-center justify-center">
        <div className="bg-[#ece5dd] w-[260px] h-[500px] rounded-2xl shadow-lg border overflow-hidden relative flex flex-col">
          {/* Top bar */}
      {/* <div className="bg-[#075e54] text-white px-4 py-2 text-sm font-medium">
            WhatsApp Preview
          </div> */}
      {/* Message preview */}
      {/* <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div
                className={`bg-white rounded-lg text-sm max-w-xs ml-2 shadow-md transition-all duration-300 m-6 flex flex-col ${
                  hasPreviewContent ? 'px-4 py-3' : 'px-2 py-1 text-gray-400'
                }`}
              >
                {hasPreviewContent ? (
                  <>
                    {template.header && (
                      <div className="font-semibold text-sm mb-1 break-words w-full">
                        {template.header}
                      </div>
                    )}
                    {template.body && (
                      <div className="text-gray-800 whitespace-pre-wrap break-words w-full">
                        {template.body}
                      </div>
                    )}
                    {template.footer && (
                      <div className="text-gray-600 text-xs mt-2 break-words w-full">
                        {template.footer}
                      </div>
                    )}
                    {template.ctaButtons.length > 0 && (
                      <>
                        <hr className="border-t border-gray-300 mt-3 mb-2" />
                        <div className="flex flex-col items-center gap-2">
                          {template.ctaButtons.map((btn, idx) => (
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
            </div> */}
      {/* </div>
      </div>
    </div> */}
      //{' '}
    </div>
  );
}
