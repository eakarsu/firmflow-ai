import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import prisma from '@/lib/prisma';
import BillingHeader from './BillingHeader';
import InvoiceActions from './InvoiceActions';
import TimeEntryActions from './TimeEntryActions';
import { accessibleMatterWhere } from '@/lib/governance/policy';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const matterWhere = accessibleMatterWhere(session.user.id, session.user.role);
  const timeEntries = await prisma.timeEntry.findMany({
    where: { case: matterWhere },
    include: {
      case: {
        include: {
          client: true,
        },
      },
      user: true,
    },
    orderBy: {
      date: 'desc',
    },
    take: 20,
  });

  const invoices = await prisma.invoice.findMany({
    where: { case: matterWhere },
    include: {
      case: true,
      client: true,
    },
    orderBy: {
      issueDate: 'desc',
    },
  });

  // Calculate total billable hours and revenue
  const totalBillable = timeEntries
    .filter((entry) => entry.billable)
    .reduce((sum, entry) => sum + entry.hours * entry.billingRate, 0);

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  const getInvoiceStatusColor = (status: string) => {
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

  return (
    <>
      <BillingHeader />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Hours
              </Typography>
              <Typography variant="h4">{totalHours.toFixed(1)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Billable Revenue
              </Typography>
              <Typography variant="h4">${totalBillable.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Invoices
              </Typography>
              <Typography variant="h4">{invoices.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Paid Invoices
              </Typography>
              <Typography variant="h4">
                {invoices.filter((inv) => inv.status === 'PAID').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Time Entries */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Recent Time Entries</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Case</strong></TableCell>
                <TableCell><strong>Attorney</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Hours</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Billable</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeEntries.map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link href={`/cases/${entry.case.id}`} style={{ textDecoration: 'none' }}>
                      {entry.case.title}
                    </Link>
                  </TableCell>
                  <TableCell>{entry.user.name}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.hours}</TableCell>
                  <TableCell>${entry.billingRate}</TableCell>
                  <TableCell>${(entry.hours * entry.billingRate).toFixed(2)}</TableCell>
                  <TableCell>
                    {entry.billable ? (
                      <Chip label="Yes" size="small" color="success" />
                    ) : (
                      <Chip label="No" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <TimeEntryActions timeEntryId={entry.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Invoices */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Invoices</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Invoice #</strong></TableCell>
                <TableCell><strong>Client</strong></TableCell>
                <TableCell><strong>Case</strong></TableCell>
                <TableCell><strong>Issue Date</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>
                    <strong>{invoice.invoiceNumber}</strong>
                  </TableCell>
                  <TableCell>
                    {invoice.client.firstName} {invoice.client.lastName}
                  </TableCell>
                  <TableCell>
                    <Link href={`/cases/${invoice.case.id}`} style={{ textDecoration: 'none' }}>
                      {invoice.case.title}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>${invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      size="small"
                      color={getInvoiceStatusColor(invoice.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <InvoiceActions invoiceId={invoice.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
