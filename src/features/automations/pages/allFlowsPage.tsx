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
import { fetchAllFlowsThunk, deleteFlowThunk } from '@/store/slices/flowsSlice';
import { Trash2 } from 'lucide-react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function AutomationPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { flows, loading, error } = useAppSelector(state => state.flow);

  const handleDelete = (id: string) => {
    dispatch(deleteFlowThunk(id));
  };

  useEffect(() => {
    return () => {
      dispatch(fetchAllFlowsThunk());
    };
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
            className="justify-items-start border-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Flow loading failed</AlertTitle>
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
                className="shadow-md hover:shadow-lg bg-[rgb(250, 255, 244)] text-primary transition-shadow duration-300 cursor-pointer relative"
                onClick={() => navigate(`/flows/${flow.id}`)}
              >
                <CardHeader>
                  <CardTitle>{flow.name}</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>

                <CardFooter className="flex justify-end">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={e => {
                      e.stopPropagation(); // 🛑 Prevents card click from triggering
                      handleDelete(flow.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No flows found.</p>
        )}
      </div>

      <div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-700 px-4 py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Please wait for the flows...
          </div>
        )}
      </div>
    </div>
  );
}
