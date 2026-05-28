## Problem

HR teams in mid-to-large organizations often struggle to efficiently manage employee records and derive actionable salary insights across different roles and geographies.

In organizations with ~10,000 employees, manual tools like spreadsheets become error-prone, slow, and difficult to scale when performing operations such as:

Adding, updating, viewing, and deleting employee records
Analyzing salary distributions across countries and job roles
Identifying inconsistencies or anomalies in compensation
Generating quick insights for budgeting and HR planning

There is a need for a lightweight, scalable, and user-friendly internal tool that enables HR managers to manage employee data and instantly access meaningful salary analytics.

## Solution

We will build a full-stack Employee Salary Management System designed for HR managers, consisting of:
A backend service responsible for employee data management, business logic, and analytics
A relational database (SQLite) to store structured employee records efficiently
A React-based UI for HR users to interact with the system
A data seeding pipeline capable of generating and inserting 10,000 employee records efficiently

The system will prioritize:
Clean and modular architecture for maintainability
Efficient querying for salary analytics at scale
Fast and deterministic seeding process
Simple but intuitive UI for HR workflows

The backend will expose REST APIs for CRUD operations and analytics computation, while the frontend will provide an interactive dashboard for employee management and salary insights.

## Feature

1. Employee Management (CRUD)
   View all employees in a paginated table
   Search and filter employees by:
   Name
   Job Title
   Country
   Department

2. Salary Insights Dashboard
   Provide HR managers with real-time analytics:
   Minimum, maximum, and average salary by country
   Average salary by job title within a selected country
   Salary distribution visualization (optional chart view)
   Headcount by country and job title
   Outlier detection (employees earning significantly above/below average)

3. Data Seeding & Performance
   Seed script generates 10,000 employees using:
   first_names.txt
   last_names.txt
   Ensures realistic distribution across:
   Countries
   Job titles
   Salary ranges
   Optimized bulk insert strategy (batch inserts instead of row-by-row inserts)
   Designed to be re-runnable without performance degradation or duplication issues

4. UI/UX Requirements
   Clean dashboard for HR users
   Responsive table for employee listing
   Filters and search controls for quick access
   Dedicated analytics section for salary insights
   Simple forms for employee creation and updates
   Loading states and error handling for better UX

5. Engineering & Quality Requirements
   Modular backend architecture (controllers, services, repositories)
   RESTful API design
   Unit tests for core business logic and analytics functions
   Fast and deterministic test suite
   Clear separation of concerns between UI, backend, and database layer
   Performance considerations for handling 10,000+ records efficiently

6. Optional Enhancements (If Time Permits)
   Add new employees with fields:
   Full Name
   Job Title
   Country
   Salary
   Department (optional but useful for segmentation)
   Email (unique identifier)
   Employment Status (Active/Inactive)
   Created At / Updated At timestamps

   Update existing employee details
   Delete employee records
   Caching for frequently accessed analytics queries
   Export employee data as CSV
   Role-based access (Admin vs HR viewer)
   Basic audit logs for employee changes
