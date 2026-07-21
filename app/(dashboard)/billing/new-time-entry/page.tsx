'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

export default function NewTimeEntryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cases, setCases] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    caseId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    billable: true,
    billingRate: '',
  });

  useEffect(() => {
    // Fetch cases
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch(() => setError('Failed to load cases'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create time entry');

      router.push('/billing');
    } catch {
      setError('Failed to create time entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Time Entry
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 800 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            select
            label="Case"
            value={formData.caseId}
            onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            {cases.map((caseItem) => (
              <MenuItem key={caseItem.id} value={caseItem.id}>
                {caseItem.title}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Description *
              </Typography>
            </Box>
            <TextField
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              required
              placeholder="Describe the work performed using client-safe billing language"
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
              {loading ? 'Creating...' : 'Create Time Entry'}
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
