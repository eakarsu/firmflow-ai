'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Typography,
  Paper,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`case-tabpanel-${index}`}
      aria-labelledby={`case-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CaseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [caseData, setCaseData] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetch(`/api/cases/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load case');
        return res.json();
      })
      .then((data) => {
        setCaseData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load case details');
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

  if (error || !caseData) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Case not found'}
      </Alert>
    );
  }

  const totalHours = caseData.timeEntries?.reduce(
    (sum: number, entry: any) => sum + entry.hours,
    0
  ) || 0;

  const totalBilled = caseData.timeEntries?.reduce(
    (sum: number, entry: any) =>
      sum + (entry.billable ? entry.hours * (entry.billingRate || 0) : 0),
    0
  ) || 0;

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {caseData.title}
          </Typography>
          <Chip label={caseData.status} color="primary" sx={{ mr: 1 }} />
          <Chip label={caseData.practiceArea} variant="outlined" />
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Hours
              </Typography>
              <Typography variant="h4">{totalHours.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Billed
              </Typography>
              <Typography variant="h4">${totalBilled.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Tasks
              </Typography>
              <Typography variant="h4">{caseData.tasks?.length || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Documents
              </Typography>
              <Typography variant="h4">{caseData.documents?.length || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Tasks" />
          <Tab label="Time Entries" />
          <Tab label="Documents" />
          <Tab label="Court Filings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Case Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Client
                </Typography>
                <Typography variant="body1">
                  {caseData.client.firstName} {caseData.client.lastName}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Responsible Lawyer
                </Typography>
                <Typography variant="body1">{caseData.responsibleLawyer.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Practice Area
                </Typography>
                <Typography variant="body1">{caseData.practiceArea}</Typography>
              </Box>
              {caseData.courtName && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Court Name
                  </Typography>
                  <Typography variant="body1">{caseData.courtName}</Typography>
                </Box>
              )}
              {caseData.courtFileNumber && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Court File Number
                  </Typography>
                  <Typography variant="body1">{caseData.courtFileNumber}</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">{caseData.description}</Typography>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {caseData.tasks && caseData.tasks.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {caseData.tasks.map((task: any) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        <Chip label={task.status} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={task.priority} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">No tasks yet</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {caseData.timeEntries && caseData.timeEntries.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Billable</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {caseData.timeEntries.map((entry: any) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{entry.user.name}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.hours}</TableCell>
                      <TableCell>{entry.billable ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        {entry.billable && entry.billingRate
                          ? `$${(entry.hours * entry.billingRate).toFixed(2)}`
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">No time entries yet</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {caseData.documents && caseData.documents.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Recorded Summary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {caseData.documents.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>
                        <Chip label={doc.docType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{doc.aiSummary ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">No documents yet</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {caseData.courtFilings && caseData.courtFilings.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Filing Type</TableCell>
                    <TableCell>Filed At</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Court Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {caseData.courtFilings.map((filing: any) => (
                    <TableRow key={filing.id}>
                      <TableCell>{filing.filingType}</TableCell>
                      <TableCell>
                        {filing.filedAt ? new Date(filing.filedAt).toLocaleDateString() : 'Not filed yet'}
                      </TableCell>
                      <TableCell>
                        <Chip label={filing.status} size="small" />
                      </TableCell>
                      <TableCell>{filing.courtName || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">No court filings yet</Typography>
          )}
        </TabPanel>
      </Paper>
    </>
  );
}
