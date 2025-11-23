'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import GavelIcon from '@mui/icons-material/Gavel';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    required: boolean;
    options?: string[];
    placeholder?: string;
  }>;
}

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  // Correspondence
  {
    id: 'demand-letter',
    name: 'Demand Letter',
    description: 'Formal demand for payment, action, or resolution',
    icon: <EmailIcon />,
    category: 'Correspondence',
    fields: [
      { name: 'recipient', label: 'Recipient Name', type: 'text', required: true, placeholder: 'John Doe' },
      { name: 'amount', label: 'Amount/Demand', type: 'text', required: true, placeholder: '$10,000 or specific action' },
      { name: 'basis', label: 'Legal Basis', type: 'textarea', required: true, placeholder: 'Breach of contract, unpaid services, etc.' },
      { name: 'deadline', label: 'Response Deadline', type: 'text', required: false, placeholder: '10 days' },
    ],
  },
  {
    id: 'cease-desist',
    name: 'Cease and Desist Letter',
    description: 'Demand to stop infringing or harmful activity',
    icon: <EmailIcon />,
    category: 'Correspondence',
    fields: [
      { name: 'recipient', label: 'Recipient Name/Entity', type: 'text', required: true, placeholder: 'ABC Corporation' },
      { name: 'infringement', label: 'Infringing Activity', type: 'textarea', required: true, placeholder: 'Trademark infringement, harassment, breach of agreement, etc.' },
      { name: 'legalBasis', label: 'Legal Basis', type: 'textarea', required: true, placeholder: 'Trademark law, copyright, contract terms, etc.' },
      { name: 'demands', label: 'Specific Demands', type: 'textarea', required: true, placeholder: 'Stop using trademark, remove content, etc.' },
    ],
  },
  {
    id: 'opinion-letter',
    name: 'Legal Opinion Letter',
    description: 'Formal legal opinion on a matter',
    icon: <EmailIcon />,
    category: 'Correspondence',
    fields: [
      { name: 'recipient', label: 'Recipient', type: 'text', required: true, placeholder: 'Client or Third Party' },
      { name: 'subject', label: 'Subject Matter', type: 'textarea', required: true, placeholder: 'Legal issue or question addressed' },
      { name: 'analysis', label: 'Key Analysis Points', type: 'textarea', required: true, placeholder: 'Main legal analysis and reasoning' },
      { name: 'conclusion', label: 'Opinion/Conclusion', type: 'textarea', required: true, placeholder: 'Final legal conclusion' },
    ],
  },

  // Motions
  {
    id: 'motion-summary-judgment',
    name: 'Motion for Summary Judgment',
    description: 'Motion arguing no material facts in dispute',
    icon: <GavelIcon />,
    category: 'Motions',
    fields: [
      { name: 'courtName', label: 'Court Name', type: 'text', required: true, placeholder: 'Superior Court of California' },
      { name: 'caseNumber', label: 'Case Number', type: 'text', required: true, placeholder: 'CV-2024-001234' },
      { name: 'facts', label: 'Undisputed Facts', type: 'textarea', required: true, placeholder: 'List the key undisputed facts' },
      { name: 'legalStandard', label: 'Legal Standard/Grounds', type: 'textarea', required: true, placeholder: 'Breach of contract, statute of limitations, etc.' },
    ],
  },
  {
    id: 'motion-dismiss',
    name: 'Motion to Dismiss',
    description: 'Motion to dismiss case for legal defects',
    icon: <GavelIcon />,
    category: 'Motions',
    fields: [
      { name: 'courtName', label: 'Court Name', type: 'text', required: true, placeholder: 'Circuit Court' },
      { name: 'caseNumber', label: 'Case Number', type: 'text', required: true, placeholder: 'CV-2024-001234' },
      { name: 'groundsForDismissal', label: 'Grounds for Dismissal', type: 'select', required: true, options: ['Lack of Jurisdiction', 'Failure to State a Claim', 'Improper Venue', 'Statute of Limitations', 'Other'] },
      { name: 'legalArguments', label: 'Legal Arguments', type: 'textarea', required: true, placeholder: 'Supporting legal arguments' },
    ],
  },
  {
    id: 'motion-compel',
    name: 'Motion to Compel Discovery',
    description: 'Motion to compel responses to discovery',
    icon: <GavelIcon />,
    category: 'Motions',
    fields: [
      { name: 'courtName', label: 'Court Name', type: 'text', required: true, placeholder: 'District Court' },
      { name: 'discoveryRequests', label: 'Discovery Requests', type: 'textarea', required: true, placeholder: 'Describe the discovery requests not answered' },
      { name: 'meetAndConfer', label: 'Meet and Confer Efforts', type: 'textarea', required: true, placeholder: 'Describe good faith efforts to resolve' },
    ],
  },

  // Pleadings
  {
    id: 'complaint',
    name: 'Civil Complaint',
    description: 'Initial pleading to commence lawsuit',
    icon: <DescriptionIcon />,
    category: 'Pleadings',
    fields: [
      { name: 'courtName', label: 'Court Name', type: 'text', required: true, placeholder: 'United States District Court' },
      { name: 'plaintiff', label: 'Plaintiff(s)', type: 'text', required: true, placeholder: 'John Doe' },
      { name: 'defendant', label: 'Defendant(s)', type: 'text', required: true, placeholder: 'XYZ Corp' },
      { name: 'claimsForRelief', label: 'Claims for Relief', type: 'textarea', required: true, placeholder: 'Breach of contract, fraud, negligence, etc.' },
      { name: 'factsAndCircumstances', label: 'Key Facts', type: 'textarea', required: true, placeholder: 'Chronological summary of events' },
    ],
  },
  {
    id: 'answer',
    name: 'Answer to Complaint',
    description: 'Defendant\'s response to complaint',
    icon: <DescriptionIcon />,
    category: 'Pleadings',
    fields: [
      { name: 'courtName', label: 'Court Name', type: 'text', required: true, placeholder: 'Superior Court' },
      { name: 'caseNumber', label: 'Case Number', type: 'text', required: true, placeholder: 'CV-2024-001234' },
      { name: 'admissions', label: 'Admitted Allegations', type: 'textarea', required: false, placeholder: 'Which allegations are admitted' },
      { name: 'denials', label: 'Denied Allegations', type: 'textarea', required: true, placeholder: 'Which allegations are denied and why' },
      { name: 'affirmativeDefenses', label: 'Affirmative Defenses', type: 'textarea', required: false, placeholder: 'Statute of limitations, waiver, etc.' },
    ],
  },

  // Contracts
  {
    id: 'engagement-letter',
    name: 'Engagement Letter',
    description: 'Attorney-client engagement agreement',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'clientName', label: 'Client Name', type: 'text', required: true, placeholder: 'Jane Smith' },
      { name: 'matterDescription', label: 'Matter Description', type: 'textarea', required: true, placeholder: 'Divorce proceeding, contract negotiation, etc.' },
      { name: 'feeStructure', label: 'Fee Structure', type: 'select', required: true, options: ['Hourly Rate', 'Flat Fee', 'Contingency', 'Hybrid'] },
      { name: 'rate', label: 'Rate/Amount', type: 'text', required: true, placeholder: '$300/hour or $5,000 flat' },
    ],
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Confidentiality agreement between parties',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'parties', label: 'Parties', type: 'text', required: true, placeholder: 'Company A and Company B' },
      { name: 'ndaType', label: 'NDA Type', type: 'select', required: true, options: ['Mutual', 'One-Way'] },
      { name: 'purpose', label: 'Purpose', type: 'textarea', required: true, placeholder: 'Business transaction, employment, etc.' },
      { name: 'duration', label: 'Duration', type: 'text', required: true, placeholder: '2 years, 5 years, perpetual' },
    ],
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    description: 'Agreement for provision of services',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'serviceProvider', label: 'Service Provider', type: 'text', required: true, placeholder: 'ABC Consulting' },
      { name: 'client', label: 'Client', type: 'text', required: true, placeholder: 'XYZ Corporation' },
      { name: 'services', label: 'Services Description', type: 'textarea', required: true, placeholder: 'Describe services to be provided' },
      { name: 'compensation', label: 'Compensation', type: 'text', required: true, placeholder: '$5,000/month, hourly rate, etc.' },
      { name: 'term', label: 'Term', type: 'text', required: true, placeholder: '12 months, ongoing, etc.' },
    ],
  },
  {
    id: 'employment-agreement',
    name: 'Employment Agreement',
    description: 'Agreement between employer and employee',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'employer', label: 'Employer', type: 'text', required: true, placeholder: 'ABC Corporation' },
      { name: 'employee', label: 'Employee', type: 'text', required: true, placeholder: 'John Doe' },
      { name: 'position', label: 'Position/Title', type: 'text', required: true, placeholder: 'Software Engineer' },
      { name: 'compensation', label: 'Compensation', type: 'text', required: true, placeholder: '$120,000/year plus benefits' },
      { name: 'startDate', label: 'Start Date', type: 'text', required: true, placeholder: 'January 1, 2025' },
    ],
  },
  {
    id: 'settlement-agreement',
    name: 'Settlement Agreement',
    description: 'Agreement resolving legal dispute',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'parties', label: 'Parties to Settlement', type: 'text', required: true, placeholder: 'Party A and Party B' },
      { name: 'disputeDescription', label: 'Dispute Description', type: 'textarea', required: true, placeholder: 'Brief description of the dispute' },
      { name: 'settlementTerms', label: 'Settlement Terms', type: 'textarea', required: true, placeholder: 'Payment amount, actions, timelines, etc.' },
      { name: 'releaseScope', label: 'Release Scope', type: 'select', required: true, options: ['Full Release', 'Limited Release', 'Mutual Release'] },
    ],
  },
  {
    id: 'lease-agreement',
    name: 'Lease Agreement',
    description: 'Residential or commercial lease',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'landlord', label: 'Landlord', type: 'text', required: true, placeholder: 'Property Owner LLC' },
      { name: 'tenant', label: 'Tenant', type: 'text', required: true, placeholder: 'Jane Doe' },
      { name: 'property', label: 'Property Address', type: 'textarea', required: true, placeholder: '123 Main St, City, State' },
      { name: 'rent', label: 'Monthly Rent', type: 'text', required: true, placeholder: '$2,000/month' },
      { name: 'term', label: 'Lease Term', type: 'text', required: true, placeholder: '12 months' },
    ],
  },

  // Discovery
  {
    id: 'discovery-request',
    name: 'Discovery Request',
    description: 'Interrogatories, requests for production, or admissions',
    icon: <AssignmentIcon />,
    category: 'Discovery',
    fields: [
      { name: 'discoveryType', label: 'Discovery Type', type: 'select', required: true, options: ['Interrogatories', 'Requests for Production', 'Requests for Admission'] },
      { name: 'topicsToDiscover', label: 'Topics/Information Sought', type: 'textarea', required: true, placeholder: 'Financial records, communications, etc.' },
      { name: 'numberOfRequests', label: 'Number of Requests', type: 'text', required: false, placeholder: '10-25 typical' },
    ],
  },
  {
    id: 'subpoena',
    name: 'Subpoena',
    description: 'Legal order to produce documents or testify',
    icon: <GavelIcon />,
    category: 'Discovery',
    fields: [
      { name: 'subpoenaType', label: 'Subpoena Type', type: 'select', required: true, options: ['Subpoena Duces Tecum', 'Subpoena Ad Testificandum', 'Deposition Subpoena'] },
      { name: 'recipient', label: 'Recipient', type: 'text', required: true, placeholder: 'Person or entity being subpoenaed' },
      { name: 'documentsOrTestimony', label: 'Documents/Testimony Sought', type: 'textarea', required: true, placeholder: 'Describe what is being requested' },
      { name: 'dateTime', label: 'Date/Time', type: 'text', required: true, placeholder: 'When to appear or produce' },
    ],
  },

  // Contract Clauses
  {
    id: 'contract-clause',
    name: 'Contract Clause',
    description: 'Specific contract provisions and clauses',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'clauseType', label: 'Clause Type', type: 'select', required: true, options: ['Confidentiality/NDA', 'Indemnification', 'Limitation of Liability', 'Termination', 'Dispute Resolution', 'Force Majeure', 'Assignment', 'Governing Law', 'Non-Compete', 'Intellectual Property'] },
      { name: 'parties', label: 'Parties', type: 'text', required: true, placeholder: 'Company A and Company B' },
      { name: 'specificProvisions', label: 'Specific Requirements', type: 'textarea', required: false, placeholder: 'Any specific terms to include' },
    ],
  },

  // Family Law
  {
    id: 'prenuptial-agreement',
    name: 'Prenuptial Agreement',
    description: 'Pre-marriage financial agreement',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'party1', label: 'First Party', type: 'text', required: true, placeholder: 'Future Spouse 1' },
      { name: 'party2', label: 'Second Party', type: 'text', required: true, placeholder: 'Future Spouse 2' },
      { name: 'assets', label: 'Asset Division Terms', type: 'textarea', required: true, placeholder: 'How assets will be divided' },
      { name: 'spousalSupport', label: 'Spousal Support Provisions', type: 'textarea', required: false, placeholder: 'Any alimony terms' },
    ],
  },
  {
    id: 'custody-agreement',
    name: 'Child Custody Agreement',
    description: 'Parenting plan and custody arrangement',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'parent1', label: 'Parent 1', type: 'text', required: true, placeholder: 'Parent name' },
      { name: 'parent2', label: 'Parent 2', type: 'text', required: true, placeholder: 'Parent name' },
      { name: 'children', label: 'Children', type: 'text', required: true, placeholder: 'Names and ages' },
      { name: 'custodySchedule', label: 'Custody Schedule', type: 'textarea', required: true, placeholder: 'Visitation and custody arrangement' },
    ],
  },

  // Real Estate
  {
    id: 'purchase-agreement',
    name: 'Real Estate Purchase Agreement',
    description: 'Agreement to purchase real property',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'buyer', label: 'Buyer', type: 'text', required: true, placeholder: 'Buyer name' },
      { name: 'seller', label: 'Seller', type: 'text', required: true, placeholder: 'Seller name' },
      { name: 'property', label: 'Property Description', type: 'textarea', required: true, placeholder: 'Address and description' },
      { name: 'purchasePrice', label: 'Purchase Price', type: 'text', required: true, placeholder: '$500,000' },
      { name: 'contingencies', label: 'Contingencies', type: 'textarea', required: false, placeholder: 'Financing, inspection, etc.' },
    ],
  },
  {
    id: 'deed',
    name: 'Deed (Warranty/Quitclaim)',
    description: 'Property transfer document',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'deedType', label: 'Deed Type', type: 'select', required: true, options: ['Warranty Deed', 'Quitclaim Deed', 'Special Warranty Deed'] },
      { name: 'grantor', label: 'Grantor (Seller)', type: 'text', required: true, placeholder: 'Current owner' },
      { name: 'grantee', label: 'Grantee (Buyer)', type: 'text', required: true, placeholder: 'New owner' },
      { name: 'property', label: 'Property Description', type: 'textarea', required: true, placeholder: 'Legal description of property' },
      { name: 'consideration', label: 'Consideration', type: 'text', required: true, placeholder: '$500,000' },
    ],
  },

  // Immigration
  {
    id: 'immigration-petition',
    name: 'Immigration Petition Letter',
    description: 'Support letter for visa/green card application',
    icon: <EmailIcon />,
    category: 'Correspondence',
    fields: [
      { name: 'petitionType', label: 'Petition Type', type: 'select', required: true, options: ['H-1B Visa', 'Green Card (EB-1/EB-2/EB-3)', 'L-1 Visa', 'O-1 Visa', 'Family-Based', 'Asylum'] },
      { name: 'beneficiary', label: 'Beneficiary Name', type: 'text', required: true, placeholder: 'Person seeking immigration benefit' },
      { name: 'qualifications', label: 'Qualifications/Basis', type: 'textarea', required: true, placeholder: 'Education, work experience, extraordinary ability, etc.' },
      { name: 'employer', label: 'Employer/Sponsor', type: 'text', required: false, placeholder: 'If applicable' },
    ],
  },
  {
    id: 'hardship-letter',
    name: 'Hardship Waiver Letter',
    description: 'Immigration hardship waiver explanation',
    icon: <EmailIcon />,
    category: 'Correspondence',
    fields: [
      { name: 'applicant', label: 'Applicant', type: 'text', required: true, placeholder: 'Person seeking waiver' },
      { name: 'qualifying relative', label: 'Qualifying Relative', type: 'text', required: true, placeholder: 'USC/LPR family member' },
      { name: 'hardships', label: 'Hardship Factors', type: 'textarea', required: true, placeholder: 'Medical, financial, educational, emotional hardships' },
      { name: 'country', label: 'Country of Origin', type: 'text', required: true, placeholder: 'Where applicant is from' },
    ],
  },

  // Criminal Defense
  {
    id: 'plea-agreement',
    name: 'Plea Agreement',
    description: 'Agreement for guilty/no contest plea',
    icon: <GavelIcon />,
    category: 'Contracts',
    fields: [
      { name: 'defendant', label: 'Defendant', type: 'text', required: true, placeholder: 'Defendant name' },
      { name: 'charges', label: 'Original Charges', type: 'textarea', required: true, placeholder: 'Charges being filed' },
      { name: 'pleaTo', label: 'Plea To', type: 'textarea', required: true, placeholder: 'Reduced charges or counts' },
      { name: 'sentenceRecommendation', label: 'Sentence Recommendation', type: 'textarea', required: true, placeholder: 'Agreed upon sentence' },
    ],
  },
  {
    id: 'expungement-petition',
    name: 'Expungement Petition',
    description: 'Petition to seal or expunge criminal record',
    icon: <DescriptionIcon />,
    category: 'Pleadings',
    fields: [
      { name: 'petitioner', label: 'Petitioner', type: 'text', required: true, placeholder: 'Person seeking expungement' },
      { name: 'conviction', label: 'Conviction Details', type: 'textarea', required: true, placeholder: 'Case number, charges, date of conviction' },
      { name: 'rehabilitation', label: 'Rehabilitation Evidence', type: 'textarea', required: true, placeholder: 'Employment, education, community service, etc.' },
      { name: 'justification', label: 'Justification', type: 'textarea', required: true, placeholder: 'Why expungement is warranted' },
    ],
  },
  {
    id: 'bail-motion',
    name: 'Motion for Bail Reduction',
    description: 'Motion to reduce bail amount',
    icon: <GavelIcon />,
    category: 'Motions',
    fields: [
      { name: 'defendant', label: 'Defendant', type: 'text', required: true, placeholder: 'Defendant name' },
      { name: 'currentBail', label: 'Current Bail Amount', type: 'text', required: true, placeholder: '$100,000' },
      { name: 'proposedBail', label: 'Proposed Bail Amount', type: 'text', required: true, placeholder: '$25,000' },
      { name: 'ties', label: 'Community Ties', type: 'textarea', required: true, placeholder: 'Family, employment, residence, etc.' },
      { name: 'flightRisk', label: 'Flight Risk Arguments', type: 'textarea', required: true, placeholder: 'Why defendant is not a flight risk' },
    ],
  },

  // Business/Corporate
  {
    id: 'operating-agreement',
    name: 'LLC Operating Agreement',
    description: 'Agreement governing LLC operations',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'llcName', label: 'LLC Name', type: 'text', required: true, placeholder: 'ABC Holdings LLC' },
      { name: 'members', label: 'Members', type: 'textarea', required: true, placeholder: 'List all members and ownership %' },
      { name: 'management', label: 'Management Structure', type: 'select', required: true, options: ['Member-Managed', 'Manager-Managed'] },
      { name: 'capitalContributions', label: 'Capital Contributions', type: 'textarea', required: true, placeholder: 'Initial contributions by each member' },
    ],
  },
  {
    id: 'bylaws',
    name: 'Corporate Bylaws',
    description: 'Internal rules for corporation',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'corporationName', label: 'Corporation Name', type: 'text', required: true, placeholder: 'ABC Corporation' },
      { name: 'state', label: 'State of Incorporation', type: 'text', required: true, placeholder: 'Delaware' },
      { name: 'directors', label: 'Board of Directors Info', type: 'textarea', required: true, placeholder: 'Number, terms, election process' },
      { name: 'officers', label: 'Officers', type: 'textarea', required: true, placeholder: 'CEO, CFO, Secretary roles' },
    ],
  },
  {
    id: 'shareholders-agreement',
    name: 'Shareholders Agreement',
    description: 'Agreement among company shareholders',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'company', label: 'Company Name', type: 'text', required: true, placeholder: 'ABC Inc.' },
      { name: 'shareholders', label: 'Shareholders', type: 'textarea', required: true, placeholder: 'Names and share amounts' },
      { name: 'transferRestrictions', label: 'Share Transfer Restrictions', type: 'textarea', required: true, placeholder: 'Right of first refusal, etc.' },
      { name: 'voting', label: 'Voting Rights', type: 'textarea', required: false, placeholder: 'Special voting provisions' },
    ],
  },
  {
    id: 'stock-purchase-agreement',
    name: 'Stock Purchase Agreement',
    description: 'Agreement to buy/sell company stock',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'buyer', label: 'Buyer', type: 'text', required: true, placeholder: 'Purchasing party' },
      { name: 'seller', label: 'Seller', type: 'text', required: true, placeholder: 'Selling party' },
      { name: 'company', label: 'Company', type: 'text', required: true, placeholder: 'Company whose stock is being sold' },
      { name: 'shares', label: 'Number of Shares', type: 'text', required: true, placeholder: '1,000,000 shares' },
      { name: 'purchasePrice', label: 'Purchase Price', type: 'text', required: true, placeholder: '$5,000,000' },
    ],
  },

  // Intellectual Property
  {
    id: 'trademark-assignment',
    name: 'Trademark Assignment',
    description: 'Transfer of trademark ownership',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'assignor', label: 'Assignor (Current Owner)', type: 'text', required: true, placeholder: 'Current trademark owner' },
      { name: 'assignee', label: 'Assignee (New Owner)', type: 'text', required: true, placeholder: 'New trademark owner' },
      { name: 'trademark', label: 'Trademark', type: 'text', required: true, placeholder: 'Trademark name/mark' },
      { name: 'registrationNumber', label: 'Registration Number', type: 'text', required: false, placeholder: 'USPTO registration number' },
      { name: 'consideration', label: 'Consideration', type: 'text', required: true, placeholder: 'Payment amount' },
    ],
  },
  {
    id: 'copyright-assignment',
    name: 'Copyright Assignment',
    description: 'Transfer of copyright ownership',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'assignor', label: 'Assignor', type: 'text', required: true, placeholder: 'Copyright owner' },
      { name: 'assignee', label: 'Assignee', type: 'text', required: true, placeholder: 'New owner' },
      { name: 'work', label: 'Copyrighted Work', type: 'textarea', required: true, placeholder: 'Description of work' },
      { name: 'consideration', label: 'Consideration', type: 'text', required: true, placeholder: 'Payment amount' },
    ],
  },
  {
    id: 'licensing-agreement',
    name: 'Licensing Agreement',
    description: 'License to use intellectual property',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'licensor', label: 'Licensor', type: 'text', required: true, placeholder: 'IP owner' },
      { name: 'licensee', label: 'Licensee', type: 'text', required: true, placeholder: 'Party receiving license' },
      { name: 'ip', label: 'Licensed IP', type: 'textarea', required: true, placeholder: 'Patent, trademark, copyright, trade secret' },
      { name: 'licenseType', label: 'License Type', type: 'select', required: true, options: ['Exclusive', 'Non-Exclusive', 'Sole'] },
      { name: 'royalties', label: 'Royalties/Fees', type: 'text', required: true, placeholder: '5% of sales, $10,000 upfront, etc.' },
    ],
  },

  // Employment Law
  {
    id: 'severance-agreement',
    name: 'Severance Agreement',
    description: 'Employment termination and severance terms',
    icon: <BusinessIcon />,
    category: 'Contracts',
    fields: [
      { name: 'employer', label: 'Employer', type: 'text', required: true, placeholder: 'Company name' },
      { name: 'employee', label: 'Employee', type: 'text', required: true, placeholder: 'Employee name' },
      { name: 'severancePay', label: 'Severance Pay', type: 'text', required: true, placeholder: '3 months salary, $50,000, etc.' },
      { name: 'releaseScope', label: 'Release Scope', type: 'textarea', required: true, placeholder: 'Claims being released' },
      { name: 'nonCompete', label: 'Non-Compete Terms', type: 'textarea', required: false, placeholder: 'Any post-employment restrictions' },
    ],
  },
  {
    id: 'offer-letter',
    name: 'Employment Offer Letter',
    description: 'Formal job offer to candidate',
    icon: <EmailIcon />,
    category: 'Correspondence',
    fields: [
      { name: 'candidate', label: 'Candidate Name', type: 'text', required: true, placeholder: 'John Doe' },
      { name: 'position', label: 'Position', type: 'text', required: true, placeholder: 'Senior Software Engineer' },
      { name: 'salary', label: 'Salary', type: 'text', required: true, placeholder: '$150,000/year' },
      { name: 'startDate', label: 'Start Date', type: 'text', required: true, placeholder: 'January 15, 2025' },
      { name: 'benefits', label: 'Benefits Summary', type: 'textarea', required: false, placeholder: 'Health, 401k, PTO, etc.' },
    ],
  },
  {
    id: 'termination-letter',
    name: 'Employment Termination Letter',
    description: 'Notice of employment termination',
    icon: <EmailIcon />,
    category: 'Correspondence',
    fields: [
      { name: 'employee', label: 'Employee Name', type: 'text', required: true, placeholder: 'Employee name' },
      { name: 'reason', label: 'Reason for Termination', type: 'select', required: true, options: ['Performance', 'Misconduct', 'Layoff/Reduction in Force', 'Position Elimination', 'Mutual Agreement'] },
      { name: 'effectiveDate', label: 'Effective Date', type: 'text', required: true, placeholder: 'Last day of employment' },
      { name: 'finalPay', label: 'Final Pay Details', type: 'textarea', required: true, placeholder: 'Accrued PTO, final paycheck date, etc.' },
    ],
  },

  // Estate Planning
  {
    id: 'will',
    name: 'Last Will and Testament',
    description: 'Testamentary document for estate distribution',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'testator', label: 'Testator Name', type: 'text', required: true, placeholder: 'Person making the will' },
      { name: 'beneficiaries', label: 'Beneficiaries', type: 'textarea', required: true, placeholder: 'List beneficiaries and bequests' },
      { name: 'executor', label: 'Executor', type: 'text', required: true, placeholder: 'Person to administer estate' },
      { name: 'guardians', label: 'Guardians for Minor Children', type: 'text', required: false, placeholder: 'If applicable' },
    ],
  },
  {
    id: 'power-of-attorney',
    name: 'Power of Attorney',
    description: 'Authorization to act on someone\'s behalf',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'principal', label: 'Principal', type: 'text', required: true, placeholder: 'Person granting power' },
      { name: 'agent', label: 'Agent/Attorney-in-Fact', type: 'text', required: true, placeholder: 'Person receiving power' },
      { name: 'poaType', label: 'POA Type', type: 'select', required: true, options: ['General', 'Limited/Special', 'Durable', 'Healthcare', 'Financial'] },
      { name: 'powers', label: 'Powers Granted', type: 'textarea', required: true, placeholder: 'Specific powers being granted' },
    ],
  },
  {
    id: 'living-trust',
    name: 'Living Trust',
    description: 'Revocable living trust agreement',
    icon: <ArticleIcon />,
    category: 'Contracts',
    fields: [
      { name: 'trustor', label: 'Trustor/Grantor', type: 'text', required: true, placeholder: 'Person creating trust' },
      { name: 'trustee', label: 'Trustee', type: 'text', required: true, placeholder: 'Person managing trust' },
      { name: 'beneficiaries', label: 'Beneficiaries', type: 'textarea', required: true, placeholder: 'Trust beneficiaries' },
      { name: 'assets', label: 'Trust Assets', type: 'textarea', required: true, placeholder: 'Property being transferred to trust' },
    ],
  },

  // Bankruptcy
  {
    id: 'bankruptcy-petition',
    name: 'Bankruptcy Petition (Chapter 7/13)',
    description: 'Petition to file bankruptcy',
    icon: <DescriptionIcon />,
    category: 'Pleadings',
    fields: [
      { name: 'debtor', label: 'Debtor Name', type: 'text', required: true, placeholder: 'Person/entity filing' },
      { name: 'chapter', label: 'Bankruptcy Chapter', type: 'select', required: true, options: ['Chapter 7 (Liquidation)', 'Chapter 13 (Repayment Plan)', 'Chapter 11 (Business Reorganization)'] },
      { name: 'debts', label: 'Total Debts', type: 'text', required: true, placeholder: '$150,000' },
      { name: 'assets', label: 'Total Assets', type: 'text', required: true, placeholder: '$75,000' },
      { name: 'income', label: 'Monthly Income', type: 'text', required: true, placeholder: '$5,000' },
    ],
  },

  // Personal Injury
  {
    id: 'demand-package',
    name: 'Personal Injury Demand Package',
    description: 'Comprehensive settlement demand',
    icon: <EmailIcon />,
    category: 'Correspondence',
    fields: [
      { name: 'claimant', label: 'Claimant/Plaintiff', type: 'text', required: true, placeholder: 'Injured party' },
      { name: 'incident', label: 'Incident Description', type: 'textarea', required: true, placeholder: 'Car accident, slip and fall, etc.' },
      { name: 'injuries', label: 'Injuries', type: 'textarea', required: true, placeholder: 'Medical diagnosis and treatment' },
      { name: 'medicalBills', label: 'Medical Bills', type: 'text', required: true, placeholder: '$50,000' },
      { name: 'lostWages', label: 'Lost Wages', type: 'text', required: false, placeholder: '$10,000' },
      { name: 'demandAmount', label: 'Total Demand', type: 'text', required: true, placeholder: '$250,000' },
    ],
  },
];

export default function AIDocumentsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch(() => setError('Failed to load cases'));
  }, []);

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedDocument('');
    setError('');
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Validate required fields
    const missingFields = selectedTemplate.fields
      .filter((f) => f.required && !formData[f.name])
      .map((f) => f.label);

    if (missingFields.length > 0) {
      setError(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const selectedCaseData = cases.find((c) => c.id === selectedCase);
      const caseContext = selectedCaseData
        ? `Case: ${selectedCaseData.title}\nClient: ${selectedCaseData.client?.firstName} ${selectedCaseData.client?.lastName}\nDescription: ${selectedCaseData.description}`
        : '';

      const instructions = `Generate a professional ${selectedTemplate.name} with the following details:\n\n${Object.entries(formData)
        .map(([key, value]) => {
          const field = selectedTemplate.fields.find((f) => f.name === key);
          return `${field?.label}: ${value}`;
        })
        .join('\n')}`;

      const response = await fetch('/api/ai/draft-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: selectedTemplate.name,
          caseContext,
          instructions,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate document');

      const data = await response.json();
      setGeneratedDocument(data.draft);
      setPreviewOpen(true);
    } catch (err) {
      setError('Failed to generate document. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!selectedCase || !generatedDocument) {
      setError('Please select a case and generate a document first');
      return;
    }

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${selectedTemplate?.name} - ${new Date().toLocaleDateString()}`,
          docType: selectedTemplate?.category === 'Motions' ? 'MOTION' :
                   selectedTemplate?.category === 'Pleadings' ? 'PLEADING' :
                   selectedTemplate?.category === 'Contracts' ? 'CONTRACT' :
                   selectedTemplate?.category === 'Discovery' ? 'EVIDENCE' :
                   selectedTemplate?.category === 'Correspondence' ? 'LETTER' : 'OTHER',
          caseId: selectedCase,
          content: generatedDocument,
        }),
      });

      if (!response.ok) throw new Error('Failed to save document');

      setPreviewOpen(false);
      setSelectedTemplate(null);
      setFormData({});
      setGeneratedDocument('');
      alert('Document saved successfully!');
    } catch (err) {
      setError('Failed to save document. Please try again.');
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Document Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Generate professional legal documents using AI templates
      </Typography>

      {!selectedTemplate ? (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {DOCUMENT_TEMPLATES.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2, color: 'primary.main' }}>{template.icon}</Box>
                      <Typography variant="h6" component="h2">
                        {template.name}
                      </Typography>
                    </Box>
                    <Chip label={template.category} size="small" sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AutoAwesomeIcon />}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      Generate
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 3, maxWidth: 900 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">{selectedTemplate.name}</Typography>
            <Button variant="outlined" onClick={() => setSelectedTemplate(null)}>
              Back to Templates
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            select
            label="Select Case (Optional)"
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            sx={{ mb: 3 }}
            helperText="Selecting a case provides context to the AI"
          >
            <MenuItem value="">None</MenuItem>
            {cases.map((caseItem) => (
              <MenuItem key={caseItem.id} value={caseItem.id}>
                {caseItem.title}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="h6" gutterBottom>
            Document Details
          </Typography>

          {selectedTemplate.fields.map((field) => (
            <TextField
              key={field.name}
              fullWidth
              select={field.type === 'select'}
              label={field.label}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
              multiline={field.type === 'textarea'}
              rows={field.type === 'textarea' ? 4 : undefined}
              placeholder={field.placeholder}
              sx={{ mb: 2 }}
            >
              {field.type === 'select' &&
                field.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </TextField>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={generating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Document with AI'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generated Document Preview</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={20}
            value={generatedDocument}
            onChange={(e) => setGeneratedDocument(e.target.value)}
            sx={{ mb: 2, fontFamily: 'monospace' }}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            Review and edit the generated document before saving. All AI-generated content should be
            reviewed by a licensed attorney.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveDocument} variant="contained">
            Save to Documents
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
