'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
  Button,
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
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientData, setClientData] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load client');
        return res.json();
      })
      .then((data) => {
        setClientData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load client details');
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

  if (error || !clientData) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Client not found'}
      </Alert>
    );
  }

  const openCases = clientData.cases?.filter((c: any) => c.status === 'OPEN').length || 0;
  const totalCases = clientData.cases?.length || 0;

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {clientData.firstName} {clientData.lastName}
        </Typography>
        {clientData.companyName && (
          <Typography variant="subtitle1" color="text.secondary">
            {clientData.companyName}
          </Typography>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Cases
              </Typography>
              <Typography variant="h4">{totalCases}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Open Cases
              </Typography>
              <Typography variant="h4">{openCases}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Intake Forms
              </Typography>
              <Typography variant="h4">{clientData.intakeForms?.length || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Client Since
              </Typography>
              <Typography variant="h6">
                {new Date(clientData.createdAt).toLocaleDateString()}
              </Typography>
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
          <Tab label="Cases" />
          <Tab label="Intake Forms" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{clientData.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{clientData.phone}</Typography>
              </Box>
              {clientData.address && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">{clientData.address}</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {clientData.notes && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1">{clientData.notes}</Typography>
                </>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {clientData.cases && clientData.cases.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Practice Area</TableCell>
                    <TableCell>Responsible Lawyer</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientData.cases.map((caseItem: any) => (
                    <TableRow key={caseItem.id}>
                      <TableCell>{caseItem.title}</TableCell>
                      <TableCell>
                        <Chip label={caseItem.status} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={caseItem.practiceArea} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{caseItem.responsibleLawyer.name}</TableCell>
                      <TableCell>
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => router.push(`/cases/${caseItem.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">No cases yet</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {clientData.intakeForms && clientData.intakeForms.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Matter Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>AI Summary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientData.intakeForms.map((form: any) => (
                    <TableRow key={form.id}>
                      <TableCell>{form.matterType}</TableCell>
                      <TableCell>
                        <Chip label={form.status} size="small" />
                      </TableCell>
                      <TableCell>
                        {new Date(form.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{form.aiSummary ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">No intake forms yet</Typography>
          )}
        </TabPanel>
      </Paper>
    </>
  );
}
