import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    const [value, setValue] = React.useState('');
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textAreaRef.current!);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (props.onInput) {
            props.onInput(event);
        }
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };
    
    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={textAreaRef}
        onInput={handleInput}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
