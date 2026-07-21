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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load invoice');
        return res.json();
      })
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load invoice details');
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

  if (error || !invoice) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Invoice not found'}
      </Alert>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'SENT':
        return 'info';
      case 'OVERDUE':
        return 'error';
      default:
        return 'default';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Invoice {invoice.invoiceNumber}
          </Typography>
          <Chip label={invoice.status} color={getStatusColor(invoice.status) as any} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/billing/invoices/${id}/edit`)}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Invoice Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Invoice Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Client
            </Typography>
            <Typography variant="body1" gutterBottom>
              {invoice.client.firstName} {invoice.client.lastName}
            </Typography>
            {invoice.client.email && (
              <Typography variant="body2" color="text.secondary">
                {invoice.client.email}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Case
            </Typography>
            <Typography variant="body1">
              {invoice.case.title}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Issue Date
            </Typography>
            <Typography variant="body1">
              {new Date(invoice.issueDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Due Date
            </Typography>
            <Typography variant="body1">
              {new Date(invoice.dueDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="h5" color="primary">
              ${invoice.totalAmount.toLocaleString()}
            </Typography>
          </Box>

          {invoice.case.responsibleLawyer && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Responsible Lawyer
              </Typography>
              <Typography variant="body1">
                {invoice.case.responsibleLawyer.name}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Time Entries */}
      {invoice.case?.timeEntries && invoice.case.timeEntries.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Time Entries (from Case)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Attorney</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Hours</strong></TableCell>
                  <TableCell><strong>Rate</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.case.timeEntries.map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell>{entry.user.name}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.hours}</TableCell>
                    <TableCell>${entry.billingRate}</TableCell>
                    <TableCell>${(entry.hours * entry.billingRate).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Reviewed invoice narrative */}
      {invoice.aiNarrative && (
        <Paper sx={{ p: 3, bgcolor: '#e3f2fd' }}>
          <Typography variant="h6" gutterBottom>
            Invoice Narrative
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {invoice.aiNarrative}
          </Typography>
        </Paper>
      )}
    </>
  );
}
