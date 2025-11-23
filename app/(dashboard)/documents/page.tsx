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
import { Add as AddIcon, Description as DocIcon } from '@mui/icons-material';
import LinkButton from '@/components/ui/LinkButton';
import prisma from '@/lib/prisma';

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch all documents with case info
  const documents = await prisma.document.findMany({
    include: {
      case: {
        include: {
          client: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const getDocTypeColor = (docType: string) => {
    switch (docType) {
      case 'PLEADING':
        return 'primary';
      case 'MOTION':
        return 'secondary';
      case 'CONTRACT':
        return 'success';
      case 'LETTER':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Documents
        </Typography>
        <LinkButton
          variant="contained"
          startIcon={<AddIcon />}
          href="/documents/new"
        >
          New Document
        </LinkButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Document Title</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Case</strong></TableCell>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>AI Summary</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DocIcon fontSize="small" />
                    <strong>{doc.title}</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={doc.docType.replace('_', ' ')}
                    size="small"
                    color={getDocTypeColor(doc.docType) as any}
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/cases/${doc.case.id}`} style={{ textDecoration: 'none' }}>
                    {doc.case.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {doc.case.client.firstName} {doc.case.client.lastName}
                </TableCell>
                <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {doc.aiSummary ? (
                    <Chip label="Yes" size="small" color="success" />
                  ) : (
                    <Chip label="No" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <LinkButton
                    href={`/documents/${doc.id}`}
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

      {documents.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            No documents found. Create your first document to get started.
          </Typography>
        </Box>
      )}
    </>
  );
}
