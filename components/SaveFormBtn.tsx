import React, { useTransition } from 'react'
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from './hooks/useDesigner';
import { UpdateFormContent } from '@/actions/form';
import { toast } from '@/hooks/use-toast';
import { FaSpinner } from 'react-icons/fa';

const SaveFormBtn = ({ id }: { id: number }) => {
  const { elements } = useDesigner();
  const [ loading, startTransition ] = useTransition();
  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElements);
      toast({
        title: "Success",
        description: "Form has been saved"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Form was not saved",
        variant: "destructive"
      });
    }
    
  }
  return <Button variant="outline" className='gap-2' disabled={loading} onClick={() => {
    startTransition(updateFormContent)
  }}><HiSaveAs className='h-6 w-6' />
    Save
    {loading && <FaSpinner className='animate-spin' /> }
  </Button>
}

export default SaveFormBtn