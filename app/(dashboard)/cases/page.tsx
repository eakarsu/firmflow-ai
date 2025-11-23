import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import LinkButton from '@/components/ui/LinkButton';
import prisma from '@/lib/prisma';

export default async function CasesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch all cases with client and lawyer info
  const cases = await prisma.case.findMany({
    include: {
      client: true,
      responsibleLawyer: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CLOSED':
        return 'default';
      case 'ON_HOLD':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Cases
        </Typography>
        <LinkButton
          variant="contained"
          startIcon={<AddIcon />}
          href="/cases/new"
        >
          New Case
        </LinkButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Case Title</strong></TableCell>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Lawyer</strong></TableCell>
              <TableCell><strong>Practice Area</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Opened</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id} hover>
                <TableCell>
                  <Link href={`/cases/${caseItem.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong>{caseItem.title}</strong>
                  </Link>
                </TableCell>
                <TableCell>
                  {caseItem.client.firstName} {caseItem.client.lastName}
                </TableCell>
                <TableCell>{caseItem.responsibleLawyer.name}</TableCell>
                <TableCell>{caseItem.practiceArea.replace('_', ' ')}</TableCell>
                <TableCell>
                  <Chip
                    label={caseItem.status}
                    color={getStatusColor(caseItem.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(caseItem.openedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <LinkButton
                    href={`/cases/${caseItem.id}`}
                    size="small"
                  >
                    View
                  </LinkButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {cases.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            No cases found. Create your first case to get started.
          </Typography>
        </Box>
      )}
    </>
  );
}
