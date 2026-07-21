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
  Chip,
} from '@mui/material';
import { Gavel as CourtIcon, Task as TaskIcon } from '@mui/icons-material';
import prisma from '@/lib/prisma';
import { accessibleMatterWhere } from '@/lib/governance/policy';

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const matterWhere = accessibleMatterWhere(session.user.id, session.user.role);
  const upcomingTasks = await prisma.task.findMany({
    where: {
      case: matterWhere,
      dueDate: {
        gte: new Date(),
      },
      status: {
        not: 'DONE',
      },
    },
    include: {
      case: {
        include: {
          client: true,
        },
      },
      assignedTo: true,
    },
    orderBy: {
      dueDate: 'asc',
    },
    take: 10,
  });

  const upcomingFilings = await prisma.courtFiling.findMany({
    where: {
      case: matterWhere,
      dueDate: {
        gte: new Date(),
      },
      status: {
        not: 'FILED',
      },
    },
    include: {
      case: {
        include: {
          client: true,
        },
      },
    },
    orderBy: {
      dueDate: 'asc',
    },
    take: 10,
  });

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar & Deadlines
      </Typography>

      <Grid container spacing={3}>
        {/* Upcoming Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TaskIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Upcoming Tasks</Typography>
            </Box>
            {upcomingTasks.length === 0 ? (
              <Typography color="text.secondary">No upcoming tasks</Typography>
            ) : (
              <Box>
                {upcomingTasks.map((task) => (
                  <Card key={task.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.status.replace('_', ' ')}
                          size="small"
                          color={task.status === 'TODO' ? 'default' : 'primary'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <Link href={`/cases/${task.case.id}`} style={{ textDecoration: 'none' }}>
                          {task.case.title}
                        </Link>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        {' | '}
                        Assigned to: {task.assignedTo.name}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Court Filings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CourtIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Upcoming Court Filings</Typography>
            </Box>
            {upcomingFilings.length === 0 ? (
              <Typography color="text.secondary">No upcoming filings</Typography>
            ) : (
              <Box>
                {upcomingFilings.map((filing) => (
                  <Card key={filing.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {filing.filingType}
                        </Typography>
                        <Chip
                          label={filing.status.replace('_', ' ')}
                          size="small"
                          color={
                            filing.status === 'DRAFT'
                              ? 'default'
                              : filing.status === 'READY_TO_FILE'
                              ? 'warning'
                              : 'success'
                          }
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <Link href={`/cases/${filing.case.id}`} style={{ textDecoration: 'none' }}>
                          {filing.case.title}
                        </Link>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Court: {filing.courtName}
                        <br />
                        Due: {filing.dueDate ? new Date(filing.dueDate).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
