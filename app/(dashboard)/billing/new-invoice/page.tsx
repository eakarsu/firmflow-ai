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
  CircularProgress,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiNarrative, setAiNarrative] = useState('');

  const [formData, setFormData] = useState({
    caseId: '',
    clientId: '',
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalAmount: '',
    status: 'DRAFT',
    aiNarrative: '',
  });

  useEffect(() => {
    // Fetch cases
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch(() => setError('Failed to load cases'));

    // Fetch clients
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch(() => setError('Failed to load clients'));
  }, []);

  const handleGenerateAINarrative = async () => {
    if (!formData.caseId) {
      setError('Please select a case first');
      return;
    }

    setAiGenerating(true);
    setError('');

    try {
      // Fetch time entries for this case
      const timeEntriesResponse = await fetch(`/api/time-entries?caseId=${formData.caseId}`);
      const timeEntries = await timeEntriesResponse.json();

      const selectedCase = cases.find((c) => c.id === formData.caseId);

      const response = await fetch('/api/ai/invoice-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: selectedCase?.title || '',
          timeEntries: timeEntries.map((te: any) => ({
            description: te.description,
            hours: te.hours,
            date: te.date,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate narrative');

      const data = await response.json();
      setFormData({ ...formData, aiNarrative: data.narrative });
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
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create invoice');

      router.push('/billing');
    } catch (err) {
      setError('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Invoice
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
            placeholder="INV-2025-001"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Case"
            value={formData.caseId}
            onChange={(e) => {
              const selectedCase = cases.find((c) => c.id === e.target.value);
              setFormData({
                ...formData,
                caseId: e.target.value,
                clientId: selectedCase?.clientId || '',
              });
            }}
            required
            sx={{ mb: 2 }}
          >
            {cases.map((caseItem) => (
              <MenuItem key={caseItem.id} value={caseItem.id}>
                {caseItem.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Client"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </MenuItem>
            ))}
          </TextField>

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
                disabled={!formData.caseId || aiGenerating}
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
              {loading ? 'Creating...' : 'Create Invoice'}
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
