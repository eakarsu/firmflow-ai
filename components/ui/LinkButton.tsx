'use client';

import { Button, ButtonProps } from '@mui/material';

interface LinkButtonProps extends Omit<ButtonProps, 'component' | 'href' | 'ref'> {
  href: string;
}

export default function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button href={href} {...props}>
      {children}
    </Button>
  );
}
