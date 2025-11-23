'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
} from '@mui/material';

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    responsibleLawyerId: '',
    status: 'OPEN',
    practiceArea: 'FAMILY',
    courtName: '',
    courtFileNumber: '',
  });

  useEffect(() => {
    // Fetch clients and lawyers
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch(() => setError('Failed to load clients'));

    fetch('/api/users?role=LAWYER')
      .then((res) => res.json())
      .then((data) => setLawyers(data))
      .catch(() => setError('Failed to load lawyers'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create case');

      const newCase = await response.json();
      router.push(`/cases/${newCase.id}`);
    } catch (err) {
      setError('Failed to create case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Case
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 800 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Case Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={4}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Client"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Responsible Lawyer"
            value={formData.responsibleLawyerId}
            onChange={(e) => setFormData({ ...formData, responsibleLawyerId: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            {lawyers.map((lawyer) => (
              <MenuItem key={lawyer.id} value={lawyer.id}>
                {lawyer.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Practice Area"
            value={formData.practiceArea}
            onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="FAMILY">Family Law</MenuItem>
            <MenuItem value="CRIMINAL">Criminal Defense</MenuItem>
            <MenuItem value="IMMIGRATION">Immigration</MenuItem>
            <MenuItem value="BUSINESS">Business Law</MenuItem>
            <MenuItem value="CIVIL">Civil Litigation</MenuItem>
            <MenuItem value="EMPLOYMENT">Employment Law</MenuItem>
            <MenuItem value="REAL_ESTATE">Real Estate</MenuItem>
            <MenuItem value="ESTATE_PLANNING">Estate Planning</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CLOSED">Closed</MenuItem>
            <MenuItem value="ON_HOLD">On Hold</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Court Name (Optional)"
            value={formData.courtName}
            onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Court File Number (Optional)"
            value={formData.courtFileNumber}
            onChange={(e) => setFormData({ ...formData, courtFileNumber: e.target.value })}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Creating...' : 'Create Case'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
}
