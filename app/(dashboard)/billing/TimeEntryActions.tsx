'use client';

import Link from 'next/link';
import { Box, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

interface TimeEntryActionsProps {
  timeEntryId: string;
}

export default function TimeEntryActions({ timeEntryId }: TimeEntryActionsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton
        size="small"
        component={Link}
        href={`/billing/time-entries/${timeEntryId}`}
        title="View Time Entry"
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        component={Link}
        href={`/billing/time-entries/${timeEntryId}/edit`}
        title="Edit Time Entry"
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
