import React from 'react'
import { Button } from './ui/button';
import { MdPreview } from 'react-icons/md';
import useDesigner from './hooks/useDesigner';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { FormElements } from './FormElements';

const PreviewDialogBtn = () => {
  const { elements } = useDesigner();
  return <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className='gap-2'><MdPreview className='h-6 w-6' />Preview</Button>
    </DialogTrigger>
    <DialogContent className='w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0'>
      <div className='px-2 py-2 border-b'>
        <DialogTitle className='text-lg font-bold text-muted-foreground'>
          Form Preview
        </DialogTitle>
        <p className='text-sm text-muted-foreground'>
          This is how your form will look lke for your users.
        </p>
      </div>
      <div className='bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/graph-paper.svg)] dark:bg-[url(/graph-paper-dark.svg)] overflow-y-auto'>
        <div className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto'>
          {
            elements.map(element => {
              const FormComponent = FormElements[element.type].formComponent;
              return <FormComponent key={element.id} elementInstance={element} />
            })
          }
        </div>
      </div>
    </DialogContent>
  </Dialog>
}

export default PreviewDialogBtn