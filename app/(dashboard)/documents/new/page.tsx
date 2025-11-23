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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function NewDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cases, setCases] = useState<any[]>([]);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiInstructions, setAiInstructions] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    docType: 'PLEADING',
    caseId: '',
    content: '',
    filePath: '',
  });

  useEffect(() => {
    // Fetch cases
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch(() => setError('Failed to load cases'));
  }, []);

  const handleGenerateWithAI = async () => {
    if (!aiInstructions.trim()) {
      setError('Please provide instructions for AI generation');
      return;
    }

    setAiGenerating(true);
    setError('');

    try {
      const selectedCase = cases.find((c) => c.id === formData.caseId);
      const caseContext = selectedCase
        ? `Case: ${selectedCase.title}\nDescription: ${selectedCase.description}`
        : '';

      const response = await fetch('/api/ai/draft-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: formData.docType,
          caseContext,
          instructions: aiInstructions,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate document');

      const data = await response.json();
      setFormData({ ...formData, content: data.draft });
      setAiDialogOpen(false);
      setAiInstructions('');
    } catch (err) {
      setError('Failed to generate document with AI. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create document');

      const newDocument = await response.json();
      router.push(`/documents/${newDocument.id}`);
    } catch (err) {
      setError('Failed to create document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Document
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
            label="Document Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Document Type"
            value={formData.docType}
            onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="PLEADING">Pleading</MenuItem>
            <MenuItem value="MOTION">Motion</MenuItem>
            <MenuItem value="BRIEF">Brief</MenuItem>
            <MenuItem value="CONTRACT">Contract</MenuItem>
            <MenuItem value="CORRESPONDENCE">Correspondence</MenuItem>
            <MenuItem value="DISCOVERY">Discovery</MenuItem>
            <MenuItem value="EVIDENCE">Evidence</MenuItem>
            <MenuItem value="FILING">Filing</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Related Case"
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Content
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AutoAwesomeIcon />}
                onClick={() => setAiDialogOpen(true)}
                disabled={!formData.caseId || !formData.docType}
              >
                Generate with AI
              </Button>
            </Box>
            <TextField
              fullWidth
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              multiline
              rows={10}
              placeholder="Enter document content here or generate with AI..."
            />
          </Box>

          <TextField
            fullWidth
            label="File Path (Optional)"
            value={formData.filePath}
            onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
            placeholder="/uploads/documents/..."
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Creating...' : 'Create Document'}
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

      {/* AI Generation Dialog */}
      <Dialog open={aiDialogOpen} onClose={() => setAiDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Document with AI</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provide instructions for the AI to generate a draft {formData.docType.toLowerCase()} document.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={aiInstructions}
            onChange={(e) => setAiInstructions(e.target.value)}
            placeholder="Example: Draft a motion for summary judgment arguing that there are no material facts in dispute and we are entitled to judgment as a matter of law..."
            disabled={aiGenerating}
          />
          {aiGenerating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Generating document with AI...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiDialogOpen(false)} disabled={aiGenerating}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerateWithAI}
            variant="contained"
            disabled={aiGenerating || !aiInstructions.trim()}
            startIcon={aiGenerating ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
