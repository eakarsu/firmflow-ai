'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography,
  Paper,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function TimeEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeEntry, setTimeEntry] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/time-entries/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load time entry');
        return res.json();
      })
      .then((data) => {
        setTimeEntry(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load time entry details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !timeEntry) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Time entry not found'}
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Time Entry Details
          </Typography>
          <Chip
            label={timeEntry.billable ? 'Billable' : 'Non-Billable'}
            color={timeEntry.billable ? 'success' : 'default'}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => router.push(`/billing/time-entries/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      {/* Time Entry Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Entry Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Case
            </Typography>
            <Typography variant="body1" gutterBottom>
              {timeEntry.case.title}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Client
            </Typography>
            <Typography variant="body1">
              {timeEntry.case.client.firstName} {timeEntry.case.client.lastName}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Attorney
            </Typography>
            <Typography variant="body1">
              {timeEntry.user.name}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1">
              {new Date(timeEntry.date).toLocaleDateString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Hours
            </Typography>
            <Typography variant="h5" color="primary">
              {timeEntry.hours}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Billing Rate
            </Typography>
            <Typography variant="h5" color="primary">
              ${timeEntry.billingRate}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="body2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="h4" color="primary">
              ${(timeEntry.hours * timeEntry.billingRate).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Description */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {timeEntry.description}
        </Typography>
      </Paper>
    </>
  );
}
