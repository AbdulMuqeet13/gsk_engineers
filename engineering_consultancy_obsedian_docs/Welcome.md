# Engineering Consultancy ERP - Knowledge Base

Welcome to the knowledge base for the **Civil Engineering Consultancy ERP**. This vault serves as the single source of truth for all project documentation, architecture decisions, conventions, and completed work.

## Navigation

### Project Overview
- [[01-Project/Overview]] - What we're building and why
- [[01-Project/Tech Stack]] - Technologies and versions
- [[01-Project/Build Order]] - Phase-by-phase roadmap
- [[01-Project/Roles and Permissions]] - Access control model

### Architecture
- [[02-Architecture/Application Structure]] - Directory layout and patterns
- [[02-Architecture/Accounting Model]] - Double-entry bookkeeping design
- [[02-Architecture/Database Schema]] - All tables and relationships

### Conventions
- [[03-Conventions/Backend Patterns]] - Actions, Services, Form Requests, Policies
- [[03-Conventions/Frontend Patterns]] - Components, Pages, DataTable, Dialogs
- [[03-Conventions/Testing]] - Test structure and conventions
- [[03-Conventions/Code Style]] - PHP and TypeScript formatting rules

### User Guide
- [[09-User-Guide/Getting Started]] - First-time setup, roles, navigation, key concepts
- [[09-User-Guide/Projects]] - Project management and assignments
- [[09-User-Guide/Employees and HR]] - Employees, attendance, leave requests
- [[09-User-Guide/Accounting]] - Chart of accounts, journal entries, general ledger, trial balance
- [[09-User-Guide/Expenses]] - Expense entry and approval workflow
- [[09-User-Guide/Payroll]] - Payroll runs, payslips, PDF download
- [[09-User-Guide/Transfers]] - Inter-project fund transfers
- [[09-User-Guide/Reports]] - Financial statements, project reports, payroll report, exports

### Completed Phases
- [[04-Phases/Phase 1 - Foundation]] - Auth, roles, permissions, layout, base components
- [[04-Phases/Phase 2 - Master Data]] - Chart of Accounts, Projects, Employees, Assignments
- [[04-Phases/Phase 3 - Accounting Core]] - JournalService, journal entries, general ledger, trial balance
- [[04-Phases/Phase 4 - Expenses]] - Expense CRUD with approval workflow
- [[04-Phases/Phase 5 - Payroll]] - Attendance, leave, payroll runs, payslips
- [[04-Phases/Phase 6 - Inter-Project Transfers]] - TransferService, receivable/payable, position report
- [[04-Phases/Phase 7 - Financial Statements]] - P&L, balance sheet
- [[04-Phases/Phase 8 - Reports and Enhancements]] - Reports, attachments, payslip PDF, delete safety

### Database
- [[05-Database/Tables Reference]] - Every table with columns and indexes
- [[05-Database/Seeders]] - Default data and seeder hierarchy

### Backend Reference
- [[06-Backend/Enums]] - All PHP enums
- [[06-Backend/Controllers]] - Controller index with routes
- [[06-Backend/Actions]] - Action classes reference
- [[06-Backend/Form Requests]] - Validation rules reference

### Frontend Reference
- [[07-Frontend/TypeScript Types]] - Model types and enum unions
- [[07-Frontend/Components]] - Component inventory
- [[07-Frontend/Pages]] - Page inventory with props

### Gotchas
- [[08-Gotchas/Known Issues]] - Bugs, workarounds, and traps to avoid
