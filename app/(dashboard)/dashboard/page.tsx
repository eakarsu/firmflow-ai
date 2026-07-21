import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import prisma from '@/lib/prisma';
import { accessibleMatterWhere } from '@/lib/governance/policy';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const matterWhere = accessibleMatterWhere(session.user.id, session.user.role);
  const [totalCases, totalClients, totalTasks, openCases] = await Promise.all([
    prisma.case.count({ where: matterWhere }),
    prisma.client.count({ where: { cases: { some: matterWhere } } }),
    prisma.task.count({
      where: {
        case: matterWhere,
        status: { in: ['TODO', 'IN_PROGRESS'] },
      },
    }),
    prisma.case.count({
      where: { ...matterWhere, status: 'OPEN' },
    }),
  ]);

  // Fetch recent cases
  const recentCases = await prisma.case.findMany({
    where: matterWhere,
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      client: true,
      responsibleLawyer: true,
    },
  });

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {session.user.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Role: {session.user.role}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">Metrics are calculated from matters you are authorized to access.</Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Cases
              </Typography>
              <Typography variant="h3">{totalCases}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Open Cases
              </Typography>
              <Typography variant="h3">{openCases}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Clients
              </Typography>
              <Typography variant="h3">{totalClients}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Tasks
              </Typography>
              <Typography variant="h3">{totalTasks}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Cases */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Cases
        </Typography>
        <Box>
          {recentCases.map((caseItem) => (
            <Box
              key={caseItem.id}
              sx={{
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {caseItem.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Client: {caseItem.client.firstName} {caseItem.client.lastName} |
                Lawyer: {caseItem.responsibleLawyer.name} |
                Status: {caseItem.status}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </>
  );
}
