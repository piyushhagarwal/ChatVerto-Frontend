import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { CreateFlowDialog } from '../components/createFlowDialog';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllFlowsThunk,
  deleteFlowThunk,
  toggleFlowLiveStatusThunk,
} from '@/store/slices/flowsSlice';
import { Trash2 } from 'lucide-react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Enhanced Toggle Button Component
interface ToggleButtonProps {
  isLive: boolean;
  flowId: string;
  isLoading?: boolean;
  onToggle: (flowId: string, currentStatus: boolean) => void;
}

const FlowToggleButton = ({
  isLive,
  flowId,
  isLoading = false,
  onToggle,
}: ToggleButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (!isLoading) {
      onToggle(flowId, isLive);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
        ${isLive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 hover:bg-gray-400'}
      `}
      aria-label={`Toggle flow ${isLive ? 'off' : 'on'}`}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-3 w-3 animate-spin text-white" />
        </div>
      ) : (
        <>
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
              ${isLive ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
          <span className="sr-only">
            {isLive ? 'Disable flow' : 'Enable flow'}
          </span>
        </>
      )}
    </button>
  );
};

export default function AutomationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { flows, loading, error, toggleLoading } = useAppSelector(
    state => state.flow
  );

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent card click from triggering
    dispatch(deleteFlowThunk(id));
  };

  const handleToggleFlow = (flowId: string, currentStatus: boolean) => {
    dispatch(
      toggleFlowLiveStatusThunk({
        flowId,
        isLive: currentStatus,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchAllFlowsThunk());
  }, [dispatch]);

  return (
    <div className="w-full h-full">
      <SiteHeader title="Automations" />
      <div className="w-full flex justify-end px-4">
        <CreateFlowDialog />
      </div>

      <div className="flex flex-col gap-6 mt-2">
        {error && (
          <Alert
            variant="destructive"
            className="justify-items-start border-destructive mx-4"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Flow operation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div>
        {flows && flows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
            {flows.map(flow => (
              <Card
                key={flow.id}
                className="shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-sm bg-[#FAFFF4] hover:shadow-lg text-primary
                  transition-all duration-300 cursor-pointer relative
                  w-90 h-40 border-1 hover:scale-[1.02] hover:z-10"
                onClick={() => navigate(`/flows/${flow.id}`)}
              >
                <CardHeader>
                  <CardTitle className="border-b-2 pb-2 border-primary/40 block text-lg font-semibold text-black-500 tracking-wide">
                    {flow.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Status:
                    <span
                      className={`ml-1 font-medium ${flow.isLive ? 'text-green-600' : 'text-gray-500'}`}
                    >
                      {flow.isLive ? 'Live' : 'Inactive'}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex justify-between items-center pt-2">
                  <FlowToggleButton
                    isLive={flow.isLive}
                    flowId={flow.id}
                    isLoading={toggleLoading[flow.id] || false}
                    onToggle={handleToggleFlow}
                  />

                  <button
                    className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded"
                    onClick={e => handleDelete(e, flow.id)}
                    aria-label="Delete flow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No flows found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Create your first automation flow to get started.
            </p>
          </div>
        )}
      </div>

      <div>
        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700 px-4 py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading flows...
          </div>
        )}
      </div>
    </div>
  );
}
