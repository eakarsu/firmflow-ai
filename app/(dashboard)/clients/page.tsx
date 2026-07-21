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
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import LinkButton from '@/components/ui/LinkButton';
import prisma from '@/lib/prisma';
import { accessibleClientWhere, accessibleMatterWhere } from '@/lib/governance/policy';

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const matterWhere = accessibleMatterWhere(session.user.id, session.user.role);
  const clients = await prisma.client.findMany({
    where: accessibleClientWhere(session.user.id, session.user.role),
    include: {
      _count: {
        select: { cases: { where: matterWhere } },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
        <LinkButton
          variant="contained"
          startIcon={<AddIcon />}
          href="/clients/new"
        >
          New Client
        </LinkButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Cases</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} hover>
                <TableCell>
                  <Link href={`/clients/${client.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong>{client.firstName} {client.lastName}</strong>
                  </Link>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.companyName || '-'}</TableCell>
                <TableCell>{client._count.cases}</TableCell>
                <TableCell>
                  <LinkButton
                    href={`/clients/${client.id}`}
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

      {clients.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            No clients found. Add your first client to get started.
          </Typography>
        </Box>
      )}
    </>
  );
}
