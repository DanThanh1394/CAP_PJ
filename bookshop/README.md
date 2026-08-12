# CAP Bookshop Management Service

## 1. Project Overview
This project is developed using **SAP Cloud Application Programming Model (CAP)**.

The purpose of this project is to create an **OData V4 service** for managing books, authors, and categories.

The system provides CRUD operations for three main entities:

- Books
- Authors
- Categories

The project demonstrates:

- Define data models using CDS
- Create relationships between entities
- Expose entities through CAP OData Service
- Test OData APIs using REST Client
- Perform CRUD operations with OData V4

---

## 2. Technology Stack

### Backend
- SAP Cloud Application Programming Model (CAP)
- Node.js
- CDS (Core Data Services)
- OData V4

### Database
- SQLite Database

---

## 3. Project Structure

File or Folder | Purpose
---------|----------
`db/` | Domain models (`schema.cds`) and sample data (`.csv`)
`srv/` | Service definitions (`cat-service.cds`)
`package.json` | Project configuration, dependencies, CAP settings
`test.http` | Sample HTTP requests to test OData APIs
`db.sqlite` | Local SQLite database with generated data
`README.md` | Project documentation

---

## 4. Entities

### Books
- `ID` (Integer, key)
- `title` (localized String)
- `descr` (localized String)
- `stock` (Integer)
- `price` (Decimal)
- `currency` (Currency from `@sap/cds/common`)
- `category` (Association to Categories)
- `authors` (Association to Authors)

### Authors
- `ID` (Integer, key)
- `name` (String)

### Categories
- `ID` (Integer, key)
- `name` (String)

---

## 5. Relationships

- **Books → Authors**: One author can write many books (`Books.authors → Authors.ID`)
- **Books → Categories**: One category can contain many books (`Books.category → Categories.ID`)

---

## 6. Exposed OData Service

Service `AdminService` exposes the following entities via OData V4:

- `/odata/v4/admin/Books`
- `/odata/v4/admin/Authors`
- `/odata/v4/admin/Categories`

---

## 7. Sample APIs

### Retrieve all records
