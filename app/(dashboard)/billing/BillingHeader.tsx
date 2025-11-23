'use client';

import Link from 'next/link';
import { Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function BillingHeader() {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h4" component="h1">
        Billing & Time Tracking
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/billing/new-time-entry"
        >
          New Time Entry
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/billing/new-invoice"
        >
          New Invoice
        </Button>
      </Box>
    </Box>
  );
}
