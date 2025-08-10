import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createNewFlow } from '@/store/slices/flowsSlice';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CreateFlowDialog() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [flowJustCreated, setFlowJustCreated] = useState(false); // 🔁 Local flag

  const currentFlow = useAppSelector(state => state.flow.currentFlow);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Flow name cannot be empty');
      return;
    }
    dispatch(createNewFlow(name.trim()));
    setFlowJustCreated(true); // 🔁 Set flag after dispatch
    setName('');
  };

  useEffect(() => {
    if (
      flowJustCreated &&
      currentFlow?.id?.startsWith('temp-') &&
      !location.pathname.includes(currentFlow.id)
    ) {
      navigate(`/flows/${currentFlow.id}`);
      setFlowJustCreated(false); // Reset after navigating
    }
  }, [currentFlow, flowJustCreated, navigate, location]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-half bg-primary px-6 py-3  mt-6 ">
          Create Flows <span className="ml-2  font-bold">+</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Flow Name</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Input
            id="name"
            placeholder="Enter Flow Name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
