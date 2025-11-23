'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AIKPIInsightsProps {
  kpiData: {
    totalCases: number;
    totalClients: number;
    totalTasks: number;
    openCases: number;
  };
}

export default function AIKPIInsights({ kpiData }: AIKPIInsightsProps) {
  const [aiGenerating, setAiGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [error, setError] = useState('');

  const handleGenerateInsights = async () => {
    setAiGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai/kpi-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: kpiData }),
      });

      if (!response.ok) throw new Error('Failed to generate insights');

      const data = await response.json();
      setAiInsights(data.insights);
      setDialogOpen(true);
    } catch (err) {
      setError('Failed to generate AI insights. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={aiGenerating ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
        onClick={handleGenerateInsights}
        disabled={aiGenerating}
      >
        {aiGenerating ? 'Analyzing...' : 'AI KPI Insights'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>AI KPI Insights & Recommendations</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            These AI-generated insights analyze your firm's key metrics and provide actionable recommendations.
          </Alert>
          <Box sx={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {aiInsights}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
