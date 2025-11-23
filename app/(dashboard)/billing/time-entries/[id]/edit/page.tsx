'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function EditTimeEntryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiPolishing, setAiPolishing] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    date: '',
    hours: '',
    billable: true,
    billingRate: '',
  });

  const [timeEntryData, setTimeEntryData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/time-entries/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load time entry');
        return res.json();
      })
      .then((data) => {
        setTimeEntryData(data);
        setFormData({
          description: data.description,
          date: new Date(data.date).toISOString().split('T')[0],
          hours: data.hours.toString(),
          billable: data.billable,
          billingRate: data.billingRate?.toString() || '',
        });
        setFetchLoading(false);
      })
      .catch(() => {
        setError('Failed to load time entry');
        setFetchLoading(false);
      });
  }, [id]);

  const handlePolishWithAI = async () => {
    if (!formData.description.trim()) {
      setError('Please enter a description first');
      return;
    }

    setAiPolishing(true);
    setError('');

    try {
      const caseContext = timeEntryData?.case?.title || '';

      const response = await fetch('/api/ai/time-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawNotes: formData.description,
          caseContext,
        }),
      });

      if (!response.ok) throw new Error('Failed to polish description');

      const data = await response.json();
      setFormData({ ...formData, description: data.description });
    } catch (err) {
      setError('Failed to polish description with AI. Please try again.');
    } finally {
      setAiPolishing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/time-entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update time entry');

      router.push('/billing');
    } catch (err) {
      setError('Failed to update time entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Time Entry
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 800 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {timeEntryData && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Case: <strong>{timeEntryData.case.title}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Client: <strong>{timeEntryData.case.client.firstName} {timeEntryData.case.client.lastName}</strong>
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Description *
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={aiPolishing ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                onClick={handlePolishWithAI}
                disabled={!formData.description.trim() || aiPolishing}
              >
                {aiPolishing ? 'Polishing...' : 'Polish with AI'}
              </Button>
            </Box>
            <TextField
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              required
              placeholder="Enter rough notes and use AI to polish..."
            />
          </Box>

          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Hours"
            type="number"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            required
            inputProps={{ min: 0.1, step: 0.25 }}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.billable}
                onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              />
            }
            label="Billable"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Billing Rate (Optional)"
            type="number"
            value={formData.billingRate}
            onChange={(e) => setFormData({ ...formData, billingRate: e.target.value })}
            inputProps={{ min: 0, step: 10 }}
            placeholder="Leave empty to use default rate"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
}
