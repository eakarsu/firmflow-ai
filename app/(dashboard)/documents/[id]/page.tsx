'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';

export default function DocumentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [document, setDocument] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/documents/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load document');
        return res.json();
      })
      .then((data) => {
        setDocument(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load document details');
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

  if (error || !document) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Document not found'}
      </Alert>
    );
  }

  const handleDownload = () => {
    const blob = new Blob([document.content || ''], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {document.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={document.docType} color="primary" />
            {document.aiSummary && <Chip label="AI Generated" variant="outlined" />}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!document.content}
          >
            Download
          </Button>
        </Box>
      </Box>

      {/* Document Metadata */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Document Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Related Case
          </Typography>
          <Typography variant="body1">
            {document.case?.title || 'N/A'}
          </Typography>
        </Box>

        {document.case?.client && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Client
            </Typography>
            <Typography variant="body1">
              {document.case.client.firstName} {document.case.client.lastName}
            </Typography>
          </Box>
        )}

        {document.case?.responsibleLawyer && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Responsible Lawyer
            </Typography>
            <Typography variant="body1">
              {document.case.responsibleLawyer.name}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Created
          </Typography>
          <Typography variant="body1">
            {new Date(document.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last Updated
          </Typography>
          <Typography variant="body1">
            {new Date(document.updatedAt).toLocaleString()}
          </Typography>
        </Box>

        {document.storagePath && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              File Path
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {document.storagePath}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Document Content */}
      {document.content && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Content
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              maxHeight: '600px',
              overflowY: 'auto',
            }}
          >
            {document.content}
          </Box>
        </Paper>
      )}

      {/* AI Summary */}
      {document.aiSummary && (
        <Paper sx={{ p: 3, mt: 3, bgcolor: '#e3f2fd' }}>
          <Typography variant="h6" gutterBottom>
            AI Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {document.aiSummary}
          </Typography>
        </Paper>
      )}
    </>
  );
}
