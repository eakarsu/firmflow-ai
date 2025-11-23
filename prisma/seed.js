"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = __importStar(require("bcryptjs"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, admin, lawyer1, lawyer2, lawyer3, staff1, staff2, client1, client2, client3, client4, client5, client6, client7, client8, client9, client10, case1, case2, case3, case4, case5, case6, case7, case8, case9, case10, thread1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Starting seed...');
                    // Clear existing data
                    return [4 /*yield*/, prisma.message.deleteMany()];
                case 1:
                    // Clear existing data
                    _a.sent();
                    return [4 /*yield*/, prisma.messageThread.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.courtFiling.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.intakeForm.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.document.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.invoice.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.timeEntry.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.task.deleteMany()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.case.deleteMany()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, prisma.client.deleteMany()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 11:
                    _a.sent();
                    console.log('✅ Cleared existing data');
                    return [4 /*yield*/, bcrypt.hash('password123', 10)];
                case 12:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'admin@firmflow.ai',
                                name: 'Admin User',
                                hashedPassword: hashedPassword,
                                role: client_1.UserRole.ADMIN,
                            },
                        })];
                case 13:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'sarah.johnson@firmflow.ai',
                                name: 'Sarah Johnson',
                                hashedPassword: hashedPassword,
                                role: client_1.UserRole.LAWYER,
                            },
                        })];
                case 14:
                    lawyer1 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'michael.chen@firmflow.ai',
                                name: 'Michael Chen',
                                hashedPassword: hashedPassword,
                                role: client_1.UserRole.LAWYER,
                            },
                        })];
                case 15:
                    lawyer2 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'elena.rodriguez@firmflow.ai',
                                name: 'Elena Rodriguez',
                                hashedPassword: hashedPassword,
                                role: client_1.UserRole.LAWYER,
                            },
                        })];
                case 16:
                    lawyer3 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'jennifer.smith@firmflow.ai',
                                name: 'Jennifer Smith',
                                hashedPassword: hashedPassword,
                                role: client_1.UserRole.STAFF,
                            },
                        })];
                case 17:
                    staff1 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'david.brown@firmflow.ai',
                                name: 'David Brown',
                                hashedPassword: hashedPassword,
                                role: client_1.UserRole.STAFF,
                            },
                        })];
                case 18:
                    staff2 = _a.sent();
                    console.log('✅ Created users');
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'John',
                                lastName: 'Anderson',
                                email: 'john.anderson@email.com',
                                phone: '(555) 123-4567',
                                address: '123 Main St, Boston, MA 02108',
                                notes: 'Referred by past client. Prefers email communication.',
                            },
                        })];
                case 19:
                    client1 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'Maria',
                                lastName: 'Garcia',
                                email: 'maria.garcia@email.com',
                                phone: '(555) 234-5678',
                                address: '456 Oak Ave, Cambridge, MA 02139',
                                notes: 'Spanish-speaking client. Works evening shift.',
                            },
                        })];
                case 20:
                    client2 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'Robert',
                                lastName: 'Williams',
                                email: 'robert.w@businessemail.com',
                                phone: '(555) 345-6789',
                                address: '789 Park Plaza, Suite 200, Boston, MA 02116',
                                companyName: 'Williams Tech Solutions LLC',
                                notes: 'Business owner, technology consulting firm.',
                            },
                        })];
                case 21:
                    client3 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'Emily',
                                lastName: 'Thompson',
                                email: 'emily.thompson@email.com',
                                phone: '(555) 456-7890',
                                address: '321 Elm Street, Somerville, MA 02144',
                                notes: 'Recently divorced, looking for custody modification.',
                            },
                        })];
                case 22:
                    client4 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'James',
                                lastName: 'Lee',
                                email: 'james.lee@email.com',
                                phone: '(555) 567-8901',
                                address: '654 Maple Dr, Newton, MA 02458',
                                notes: 'First-time homebuyer, needs contract review.',
                            },
                        })];
                case 23:
                    client5 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'Sophia',
                                lastName: 'Patel',
                                email: 'sophia.patel@email.com',
                                phone: '(555) 678-9012',
                                address: '987 Washington St, Brookline, MA 02446',
                                notes: 'Immigration matter - H1B visa application.',
                            },
                        })];
                case 24:
                    client6 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'David',
                                lastName: 'Miller',
                                email: 'david.miller@email.com',
                                phone: '(555) 789-0123',
                                address: '147 Harvard St, Allston, MA 02134',
                                notes: 'Criminal defense - DUI charge.',
                            },
                        })];
                case 25:
                    client7 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'Lisa',
                                lastName: 'Wong',
                                email: 'lisa.wong@startupco.com',
                                phone: '(555) 890-1234',
                                address: '258 Innovation Way, Cambridge, MA 02142',
                                companyName: 'InnovateTech Startup Inc.',
                                notes: 'Startup founder, needs incorporation and IP protection.',
                            },
                        })];
                case 26:
                    client8 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'Thomas',
                                lastName: 'Davis',
                                email: 'thomas.davis@email.com',
                                phone: '(555) 901-2345',
                                address: '369 Highland Ave, Malden, MA 02148',
                                notes: 'Estate planning for elderly parents.',
                            },
                        })];
                case 27:
                    client9 = _a.sent();
                    return [4 /*yield*/, prisma.client.create({
                            data: {
                                firstName: 'Jennifer',
                                lastName: 'Martinez',
                                email: 'jennifer.m@email.com',
                                phone: '(555) 012-3456',
                                address: '741 Broadway, Revere, MA 02151',
                                notes: 'Employment discrimination case - wrongful termination.',
                            },
                        })];
                case 28:
                    client10 = _a.sent();
                    console.log('✅ Created clients');
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Anderson Divorce Settlement',
                                description: 'Divorce proceeding with property division and custody arrangements for two minor children.',
                                clientId: client1.id,
                                responsibleLawyerId: lawyer1.id,
                                status: client_1.CaseStatus.OPEN,
                                practiceArea: client_1.PracticeArea.FAMILY,
                                courtName: 'Middlesex County Probate and Family Court',
                                courtFileNumber: '2024-FAM-00234',
                                openedAt: new Date('2024-09-15'),
                            },
                        })];
                case 29:
                    case1 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Garcia Immigration - Green Card Application',
                                description: 'Employment-based green card application for software engineer. Includes labor certification.',
                                clientId: client2.id,
                                responsibleLawyerId: lawyer3.id,
                                status: client_1.CaseStatus.PENDING,
                                practiceArea: client_1.PracticeArea.IMMIGRATION,
                                openedAt: new Date('2024-08-01'),
                            },
                        })];
                case 30:
                    case2 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Williams Tech - LLC Formation & Operating Agreement',
                                description: 'Business formation for technology consulting firm. Draft operating agreement and register with state.',
                                clientId: client3.id,
                                responsibleLawyerId: lawyer2.id,
                                status: client_1.CaseStatus.CLOSED,
                                practiceArea: client_1.PracticeArea.BUSINESS,
                                openedAt: new Date('2024-06-10'),
                                closedAt: new Date('2024-07-20'),
                            },
                        })];
                case 31:
                    case3 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Thompson Custody Modification',
                                description: 'Motion to modify custody order due to change in circumstances. Ex-spouse relocated.',
                                clientId: client4.id,
                                responsibleLawyerId: lawyer1.id,
                                status: client_1.CaseStatus.OPEN,
                                practiceArea: client_1.PracticeArea.FAMILY,
                                courtName: 'Suffolk County Probate and Family Court',
                                courtFileNumber: '2024-FAM-00567',
                                openedAt: new Date('2024-10-01'),
                            },
                        })];
                case 32:
                    case4 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Lee Property Purchase - Contract Review',
                                description: 'Review and negotiate purchase and sale agreement for residential property.',
                                clientId: client5.id,
                                responsibleLawyerId: lawyer2.id,
                                status: client_1.CaseStatus.PENDING,
                                practiceArea: client_1.PracticeArea.REAL_ESTATE,
                                openedAt: new Date('2024-10-20'),
                            },
                        })];
                case 33:
                    case5 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Patel H1B Visa Extension',
                                description: 'H1B visa extension application. Current visa expires in 3 months.',
                                clientId: client6.id,
                                responsibleLawyerId: lawyer3.id,
                                status: client_1.CaseStatus.OPEN,
                                practiceArea: client_1.PracticeArea.IMMIGRATION,
                                openedAt: new Date('2024-09-01'),
                            },
                        })];
                case 34:
                    case6 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Miller DUI Defense',
                                description: 'First-offense DUI charge. BAC 0.12%. Negotiating plea agreement.',
                                clientId: client7.id,
                                responsibleLawyerId: lawyer2.id,
                                status: client_1.CaseStatus.OPEN,
                                practiceArea: client_1.PracticeArea.CRIMINAL,
                                courtName: 'Boston Municipal Court',
                                courtFileNumber: '2024-CR-01234',
                                openedAt: new Date('2024-10-15'),
                            },
                        })];
                case 35:
                    case7 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'InnovateTech Startup - Incorporation & IP',
                                description: 'Delaware C-Corp incorporation, trademark registration, and founder agreements.',
                                clientId: client8.id,
                                responsibleLawyerId: lawyer2.id,
                                status: client_1.CaseStatus.OPEN,
                                practiceArea: client_1.PracticeArea.BUSINESS,
                                openedAt: new Date('2024-11-01'),
                            },
                        })];
                case 36:
                    case8 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Davis Estate Planning',
                                description: 'Comprehensive estate plan including wills, healthcare proxy, and power of attorney.',
                                clientId: client9.id,
                                responsibleLawyerId: lawyer1.id,
                                status: client_1.CaseStatus.PENDING,
                                practiceArea: client_1.PracticeArea.ESTATE_PLANNING,
                                openedAt: new Date('2024-10-10'),
                            },
                        })];
                case 37:
                    case9 = _a.sent();
                    return [4 /*yield*/, prisma.case.create({
                            data: {
                                title: 'Martinez Wrongful Termination',
                                description: 'Employment discrimination and wrongful termination claim. EEOC complaint filed.',
                                clientId: client10.id,
                                responsibleLawyerId: lawyer1.id,
                                status: client_1.CaseStatus.OPEN,
                                practiceArea: client_1.PracticeArea.EMPLOYMENT,
                                openedAt: new Date('2024-09-20'),
                            },
                        })];
                case 38:
                    case10 = _a.sent();
                    console.log('✅ Created cases');
                    // Create Tasks
                    return [4 /*yield*/, prisma.task.createMany({
                            data: [
                                // Case 1 tasks
                                {
                                    caseId: case1.id,
                                    title: 'Draft divorce complaint',
                                    description: 'Prepare initial divorce complaint with property division schedule',
                                    assignedToUserId: lawyer1.id,
                                    status: client_1.TaskStatus.DONE,
                                    dueDate: new Date('2024-09-20'),
                                },
                                {
                                    caseId: case1.id,
                                    title: 'Discovery - Financial Statements',
                                    description: 'Request and review spouse financial statements',
                                    assignedToUserId: staff1.id,
                                    status: client_1.TaskStatus.IN_PROGRESS,
                                    dueDate: new Date('2024-11-30'),
                                },
                                {
                                    caseId: case1.id,
                                    title: 'Schedule mediation session',
                                    description: 'Coordinate mediation date with opposing counsel',
                                    assignedToUserId: staff1.id,
                                    status: client_1.TaskStatus.TODO,
                                    dueDate: new Date('2024-12-15'),
                                },
                                // Case 4 tasks
                                {
                                    caseId: case4.id,
                                    title: 'File Motion to Modify Custody',
                                    description: 'Prepare and file motion with supporting affidavits',
                                    assignedToUserId: lawyer1.id,
                                    status: client_1.TaskStatus.IN_PROGRESS,
                                    dueDate: new Date('2024-11-25'),
                                },
                                {
                                    caseId: case4.id,
                                    title: 'Gather evidence of changed circumstances',
                                    description: 'Collect documentation of ex-spouse relocation',
                                    assignedToUserId: staff1.id,
                                    status: client_1.TaskStatus.TODO,
                                    dueDate: new Date('2024-11-20'),
                                },
                                // Case 7 tasks
                                {
                                    caseId: case7.id,
                                    title: 'Review police report and BAC results',
                                    description: 'Analyze arrest report for procedural issues',
                                    assignedToUserId: lawyer2.id,
                                    status: client_1.TaskStatus.DONE,
                                    dueDate: new Date('2024-10-18'),
                                },
                                {
                                    caseId: case7.id,
                                    title: 'Negotiate plea agreement',
                                    description: 'Meet with DA to discuss reduced charges',
                                    assignedToUserId: lawyer2.id,
                                    status: client_1.TaskStatus.IN_PROGRESS,
                                    dueDate: new Date('2024-11-28'),
                                },
                                // Case 8 tasks
                                {
                                    caseId: case8.id,
                                    title: 'Draft Certificate of Incorporation',
                                    description: 'Prepare Delaware incorporation documents',
                                    assignedToUserId: lawyer2.id,
                                    status: client_1.TaskStatus.TODO,
                                    dueDate: new Date('2024-11-15'),
                                },
                                {
                                    caseId: case8.id,
                                    title: 'Trademark search and filing',
                                    description: 'Conduct USPTO search and file trademark application',
                                    assignedToUserId: staff2.id,
                                    status: client_1.TaskStatus.TODO,
                                    dueDate: new Date('2024-11-30'),
                                },
                            ],
                        })];
                case 39:
                    // Create Tasks
                    _a.sent();
                    console.log('✅ Created tasks');
                    // Create Time Entries
                    return [4 /*yield*/, prisma.timeEntry.createMany({
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
                        })];
                case 40:
                    // Create Time Entries
                    _a.sent();
                    console.log('✅ Created time entries');
                    // Create Invoices
                    return [4 /*yield*/, prisma.invoice.createMany({
                            data: [
                                {
                                    caseId: case1.id,
                                    clientId: client1.id,
                                    invoiceNumber: 'INV-2024-001',
                                    issueDate: new Date('2024-10-01'),
                                    dueDate: new Date('2024-10-31'),
                                    status: client_1.InvoiceStatus.PAID,
                                    totalAmount: 1075.0,
                                },
                                {
                                    caseId: case2.id,
                                    clientId: client2.id,
                                    invoiceNumber: 'INV-2024-002',
                                    issueDate: new Date('2024-09-01'),
                                    dueDate: new Date('2024-09-30'),
                                    status: client_1.InvoiceStatus.SENT,
                                    totalAmount: 2112.5,
                                },
                                {
                                    caseId: case7.id,
                                    clientId: client7.id,
                                    invoiceNumber: 'INV-2024-003',
                                    issueDate: new Date('2024-11-01'),
                                    dueDate: new Date('2024-11-15'),
                                    status: client_1.InvoiceStatus.DRAFT,
                                    totalAmount: 1500.0,
                                },
                            ],
                        })];
                case 41:
                    // Create Invoices
                    _a.sent();
                    console.log('✅ Created invoices');
                    // Create Documents
                    return [4 /*yield*/, prisma.document.createMany({
                            data: [
                                {
                                    caseId: case1.id,
                                    title: 'Divorce Complaint',
                                    docType: client_1.DocumentType.PLEADING,
                                    content: 'COMMONWEALTH OF MASSACHUSETTS\nMIDDLESEX COUNTY PROBATE AND FAMILY COURT\n\nJohn Anderson, Plaintiff\nv.\nJane Anderson, Defendant\n\nCOMPLAINT FOR DIVORCE\n\nNow comes the Plaintiff, John Anderson, by and through his attorney, and respectfully states as follows:\n\n1. The parties were married on June 15, 2010, in Boston, Massachusetts.\n2. The marriage has irretrievably broken down.\n3. There are two minor children of the marriage...',
                                },
                                {
                                    caseId: case1.id,
                                    title: 'Financial Statement',
                                    docType: client_1.DocumentType.FORM,
                                    content: 'FINANCIAL STATEMENT\n\nCase: Anderson v. Anderson\nParty: John Anderson\n\nINCOME:\nGross Annual Income: $125,000\nDeductions: $35,000\nNet Annual Income: $90,000...',
                                },
                                {
                                    caseId: case3.id,
                                    title: 'LLC Operating Agreement',
                                    docType: client_1.DocumentType.CONTRACT,
                                    content: 'OPERATING AGREEMENT OF WILLIAMS TECH SOLUTIONS LLC\n\nThis Operating Agreement is entered into as of July 1, 2024, by and among the Members of Williams Tech Solutions LLC, a Massachusetts limited liability company.\n\nARTICLE I - FORMATION\n1.1 Name. The name of the limited liability company is Williams Tech Solutions LLC...',
                                },
                                {
                                    caseId: case7.id,
                                    title: 'Motion to Suppress Evidence',
                                    docType: client_1.DocumentType.MOTION,
                                    content: 'COMMONWEALTH OF MASSACHUSETTS\nBOSTON MUNICIPAL COURT\n\nCommonwealth v. David Miller\nCase No. 2024-CR-01234\n\nDEFENDANT\'S MOTION TO SUPPRESS EVIDENCE\n\nNow comes the Defendant, David Miller, and respectfully moves this Court to suppress all evidence obtained as a result of the traffic stop...',
                                },
                                {
                                    caseId: case8.id,
                                    title: 'Founder Stock Purchase Agreement',
                                    docType: client_1.DocumentType.CONTRACT,
                                    content: 'STOCK PURCHASE AGREEMENT\n\nThis Stock Purchase Agreement is made as of November 5, 2024, between InnovateTech Startup Inc., a Delaware corporation, and Lisa Wong.\n\nWHEREAS, the Company desires to issue shares of Common Stock to the Founder...',
                                },
                            ],
                        })];
                case 42:
                    // Create Documents
                    _a.sent();
                    console.log('✅ Created documents');
                    // Create Intake Forms
                    return [4 /*yield*/, prisma.intakeForm.createMany({
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
                        })];
                case 43:
                    // Create Intake Forms
                    _a.sent();
                    console.log('✅ Created intake forms');
                    // Create Court Filings
                    return [4 /*yield*/, prisma.courtFiling.createMany({
                            data: [
                                {
                                    caseId: case1.id,
                                    filingType: 'Complaint for Divorce',
                                    courtName: 'Middlesex County Probate and Family Court',
                                    status: client_1.FilingStatus.FILED,
                                    filedAt: new Date('2024-09-22'),
                                },
                                {
                                    caseId: case4.id,
                                    filingType: 'Motion to Modify Custody',
                                    courtName: 'Suffolk County Probate and Family Court',
                                    dueDate: new Date('2024-11-25'),
                                    status: client_1.FilingStatus.DRAFT,
                                },
                                {
                                    caseId: case7.id,
                                    filingType: 'Motion to Suppress Evidence',
                                    courtName: 'Boston Municipal Court',
                                    dueDate: new Date('2024-11-30'),
                                    status: client_1.FilingStatus.READY_TO_FILE,
                                },
                            ],
                        })];
                case 44:
                    // Create Court Filings
                    _a.sent();
                    console.log('✅ Created court filings');
                    return [4 /*yield*/, prisma.messageThread.create({
                            data: {
                                caseId: case1.id,
                                subject: 'Discovery Request Follow-up',
                                createdByUserId: lawyer1.id,
                            },
                        })];
                case 45:
                    thread1 = _a.sent();
                    // Create Messages
                    return [4 /*yield*/, prisma.message.createMany({
                            data: [
                                {
                                    threadId: thread1.id,
                                    senderUserId: lawyer1.id,
                                    content: 'Hi John, we need to follow up on the financial documents. Have you been able to gather the bank statements I requested?',
                                    sentAt: new Date('2024-11-10T10:30:00'),
                                    readAt: new Date('2024-11-10T14:20:00'),
                                },
                            ],
                        })];
                case 46:
                    // Create Messages
                    _a.sent();
                    console.log('✅ Created message threads and messages');
                    console.log('🎉 Seed completed successfully!');
                    console.log('\n📝 Sample Login Credentials:');
                    console.log('Admin: admin@firmflow.ai / password123');
                    console.log('Lawyer: sarah.johnson@firmflow.ai / password123');
                    console.log('Staff: jennifer.smith@firmflow.ai / password123');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error during seed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
