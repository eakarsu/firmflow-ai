'use client';

import Link from 'next/link';
import { Button, ButtonProps } from '@mui/material';

interface LinkButtonProps extends Omit<ButtonProps, 'component' | 'href'> {
  href: string;
}

export default function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button component={Link} href={href} {...props}>
      {children}
    </Button>
  );
}
