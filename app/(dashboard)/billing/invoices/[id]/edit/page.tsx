'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    totalAmount: '',
    status: 'DRAFT',
    aiNarrative: '',
  });

  const [invoiceData, setInvoiceData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load invoice');
        return res.json();
      })
      .then((data) => {
        setInvoiceData(data);
        setFormData({
          invoiceNumber: data.invoiceNumber,
          issueDate: new Date(data.issueDate).toISOString().split('T')[0],
          dueDate: new Date(data.dueDate).toISOString().split('T')[0],
          totalAmount: data.totalAmount.toString(),
          status: data.status,
          aiNarrative: data.aiNarrative || '',
        });
        setFetchLoading(false);
      })
      .catch(() => {
        setError('Failed to load invoice');
        setFetchLoading(false);
      });
  }, [id]);

  const handleGenerateAINarrative = async () => {
    if (!invoiceData?.case) {
      setError('Case data not available');
      return;
    }

    setAiGenerating(true);
    setError('');

    try {
      const timeEntriesResponse = await fetch(`/api/time-entries?caseId=${invoiceData.case.id}`);
      const timeEntries = await timeEntriesResponse.json();

      const response = await fetch('/api/ai/invoice-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: invoiceData.case.title,
          timeEntries: timeEntries.map((te: any) => ({
            description: te.description,
            hours: te.hours,
            date: te.date,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate narrative');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, aiNarrative: data.narrative }));
    } catch (err) {
      setError('Failed to generate AI narrative. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update invoice');

      router.push(`/billing/invoices/${id}`);
    } catch (err) {
      setError('Failed to update invoice. Please try again.');
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
        Edit Invoice
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
            label="Invoice Number"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Issue Date"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Total Amount"
            type="number"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            required
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="SENT">Sent</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="OVERDUE">Overdue</MenuItem>
          </TextField>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Invoice Narrative (Optional)
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={aiGenerating ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                onClick={handleGenerateAINarrative}
                disabled={aiGenerating}
              >
                {aiGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </Box>
            <TextField
              fullWidth
              value={formData.aiNarrative}
              onChange={(e) => setFormData({ ...formData, aiNarrative: e.target.value })}
              multiline
              rows={4}
              placeholder="AI can generate a professional summary of work performed based on time entries..."
            />
          </Box>

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
