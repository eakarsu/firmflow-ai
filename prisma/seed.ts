import { PrismaClient, UserRole, CaseStatus, PracticeArea, TaskStatus, InvoiceStatus, DocumentType, FilingStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.courtFiling.deleteMany();
  await prisma.intakeForm.deleteMany();
  await prisma.document.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.task.deleteMany();
  await prisma.case.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@firmflow.ai',
      name: 'Admin User',
      hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  const lawyer1 = await prisma.user.create({
    data: {
      email: 'sarah.johnson@firmflow.ai',
      name: 'Sarah Johnson',
      hashedPassword,
      role: UserRole.LAWYER,
    },
  });

  const lawyer2 = await prisma.user.create({
    data: {
      email: 'michael.chen@firmflow.ai',
      name: 'Michael Chen',
      hashedPassword,
      role: UserRole.LAWYER,
    },
  });

  const lawyer3 = await prisma.user.create({
    data: {
      email: 'elena.rodriguez@firmflow.ai',
      name: 'Elena Rodriguez',
      hashedPassword,
      role: UserRole.LAWYER,
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      email: 'jennifer.smith@firmflow.ai',
      name: 'Jennifer Smith',
      hashedPassword,
      role: UserRole.STAFF,
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      email: 'david.brown@firmflow.ai',
      name: 'David Brown',
      hashedPassword,
      role: UserRole.STAFF,
    },
  });

  console.log('✅ Created users');

  // Create Clients
  const client1 = await prisma.client.create({
    data: {
      firstName: 'John',
      lastName: 'Anderson',
      email: 'john.anderson@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Boston, MA 02108',
      notes: 'Referred by past client. Prefers email communication.',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@email.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, Cambridge, MA 02139',
      notes: 'Spanish-speaking client. Works evening shift.',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert.w@businessemail.com',
      phone: '(555) 345-6789',
      address: '789 Park Plaza, Suite 200, Boston, MA 02116',
      companyName: 'Williams Tech Solutions LLC',
      notes: 'Business owner, technology consulting firm.',
    },
  });

  const client4 = await prisma.client.create({
    data: {
      firstName: 'Emily',
      lastName: 'Thompson',
      email: 'emily.thompson@email.com',
      phone: '(555) 456-7890',
      address: '321 Elm Street, Somerville, MA 02144',
      notes: 'Recently divorced, looking for custody modification.',
    },
  });

  const client5 = await prisma.client.create({
    data: {
      firstName: 'James',
      lastName: 'Lee',
      email: 'james.lee@email.com',
      phone: '(555) 567-8901',
      address: '654 Maple Dr, Newton, MA 02458',
      notes: 'First-time homebuyer, needs contract review.',
    },
  });

  const client6 = await prisma.client.create({
    data: {
      firstName: 'Sophia',
      lastName: 'Patel',
      email: 'sophia.patel@email.com',
      phone: '(555) 678-9012',
      address: '987 Washington St, Brookline, MA 02446',
      notes: 'Immigration matter - H1B visa application.',
    },
  });

  const client7 = await prisma.client.create({
    data: {
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.miller@email.com',
      phone: '(555) 789-0123',
      address: '147 Harvard St, Allston, MA 02134',
      notes: 'Criminal defense - DUI charge.',
    },
  });

  const client8 = await prisma.client.create({
    data: {
      firstName: 'Lisa',
      lastName: 'Wong',
      email: 'lisa.wong@startupco.com',
      phone: '(555) 890-1234',
      address: '258 Innovation Way, Cambridge, MA 02142',
      companyName: 'InnovateTech Startup Inc.',
      notes: 'Startup founder, needs incorporation and IP protection.',
    },
  });

  const client9 = await prisma.client.create({
    data: {
      firstName: 'Thomas',
      lastName: 'Davis',
      email: 'thomas.davis@email.com',
      phone: '(555) 901-2345',
      address: '369 Highland Ave, Malden, MA 02148',
      notes: 'Estate planning for elderly parents.',
    },
  });

  const client10 = await prisma.client.create({
    data: {
      firstName: 'Jennifer',
      lastName: 'Martinez',
      email: 'jennifer.m@email.com',
      phone: '(555) 012-3456',
      address: '741 Broadway, Revere, MA 02151',
      notes: 'Employment discrimination case - wrongful termination.',
    },
  });

  console.log('✅ Created clients');

  // Create Cases
  const case1 = await prisma.case.create({
    data: {
      title: 'Anderson Divorce Settlement',
      description: 'Divorce proceeding with property division and custody arrangements for two minor children.',
      clientId: client1.id,
      responsibleLawyerId: lawyer1.id,
      status: CaseStatus.OPEN,
      practiceArea: PracticeArea.FAMILY,
      courtName: 'Middlesex County Probate and Family Court',
      courtFileNumber: '2024-FAM-00234',
      openedAt: new Date('2024-09-15'),
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Garcia Immigration - Green Card Application',
      description: 'Employment-based green card application for software engineer. Includes labor certification.',
      clientId: client2.id,
      responsibleLawyerId: lawyer3.id,
      status: CaseStatus.PENDING,
      practiceArea: PracticeArea.IMMIGRATION,
      openedAt: new Date('2024-08-01'),
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: 'Williams Tech - LLC Formation & Operating Agreement',
      description: 'Business formation for technology consulting firm. Draft operating agreement and register with state.',
      clientId: client3.id,
      responsibleLawyerId: lawyer2.id,
      status: CaseStatus.CLOSED,
      practiceArea: PracticeArea.BUSINESS,
      openedAt: new Date('2024-06-10'),
      closedAt: new Date('2024-07-20'),
    },
  });

  const case4 = await prisma.case.create({
    data: {
      title: 'Thompson Custody Modification',
      description: 'Motion to modify custody order due to change in circumstances. Ex-spouse relocated.',
      clientId: client4.id,
      responsibleLawyerId: lawyer1.id,
      status: CaseStatus.OPEN,
      practiceArea: PracticeArea.FAMILY,
      courtName: 'Suffolk County Probate and Family Court',
      courtFileNumber: '2024-FAM-00567',
      openedAt: new Date('2024-10-01'),
    },
  });

  const case5 = await prisma.case.create({
    data: {
      title: 'Lee Property Purchase - Contract Review',
      description: 'Review and negotiate purchase and sale agreement for residential property.',
      clientId: client5.id,
      responsibleLawyerId: lawyer2.id,
      status: CaseStatus.PENDING,
      practiceArea: PracticeArea.REAL_ESTATE,
      openedAt: new Date('2024-10-20'),
    },
  });

  const case6 = await prisma.case.create({
    data: {
      title: 'Patel H1B Visa Extension',
      description: 'H1B visa extension application. Current visa expires in 3 months.',
      clientId: client6.id,
      responsibleLawyerId: lawyer3.id,
      status: CaseStatus.OPEN,
      practiceArea: PracticeArea.IMMIGRATION,
      openedAt: new Date('2024-09-01'),
    },
  });

  const case7 = await prisma.case.create({
    data: {
      title: 'Miller DUI Defense',
      description: 'First-offense DUI charge. BAC 0.12%. Negotiating plea agreement.',
      clientId: client7.id,
      responsibleLawyerId: lawyer2.id,
      status: CaseStatus.OPEN,
      practiceArea: PracticeArea.CRIMINAL,
      courtName: 'Boston Municipal Court',
      courtFileNumber: '2024-CR-01234',
      openedAt: new Date('2024-10-15'),
    },
  });

  const case8 = await prisma.case.create({
    data: {
      title: 'InnovateTech Startup - Incorporation & IP',
      description: 'Delaware C-Corp incorporation, trademark registration, and founder agreements.',
      clientId: client8.id,
      responsibleLawyerId: lawyer2.id,
      status: CaseStatus.OPEN,
      practiceArea: PracticeArea.BUSINESS,
      openedAt: new Date('2024-11-01'),
    },
  });

  const case9 = await prisma.case.create({
    data: {
      title: 'Davis Estate Planning',
      description: 'Comprehensive estate plan including wills, healthcare proxy, and power of attorney.',
      clientId: client9.id,
      responsibleLawyerId: lawyer1.id,
      status: CaseStatus.PENDING,
      practiceArea: PracticeArea.ESTATE_PLANNING,
      openedAt: new Date('2024-10-10'),
    },
  });

  const case10 = await prisma.case.create({
    data: {
      title: 'Martinez Wrongful Termination',
      description: 'Employment discrimination and wrongful termination claim. EEOC complaint filed.',
      clientId: client10.id,
      responsibleLawyerId: lawyer1.id,
      status: CaseStatus.OPEN,
      practiceArea: PracticeArea.EMPLOYMENT,
      openedAt: new Date('2024-09-20'),
    },
  });

  console.log('✅ Created cases');

  // Create Tasks with future dates
  const today = new Date();
  const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };

  await prisma.task.createMany({
    data: [
      // Case 1 tasks
      {
        caseId: case1.id,
        title: 'Draft divorce complaint',
        description: 'Prepare initial divorce complaint with property division schedule',
        assignedToUserId: lawyer1.id,
        status: TaskStatus.DONE,
        dueDate: addDays(-30), // Past date
      },
      {
        caseId: case1.id,
        title: 'Discovery - Financial Statements',
        description: 'Request and review spouse financial statements',
        assignedToUserId: staff1.id,
        status: TaskStatus.IN_PROGRESS,
        dueDate: addDays(7), // 7 days from now
      },
      {
        caseId: case1.id,
        title: 'Schedule mediation session',
        description: 'Coordinate mediation date with opposing counsel',
        assignedToUserId: staff1.id,
        status: TaskStatus.TODO,
        dueDate: addDays(22), // 22 days from now
      },
      // Case 4 tasks
      {
        caseId: case4.id,
        title: 'File Motion to Modify Custody',
        description: 'Prepare and file motion with supporting affidavits',
        assignedToUserId: lawyer1.id,
        status: TaskStatus.IN_PROGRESS,
        dueDate: addDays(2), // 2 days from now
      },
      {
        caseId: case4.id,
        title: 'Gather evidence of changed circumstances',
        description: 'Collect documentation of ex-spouse relocation',
        assignedToUserId: staff1.id,
        status: TaskStatus.TODO,
        dueDate: addDays(5), // 5 days from now
      },
      // Case 7 tasks
      {
        caseId: case7.id,
        title: 'Review police report and BAC results',
        description: 'Analyze arrest report for procedural issues',
        assignedToUserId: lawyer2.id,
        status: TaskStatus.DONE,
        dueDate: addDays(-10), // Past date
      },
      {
        caseId: case7.id,
        title: 'Negotiate plea agreement',
        description: 'Meet with DA to discuss reduced charges',
        assignedToUserId: lawyer2.id,
        status: TaskStatus.IN_PROGRESS,
        dueDate: addDays(5), // 5 days from now
      },
      // Case 8 tasks
      {
        caseId: case8.id,
        title: 'Draft Certificate of Incorporation',
        description: 'Prepare Delaware incorporation documents',
        assignedToUserId: lawyer2.id,
        status: TaskStatus.TODO,
        dueDate: addDays(14), // 14 days from now
      },
      {
        caseId: case8.id,
        title: 'Trademark search and filing',
        description: 'Conduct USPTO search and file trademark application',
        assignedToUserId: staff2.id,
        status: TaskStatus.TODO,
        dueDate: addDays(21), // 21 days from now
      },
    ],
  });

  console.log('✅ Created tasks');

  // Create Time Entries
  await prisma.timeEntry.createMany({
    data: [
      // Case 1 entries
      {
        caseId: case1.id,
        userId: lawyer1.id,
        description: 'Initial client consultation and case assessment',
        date: new Date('2024-09-15'),
        hours: 1.5,
        billable: true,
        billingRate: 350,
      },
      {
        caseId: case1.id,
        userId: lawyer1.id,
        description: 'Research property division law and draft complaint',
        date: new Date('2024-09-18'),
        hours: 3.0,
        billable: true,
        billingRate: 350,
      },
      {
        caseId: case1.id,
        userId: staff1.id,
        description: 'Gather client financial documents and organize case file',
        date: new Date('2024-09-20'),
        hours: 2.0,
        billable: true,
        billingRate: 150,
      },
      // Case 2 entries
      {
        caseId: case2.id,
        userId: lawyer3.id,
        description: 'Review client employment records and immigration history',
        date: new Date('2024-08-05'),
        hours: 2.5,
        billable: true,
        billingRate: 325,
      },
      {
        caseId: case2.id,
        userId: lawyer3.id,
        description: 'Prepare labor certification application',
        date: new Date('2024-08-12'),
        hours: 4.0,
        billable: true,
        billingRate: 325,
      },
      // Case 7 entries
      {
        caseId: case7.id,
        userId: lawyer2.id,
        description: 'Client intake and review of police report',
        date: new Date('2024-10-16'),
        hours: 1.5,
        billable: true,
        billingRate: 300,
      },
      {
        caseId: case7.id,
        userId: lawyer2.id,
        description: 'Legal research on DUI defenses and suppression motions',
        date: new Date('2024-10-18'),
        hours: 2.5,
        billable: true,
        billingRate: 300,
      },
      {
        caseId: case7.id,
        userId: lawyer2.id,
        description: 'Meeting with District Attorney to discuss plea options',
        date: new Date('2024-10-25'),
        hours: 1.0,
        billable: true,
        billingRate: 300,
      },
    ],
  });

  console.log('✅ Created time entries');

  // Create Invoices
  await prisma.invoice.createMany({
    data: [
      {
        caseId: case1.id,
        clientId: client1.id,
        invoiceNumber: 'INV-2024-001',
        issueDate: new Date('2024-10-01'),
        dueDate: new Date('2024-10-31'),
        status: InvoiceStatus.PAID,
        totalAmount: 1075.0,
      },
      {
        caseId: case2.id,
        clientId: client2.id,
        invoiceNumber: 'INV-2024-002',
        issueDate: new Date('2024-09-01'),
        dueDate: new Date('2024-09-30'),
        status: InvoiceStatus.SENT,
        totalAmount: 2112.5,
      },
      {
        caseId: case7.id,
        clientId: client7.id,
        invoiceNumber: 'INV-2024-003',
        issueDate: new Date('2024-11-01'),
        dueDate: new Date('2024-11-15'),
        status: InvoiceStatus.DRAFT,
        totalAmount: 1500.0,
      },
    ],
  });

  console.log('✅ Created invoices');

  // Create Documents
  await prisma.document.createMany({
    data: [
      {
        caseId: case1.id,
        title: 'Divorce Complaint',
        docType: DocumentType.PLEADING,
        content: 'COMMONWEALTH OF MASSACHUSETTS\nMIDDLESEX COUNTY PROBATE AND FAMILY COURT\n\nJohn Anderson, Plaintiff\nv.\nJane Anderson, Defendant\n\nCOMPLAINT FOR DIVORCE\n\nNow comes the Plaintiff, John Anderson, by and through his attorney, and respectfully states as follows:\n\n1. The parties were married on June 15, 2010, in Boston, Massachusetts.\n2. The marriage has irretrievably broken down.\n3. There are two minor children of the marriage...',
      },
      {
        caseId: case1.id,
        title: 'Financial Statement',
        docType: DocumentType.FORM,
        content: 'FINANCIAL STATEMENT\n\nCase: Anderson v. Anderson\nParty: John Anderson\n\nINCOME:\nGross Annual Income: $125,000\nDeductions: $35,000\nNet Annual Income: $90,000...',
      },
      {
        caseId: case3.id,
        title: 'LLC Operating Agreement',
        docType: DocumentType.CONTRACT,
        content: 'OPERATING AGREEMENT OF WILLIAMS TECH SOLUTIONS LLC\n\nThis Operating Agreement is entered into as of July 1, 2024, by and among the Members of Williams Tech Solutions LLC, a Massachusetts limited liability company.\n\nARTICLE I - FORMATION\n1.1 Name. The name of the limited liability company is Williams Tech Solutions LLC...',
      },
      {
        caseId: case7.id,
        title: 'Motion to Suppress Evidence',
        docType: DocumentType.MOTION,
        content: 'COMMONWEALTH OF MASSACHUSETTS\nBOSTON MUNICIPAL COURT\n\nCommonwealth v. David Miller\nCase No. 2024-CR-01234\n\nDEFENDANT\'S MOTION TO SUPPRESS EVIDENCE\n\nNow comes the Defendant, David Miller, and respectfully moves this Court to suppress all evidence obtained as a result of the traffic stop...',
      },
      {
        caseId: case8.id,
        title: 'Founder Stock Purchase Agreement',
        docType: DocumentType.CONTRACT,
        content: 'STOCK PURCHASE AGREEMENT\n\nThis Stock Purchase Agreement is made as of November 5, 2024, between InnovateTech Startup Inc., a Delaware corporation, and Lisa Wong.\n\nWHEREAS, the Company desires to issue shares of Common Stock to the Founder...',
      },
    ],
  });

  console.log('✅ Created documents');

  // Create Intake Forms
  await prisma.intakeForm.createMany({
    data: [
      {
        clientId: client1.id,
        caseType: 'Divorce',
        rawAnswers: JSON.stringify({
          marriageDate: '2010-06-15',
          separationDate: '2024-06-01',
          hasChildren: true,
          numberOfChildren: 2,
          childrenAges: '8, 6',
          reasonForDivorce: 'Irreconcilable differences',
          propertyOwned: 'Family home in Boston, two vehicles, joint savings account',
          debts: 'Mortgage, two car loans',
          concerns: 'Want joint custody of children and fair division of property',
        }),
        aiSummary: 'Client seeking divorce after 14-year marriage with two minor children (ages 8 and 6). Separated in June 2024. Primary assets include family home and vehicles. Client desires joint custody arrangement.',
        aiIssuesList: JSON.stringify([
          'Child custody and parenting plan',
          'Division of marital home',
          'Child support calculation',
          'Division of retirement accounts',
        ]),
      },
      {
        clientId: client7.id,
        caseType: 'Criminal Defense - DUI',
        rawAnswers: JSON.stringify({
          arrestDate: '2024-10-10',
          location: 'Route 2, Cambridge, MA',
          bacLevel: '0.12',
          priorOffenses: 'None',
          circumstance: 'Pulled over for weaving between lanes. Had 3 beers at dinner.',
          fieldSobrietyTest: 'Yes, performed at scene',
          breathalyzer: 'Yes, at police station',
          witnessesPresent: 'Friend was passenger in car',
        }),
        aiSummary: 'First-time DUI offense with BAC of 0.12%. Client pulled over for weaving. Performed field sobriety and breathalyzer tests. No prior criminal record.',
        aiIssuesList: JSON.stringify([
          'Challenge validity of traffic stop',
          'Review breathalyzer calibration and administration',
          'Evaluate field sobriety test procedures',
          'Negotiate plea to reduced charge',
          'Alternative sentencing options',
        ]),
      },
    ],
  });

  console.log('✅ Created intake forms');

  // Create Court Filings
  await prisma.courtFiling.createMany({
    data: [
      {
        caseId: case1.id,
        filingType: 'Complaint for Divorce',
        courtName: 'Middlesex County Probate and Family Court',
        status: FilingStatus.FILED,
        filedAt: addDays(-30),
      },
      {
        caseId: case4.id,
        filingType: 'Motion to Modify Custody',
        courtName: 'Suffolk County Probate and Family Court',
        dueDate: addDays(3), // 3 days from now
        status: FilingStatus.DRAFT,
      },
      {
        caseId: case7.id,
        filingType: 'Motion to Suppress Evidence',
        courtName: 'Boston Municipal Court',
        dueDate: addDays(10), // 10 days from now
        status: FilingStatus.READY_TO_FILE,
      },
      {
        caseId: case8.id,
        filingType: 'Certificate of Incorporation',
        courtName: 'Delaware Secretary of State',
        dueDate: addDays(15), // 15 days from now
        status: FilingStatus.DRAFT,
      },
    ],
  });

  console.log('✅ Created court filings');

  // Create Message Threads
  const thread1 = await prisma.messageThread.create({
    data: {
      caseId: case1.id,
      subject: 'Discovery Request Follow-up',
      createdByUserId: lawyer1.id,
    },
  });

  // Create Messages
  await prisma.message.createMany({
    data: [
      {
        threadId: thread1.id,
        senderUserId: lawyer1.id,
        content: 'Hi John, we need to follow up on the financial documents. Have you been able to gather the bank statements I requested?',
        sentAt: new Date('2024-11-10T10:30:00'),
        readAt: new Date('2024-11-10T14:20:00'),
      },
    ],
  });

  console.log('✅ Created message threads and messages');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Sample Login Credentials:');
  console.log('Admin: admin@firmflow.ai / password123');
  console.log('Lawyer: sarah.johnson@firmflow.ai / password123');
  console.log('Staff: jennifer.smith@firmflow.ai / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
