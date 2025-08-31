import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTemplateByIdThunk } from '@/store/slices/templateSlice';
import type { Component } from '@/types/template';

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
              {selectedTemplate.language}
            </p>
            <p>
              <span className="font-medium">Status: </span>
              {selectedTemplate.status}
            </p>
            {selectedTemplate.components?.map((component: Component, idx) => {
              switch (component.type) {
                case 'HEADER':
                  return (
                    <div key={idx} className="mb-2">
                      {component.format === 'TEXT' && (
                        <h2 className="font-bold text-lg">{component.text}</h2>
                      )}

                      {component.format === 'IMAGE' &&
                        component.example?.header_handle?.[0] && (
                          <img
                            src={component.example.header_handle[0]}
                            alt="Header"
                            className="rounded-lg w-full"
                          />
                        )}

                      {component.format === 'VIDEO' &&
                        component.example?.header_handle?.[0] && (
                          <video
                            controls
                            className="rounded-lg w-full"
                            src={component.example.header_handle[0]}
                          />
                        )}

                      {component.format === 'DOCUMENT' &&
                        component.example?.header_handle?.[0] && (
                          <a
                            href={component.example.header_handle[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Document
                          </a>
                        )}
                    </div>
                  );

                case 'BODY':
                  return (
                    <div key={idx} className="my-2">
                      <p className="text-gray-800">{component.text}</p>

                      {component.example?.body_text && (
                        <div className="mt-2 space-y-1">
                          <p className="font-medium text-sm text-gray-600">
                            Examples:
                          </p>
                          {component.example.body_text.map(
                            (exampleSet, eIdx) => (
                              <p key={eIdx} className="text-gray-700 text-sm">
                                {exampleSet.join(' | ')}
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );

                case 'FOOTER':
                  return (
                    <div key={idx} className="text-sm text-gray-500 mt-2">
                      {component.text}
                    </div>
                  );

                case 'BUTTONS':
                  return (
                    <div key={idx} className="flex gap-2 mt-3">
                      {component.buttons?.map((btn, bIdx) =>
                        btn.type === 'URL' ? (
                          <a
                            key={bIdx}
                            href={btn.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                          >
                            {btn.text}
                          </a>
                        ) : (
                          <button
                            key={bIdx}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800"
                          >
                            {btn.text}
                          </button>
                        )
                      )}
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
