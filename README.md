# Student Placement & Internship Portal (MERN Stack)

A full-stack College Placement and Internship Management Portal built with MongoDB, Express, React, and Node.js. 

The application implements strict REST architectural constraints (the React frontend never talks directly to the database) and demonstrates advanced MongoDB querying capabilities, CRUD operations, atomic counters, and multi-stage aggregation pipelines.

---

## 📋 Table of Contents
- [MongoDB Operators Grading Matrix](#-mongodb-operators-grading-matrix)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Setup & Installation](#-setup--installation)
- [API Route Documentation](#-api-route-documentation)
- [Demo Credentials](#-demo-credentials)
- [Project Structure](#-project-structure)

---

## 🎯 MongoDB Operators Grading Matrix

This project demonstrates **11 distinct MongoDB operators** across queries, updates, and aggregation pipelines:

| Operator | Type | Route / Function | Code Location | Grading Explanation |
|---|---|---|---|---|
| `$regex` | Evaluation Query | `GET /api/jobs` | `backend/controllers/jobController.js` | Performs case-insensitive (`$options: 'i'`) keyword search on job titles and locations. |
| `$in` | Comparison Query | `GET /api/jobs` | `backend/controllers/jobController.js` | Filters jobs whose `required_skills` match any skills specified by the candidate. |
| `$lte` | Comparison Query | `GET /api/jobs` | `backend/controllers/jobController.js` | Checks student eligibility by requiring `min_cgpa: { $lte: studentCgpa }`. |
| `$gte` | Comparison Query | `GET /api/jobs` | `backend/controllers/jobController.js` | Filters active postings where deadline is greater than or equal to current date. |
| `$or` | Logical Query | `GET /api/jobs` | `backend/controllers/jobController.js` | Combines target city location matches with remote job options (`{ $or: [ { location: regex }, { location: /remote/i } ] }`). |
| `$and` | Logical Query | `GET /api/jobs` | `backend/controllers/jobController.js` | Genuinely combines all above conditions (`status`, `keyword`, `skills`, `cgpa`, and `location`) into a unified compound query. |
| `$set` | Field Update | `PUT /api/applications/:id/status`, `PUT /api/auth/student/profile` | `backend/controllers/applicationController.js`, `backend/controllers/authController.js` | Updates application review stage (`Applied`, `Shortlisted`, `Interview`, `Selected`, `Rejected`) and timestamps. |
| `$inc` | Field Update | `POST /api/applications`, `DELETE /api/applications/:id` | `backend/controllers/applicationController.js` | Atomically increments (`+1`) and decrements (`-1`) the numeric `applicants_count` on the Job document. |
| `$match` | Aggregation Stage | `GET /api/company/analytics` | `backend/controllers/companyController.js` | Filters application records matching the authenticated company's job IDs. |
| `$lookup` | Aggregation Stage | `GET /api/company/analytics` | `backend/controllers/companyController.js` | Joins the `applications` collection with `students` to access academic attributes (CGPA). |
| `$group` | Aggregation Stage | `GET /api/company/analytics` | `backend/controllers/companyController.js` | Groups applications by `{ jobId, status }` or by company. |
| `$sum` | Aggregation Accumulator | `GET /api/company/analytics` | `backend/controllers/companyController.js` | Counts total applications per status and per job (`{ $sum: 1 }`). |
| `$avg` | Aggregation Accumulator | `GET /api/company/analytics` | `backend/controllers/companyController.js` | Computes average applicant CGPA across each job (`{ $avg: "$studentDetails.cgpa" }`). |

---

## 🛠 Architecture & Tech Stack

- **Frontend**: React (Hooks, Context API), React Router v6, Axios, Lucide Icons, Custom Modern CSS design system.
- **Backend**: Node.js, Express.js REST API with JWT role-based access control (`student` & `company`).
- **Database**: MongoDB with Mongoose ODM (local or Atlas instance).
- **Duplicate Prevention**: Compound Unique Index on `Application` schema `{ student_id: 1, job_id: 1 }` prevents duplicate student applications.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates mock companies, students, jobs, and applications
npm start        # Starts backend server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React development server on http://localhost:5173
```

---

## 📡 API Route Documentation

### 1. Authentication & Profiles (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/student/register` | Public | Register a new student |
| `POST` | `/api/auth/student/login` | Public | Login student, returns JWT token |
| `POST` | `/api/auth/company/register` | Public | Register a new company |
| `POST` | `/api/auth/company/login` | Public | Login company, returns JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |
| `PUT` | `/api/auth/student/profile` | Student | Update student profile skills, CGPA, resume (`$set`) |

### 2. Jobs (`/api/jobs`)
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | Search jobs combining `category`, `$and`, `$or`, `$in`, `$regex`, `$lte` |
| `GET` | `/api/jobs/:id` | Public | Get single job details with company info |
| `POST` | `/api/jobs` | Company | Post a new job or internship with category, skills, and eligibility |
| `PUT` | `/api/jobs/:id` | Company | Update job details (`$set`) |
| `DELETE` | `/api/jobs/:id` | Company | Delete a job and associated applications |
| `GET` | `/api/jobs/company/my-jobs` | Company | Fetch all jobs posted by the logged-in company |

### 3. Applications (`/api/applications`)
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications` | Student | Apply to job (atomic `$inc` on `applicants_count`, duplicate check) |
| `GET` | `/api/applications/my-applications` | Student | List applications submitted by current student |
| `GET` | `/api/applications/job/:jobId` | Company | List all applicants for a specific job |
| `PUT` | `/api/applications/:id/status` | Company | Update application status (`$set`: Applied/Shortlisted/Interview/Selected/Rejected) |
| `DELETE` | `/api/applications/:id` | Student | Withdraw application (atomic `$inc: -1` on `applicants_count`) |

### 4. Company Analytics Aggregation (`/api/company`)
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/company/analytics` | Company | Aggregation pipeline: `$match`, `$lookup`, `$unwind`, `$group`, `$sum`, `$avg` |

---

## 🔑 Demo Credentials

All seed accounts use the default password: **`password123`**

### Student Accounts
| Email | Name | Branch | CGPA | Skills |
|---|---|---|---|---|
| `aarav@student.edu` | Aarav Sharma | Computer Science | 8.85 | React, Node.js, MongoDB, TypeScript, Docker |
| `priya@student.edu` | Priya Patel | Information Technology | 9.12 | Python, Django, ML, SQL, Docker, FastAPI |
| `rohan@student.edu` | Rohan Verma | Electronics & Comm. | 7.60 | Java, Spring Boot, AWS, Microservices, PostgreSQL |
| `ananya@student.edu` | Ananya Iyer | AI & Machine Learning | 9.65 | Python, PyTorch, Computer Vision, C++, OpenCV |
| `kabir@student.edu` | Kabir Mehta | Cybersecurity | 8.40 | Network Security, Linux, Python, Wireshark, Cryptography |
| `diya@student.edu` | Diya Sengupta | Computer Science | 9.25 | Go, Kubernetes, Docker, Microservices, gRPC, AWS |
| `aditya@student.edu` | Aditya Rao | Electronics & Comm. | 6.85 | C, C++, Embedded Systems, IoT, Arduino, RTOS |
| `siddharth@student.edu` | Siddharth Nair | Robotics & Automation | 8.50 | ROS, C++, Python, SLAM, Robotics, Linux |

### Company Accounts
| Email | Company Name | Industry Focus |
|---|---|---|
| `recruiter@nexuscloud.io` | Nexus Cloud Innovations | Cloud Infrastructure & SaaS |
| `careers@finvibe.tech` | FinVibe Technologies | Algorithmic Trading & FinTech |
| `talent@datapulse.ai` | DataPulse AI | Applied Machine Learning & Generative AI |
| `jobs@cybershield.net` | CyberShield Defense | Cybersecurity & Zero-Trust Architecture |
| `campus@greengrid.org` | GreenGrid Energy | CleanTech, Smart Grids, Embedded IoT |
| `hr@healthstack.co` | HealthStack Solutions | HealthTech & Medical Data Platforms |
| `careers@apexrobotics.io` | Apex Robotics | Autonomous Mobile Robots & SLAM |
| `hiring@quantico.ai` | Quantico Analytics | Quantitative Finance & Big Data |
| `recruitment@stellargames.com` | Stellar Gaming Studios | AAA Game Engines & 3D Graphics |
| `talent@urbanmobility.in` | UrbanMobility Labs | Electric Vehicles & Telematics |

---

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Auth & $set profile logic
│   │   ├── jobController.js      # Job CRUD & complex query logic
│   │   ├── applicationController.js # Applications, duplicate check, $inc & $set
│   │   └── companyController.js  # $match, $lookup, $group, $sum, $avg pipeline
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role validation
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── Student.js
│   │   ├── Company.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── companyRoutes.js
│   ├── scripts/
│   │   ├── seed.js               # Database seeding script
│   │   └── verify_api.js         # Automated backend test suite
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/                     # React Single Page Application
└── README.md
```
