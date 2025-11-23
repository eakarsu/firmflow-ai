'use client';

import Link from 'next/link';
import { Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

interface InvoiceActionsProps {
  invoiceId: string;
}

export default function InvoiceActions({ invoiceId }: InvoiceActionsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton
        size="small"
        component={Link}
        href={`/billing/invoices/${invoiceId}`}
        title="View Invoice"
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        component={Link}
        href={`/billing/invoices/${invoiceId}/edit`}
        title="Edit Invoice"
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
