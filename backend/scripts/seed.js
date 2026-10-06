const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_portal';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB:', mongoUri);

    // Clear existing collections
    await Application.deleteMany({});
    await Job.deleteMany({});
    await Student.deleteMany({});
    await Company.deleteMany({});
    console.log('[Seed] Cleared existing data');

    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(defaultPassword, salt);

    // ==========================================
    // 1. CREATE 10 DIVERSE COMPANIES
    // ==========================================
    const companies = await Company.create([
      {
        name: 'Nexus Cloud Innovations',
        email: 'recruiter@nexuscloud.io',
        password_hash,
        description: 'Global enterprise cloud computing, Kubernetes platforms, and distributed SaaS infrastructure.',
        website: 'https://nexuscloud.io',
      },
      {
        name: 'FinVibe Technologies',
        email: 'careers@finvibe.tech',
        password_hash,
        description: 'Next-generation payment gateways, digital banking APIs, and algorithmic trading systems.',
        website: 'https://finvibe.tech',
      },
      {
        name: 'DataPulse AI',
        email: 'talent@datapulse.ai',
        password_hash,
        description: 'Pioneering multimodal AI, large language models, computer vision, and real-time inference engines.',
        website: 'https://datapulse.ai',
      },
      {
        name: 'CyberShield Defense',
        email: 'jobs@cybershield.net',
        password_hash,
        description: 'Enterprise zero-trust cybersecurity, threat intelligence, penetration testing, and cloud security posture.',
        website: 'https://cybershield.net',
      },
      {
        name: 'GreenGrid Energy',
        email: 'campus@greengrid.org',
        password_hash,
        description: 'Clean energy transition platforms, smart power distribution, and battery management IoT software.',
        website: 'https://greengrid.org',
      },
      {
        name: 'HealthStack Solutions',
        email: 'hr@healthstack.co',
        password_hash,
        description: 'AI-assisted medical diagnostics, electronic health record interoperability, and telehealth apps.',
        website: 'https://healthstack.co',
      },
      {
        name: 'Apex Robotics',
        email: 'careers@apexrobotics.io',
        password_hash,
        description: 'Autonomous mobile robots (AMRs), warehouse automation, and SLAM navigation platforms.',
        website: 'https://apexrobotics.io',
      },
      {
        name: 'Quantico Analytics',
        email: 'hiring@quantico.ai',
        password_hash,
        description: 'Quantitative analytics, mathematical optimization, risk modeling, and distributed real-time data pipelines.',
        website: 'https://quantico.ai',
      },
      {
        name: 'Stellar Gaming Studios',
        email: 'recruitment@stellargames.com',
        password_hash,
        description: 'AAA game development studio building immersive open-world multiplayer games using modern C++ and Unreal Engine 5.',
        website: 'https://stellargames.com',
      },
      {
        name: 'UrbanMobility Labs',
        email: 'talent@urbanmobility.in',
        password_hash,
        description: 'Smart electric mobility solutions, connected vehicle telemetry, and urban battery swapping networks.',
        website: 'https://urbanmobility.in',
      },
    ]);
    console.log(`[Seed] Created ${companies.length} diverse companies`);

    // ==========================================
    // 2. CREATE 16 DIVERSE STUDENTS
    // ==========================================
    const students = await Student.create([
      {
        name: 'Aarav Sharma',
        email: 'aarav@student.edu',
        password_hash,
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript', 'Docker'],
        branch: 'Computer Science and Engineering',
        cgpa: 8.85,
        resume_url: 'https://aarav-portfolio.dev/resume.pdf',
      },
      {
        name: 'Priya Patel',
        email: 'priya@student.edu',
        password_hash,
        skills: ['Python', 'Django', 'Machine Learning', 'SQL', 'Docker', 'FastAPI'],
        branch: 'Information Technology',
        cgpa: 9.12,
        resume_url: 'https://priyapatel.dev/resume.pdf',
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@student.edu',
        password_hash,
        skills: ['Java', 'Spring Boot', 'AWS', 'Microservices', 'PostgreSQL', 'Kafka'],
        branch: 'Electronics & Communication',
        cgpa: 7.60,
        resume_url: 'https://rohanverma.me/cv.pdf',
      },
      {
        name: 'Sneha Kulkarni',
        email: 'sneha@student.edu',
        password_hash,
        skills: ['React', 'Next.js', 'TailwindCSS', 'GraphQL', 'Node.js', 'TypeScript'],
        branch: 'Computer Science and Engineering',
        cgpa: 8.20,
        resume_url: 'https://sneha-k.dev/resume.pdf',
      },
      {
        name: 'Vikram Joshi',
        email: 'vikram@student.edu',
        password_hash,
        skills: ['Python', 'Data Analytics', 'Pandas', 'PowerBI', 'SQL', 'Tableau'],
        branch: 'Data Science',
        cgpa: 7.15,
        resume_url: 'https://vikram-analytics.dev/resume.pdf',
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@student.edu',
        password_hash,
        skills: ['Python', 'PyTorch', 'Computer Vision', 'Deep Learning', 'C++', 'OpenCV'],
        branch: 'Artificial Intelligence & Machine Learning',
        cgpa: 9.65,
        resume_url: 'https://ananya-ai.me/resume.pdf',
      },
      {
        name: 'Kabir Mehta',
        email: 'kabir@student.edu',
        password_hash,
        skills: ['Network Security', 'Linux', 'Python', 'Wireshark', 'Cryptography', 'Docker'],
        branch: 'Cybersecurity',
        cgpa: 8.40,
        resume_url: 'https://kabirmehta.security/cv.pdf',
      },
      {
        name: 'Diya Sengupta',
        email: 'diya@student.edu',
        password_hash,
        skills: ['Go', 'Kubernetes', 'Docker', 'Microservices', 'gRPC', 'Linux', 'AWS'],
        branch: 'Computer Science and Engineering',
        cgpa: 9.25,
        resume_url: 'https://diya-cloud.dev/resume.pdf',
      },
      {
        name: 'Aditya Rao',
        email: 'aditya@student.edu',
        password_hash,
        skills: ['C', 'C++', 'Embedded Systems', 'IoT', 'Arduino', 'RTOS', 'Linux'],
        branch: 'Electronics & Communication',
        cgpa: 6.85,
        resume_url: 'https://adityarao-embedded.dev/resume.pdf',
      },
      {
        name: 'Meera Nambiar',
        email: 'meera@student.edu',
        password_hash,
        skills: ['Java', 'Spring Boot', 'SQL', 'Hibernate', 'AWS', 'PostgreSQL'],
        branch: 'Information Technology',
        cgpa: 8.90,
        resume_url: 'https://meeranambiar.dev/cv.pdf',
      },
      {
        name: 'Siddharth Nair',
        email: 'siddharth@student.edu',
        password_hash,
        skills: ['ROS', 'C++', 'Python', 'SLAM', 'Robotics', 'Linux'],
        branch: 'Robotics & Automation',
        cgpa: 8.50,
        resume_url: 'https://siddharth-robotics.org/resume.pdf',
      },
      {
        name: 'Kavya Reddy',
        email: 'kavya@student.edu',
        password_hash,
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
        branch: 'Computer Science and Engineering',
        cgpa: 8.75,
        resume_url: 'https://kavyareddy.dev/resume.pdf',
      },
      {
        name: 'Arjun Malhotra',
        email: 'arjun@student.edu',
        password_hash,
        skills: ['Python', 'SQL', 'Financial Modeling', 'Pandas', 'Statistics', 'Flask'],
        branch: 'Data Science',
        cgpa: 8.10,
        resume_url: 'https://arjun-quant.dev/resume.pdf',
      },
      {
        name: 'Ishita Bansal',
        email: 'ishita@student.edu',
        password_hash,
        skills: ['Flutter', 'React Native', 'Mobile', 'Dart', 'Firebase', 'JavaScript'],
        branch: 'Information Technology',
        cgpa: 7.80,
        resume_url: 'https://ishitabansal.dev/resume.pdf',
      },
      {
        name: 'Varun Desai',
        email: 'varun@student.edu',
        password_hash,
        skills: ['C++', 'OpenGL', 'Unity', '3D Math', 'C#', 'Game Design'],
        branch: 'Computer Science and Engineering',
        cgpa: 7.40,
        resume_url: 'https://varundesai-games.dev/portfolio.pdf',
      },
      {
        name: 'Tanvi Hegde',
        email: 'tanvi@student.edu',
        password_hash,
        skills: ['HTML', 'CSS', 'JavaScript', 'SQL', 'Python', 'Git'],
        branch: 'Mechanical Engineering',
        cgpa: 6.50,
        resume_url: 'https://tanvihegde.me/resume.pdf',
      },
    ]);
    console.log(`[Seed] Created ${students.length} diverse students`);

    // ==========================================
    // 3. CREATE 41 DIVERSE JOBS ACROSS CATEGORIES
    // ==========================================
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const jobs = await Job.create([
      // --- 1. Nexus Cloud Innovations ---
      {
        company_id: companies[0]._id,
        title: 'Full Stack Web Developer',
        category: 'Software Engineering',
        type: 'job',
        required_skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        min_cgpa: 7.5,
        location: 'Bangalore',
        stipend_or_salary: '₹14,00,000 / annum',
        deadline: new Date(now + 35 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[0]._id,
        title: 'Cloud DevOps Intern',
        category: 'Cloud Computing & DevOps',
        type: 'internship',
        required_skills: ['AWS', 'Docker', 'Linux', 'Python'],
        min_cgpa: 7.0,
        location: 'Remote',
        stipend_or_salary: '₹40,000 / month',
        deadline: new Date(now + 25 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[0]._id,
        title: 'Site Reliability & Platform Engineer',
        category: 'Cloud Computing & DevOps',
        type: 'job',
        required_skills: ['Go', 'Kubernetes', 'Docker', 'Linux'],
        min_cgpa: 8.0,
        location: 'Bangalore',
        stipend_or_salary: '₹18,50,000 / annum',
        deadline: new Date(now + 40 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[0]._id,
        title: 'Distributed Systems Architect',
        category: 'Cloud Computing & DevOps',
        type: 'job',
        required_skills: ['Go', 'gRPC', 'Distributed Systems', 'Kafka'],
        min_cgpa: 8.5,
        location: 'Hyderabad',
        stipend_or_salary: '₹24,00,000 / annum',
        deadline: new Date(now + 50 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[0]._id,
        title: 'Frontend UI/UX Systems Intern',
        category: 'UI/UX & Frontend Engineering',
        type: 'internship',
        required_skills: ['React', 'TailwindCSS', 'TypeScript', 'Figma'],
        min_cgpa: 6.8,
        location: 'Remote',
        stipend_or_salary: '₹35,000 / month',
        deadline: new Date(now + 20 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 2. FinVibe Technologies ---
      {
        company_id: companies[1]._id,
        title: 'Backend Software Engineer',
        category: 'Software Engineering',
        type: 'job',
        required_skills: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
        min_cgpa: 7.5,
        location: 'Hyderabad',
        stipend_or_salary: '₹16,50,000 / annum',
        deadline: new Date(now + 30 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[1]._id,
        title: 'Frontend Engineering Intern',
        category: 'UI/UX & Frontend Engineering',
        type: 'internship',
        required_skills: ['React', 'JavaScript', 'HTML', 'CSS'],
        min_cgpa: 7.0,
        location: 'Remote',
        stipend_or_salary: '₹35,000 / month',
        deadline: new Date(now + 18 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[1]._id,
        title: 'High-Frequency Trading Systems Dev',
        category: 'Quantitative Finance',
        type: 'job',
        required_skills: ['C++', 'Linux', 'Multithreading', 'Low Latency'],
        min_cgpa: 8.5,
        location: 'Mumbai',
        stipend_or_salary: '₹28,00,000 / annum',
        deadline: new Date(now + 28 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[1]._id,
        title: 'Payment Gateway Security Specialist',
        category: 'Cybersecurity',
        type: 'job',
        required_skills: ['Cryptography', 'OWASP', 'Network Security', 'Java'],
        min_cgpa: 7.8,
        location: 'Pune',
        stipend_or_salary: '₹17,00,000 / annum',
        deadline: new Date(now + 32 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[1]._id,
        title: 'Algorithmic Trading Analyst Intern',
        category: 'Quantitative Finance',
        type: 'internship',
        required_skills: ['Python', 'Pandas', 'Statistics', 'Financial Modeling'],
        min_cgpa: 8.2,
        location: 'Mumbai',
        stipend_or_salary: '₹55,000 / month',
        deadline: new Date(now + 22 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 3. DataPulse AI ---
      {
        company_id: companies[2]._id,
        title: 'Machine Learning Research Intern',
        category: 'Artificial Intelligence & ML',
        type: 'internship',
        required_skills: ['Python', 'Machine Learning', 'SQL', 'Docker'],
        min_cgpa: 8.0,
        location: 'Pune',
        stipend_or_salary: '₹50,000 / month',
        deadline: new Date(now + 22 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[2]._id,
        title: 'Computer Vision Engineer',
        category: 'Artificial Intelligence & ML',
        type: 'job',
        required_skills: ['Python', 'PyTorch', 'Computer Vision', 'OpenCV'],
        min_cgpa: 8.2,
        location: 'Bangalore',
        stipend_or_salary: '₹21,00,000 / annum',
        deadline: new Date(now + 45 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[2]._id,
        title: 'Generative AI & LLM Systems Engineer',
        category: 'Artificial Intelligence & ML',
        type: 'job',
        required_skills: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
        min_cgpa: 8.5,
        location: 'Remote',
        stipend_or_salary: '₹25,00,000 / annum',
        deadline: new Date(now + 38 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[2]._id,
        title: 'Data Science & MLOps Intern',
        category: 'Data Science & Analytics',
        type: 'internship',
        required_skills: ['Python', 'Docker', 'AWS', 'SQL', 'Pandas'],
        min_cgpa: 7.5,
        location: 'Hyderabad',
        stipend_or_salary: '₹45,000 / month',
        deadline: new Date(now + 26 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[2]._id,
        title: 'Speech & Audio AI Researcher',
        category: 'Artificial Intelligence & ML',
        type: 'job',
        required_skills: ['Python', 'PyTorch', 'Signal Processing', 'Deep Learning'],
        min_cgpa: 8.3,
        location: 'Bangalore',
        stipend_or_salary: '₹22,50,000 / annum',
        deadline: new Date(now + 40 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 4. CyberShield Defense ---
      {
        company_id: companies[3]._id,
        title: 'Cybersecurity SOC Analyst',
        category: 'Cybersecurity',
        type: 'job',
        required_skills: ['Network Security', 'Linux', 'Wireshark', 'Python'],
        min_cgpa: 6.8,
        location: 'Gurgaon',
        stipend_or_salary: '₹9,50,000 / annum',
        deadline: new Date(now + 30 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[3]._id,
        title: 'Application Security Intern',
        category: 'Cybersecurity',
        type: 'internship',
        required_skills: ['Network Security', 'Python', 'Linux', 'Cryptography'],
        min_cgpa: 7.0,
        location: 'Remote',
        stipend_or_salary: '₹32,000 / month',
        deadline: new Date(now + 15 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[3]._id,
        title: 'Cloud Infrastructure Pentester',
        category: 'Cybersecurity',
        type: 'job',
        required_skills: ['Network Security', 'AWS', 'Linux', 'Python'],
        min_cgpa: 7.5,
        location: 'Noida',
        stipend_or_salary: '₹16,00,000 / annum',
        deadline: new Date(now + 36 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[3]._id,
        title: 'Malware Reverse Engineering Analyst',
        category: 'Cybersecurity',
        type: 'job',
        required_skills: ['C++', 'Linux', 'Network Security', 'Assembly'],
        min_cgpa: 8.0,
        location: 'Bangalore',
        stipend_or_salary: '₹19,00,000 / annum',
        deadline: new Date(now + 42 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 5. GreenGrid Energy ---
      {
        company_id: companies[4]._id,
        title: 'Embedded Firmware Engineer',
        category: 'Embedded Systems & IoT',
        type: 'job',
        required_skills: ['C', 'C++', 'Embedded Systems', 'RTOS', 'Linux'],
        min_cgpa: 6.5,
        location: 'Chennai',
        stipend_or_salary: '₹11,00,000 / annum',
        deadline: new Date(now + 28 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[4]._id,
        title: 'IoT & Smart Grid Intern',
        category: 'Embedded Systems & IoT',
        type: 'internship',
        required_skills: ['IoT', 'Python', 'Arduino', 'C++'],
        min_cgpa: 6.0,
        location: 'Bangalore',
        stipend_or_salary: '₹26,000 / month',
        deadline: new Date(now + 20 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[4]._id,
        title: 'Battery Management Systems (BMS) Dev',
        category: 'Embedded Systems & IoT',
        type: 'job',
        required_skills: ['C', 'C++', 'Embedded Systems', 'MATLAB'],
        min_cgpa: 7.2,
        location: 'Pune',
        stipend_or_salary: '₹14,00,000 / annum',
        deadline: new Date(now + 38 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[4]._id,
        title: 'CleanTech Data Analyst',
        category: 'Data Science & Analytics',
        type: 'job',
        required_skills: ['Python', 'SQL', 'PowerBI', 'Tableau', 'Pandas'],
        min_cgpa: 7.0,
        location: 'Remote',
        stipend_or_salary: '₹12,00,000 / annum',
        deadline: new Date(now + 25 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 6. HealthStack Solutions ---
      {
        company_id: companies[5]._id,
        title: 'Healthcare Platform Full Stack Engineer',
        category: 'Software Engineering',
        type: 'job',
        required_skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        min_cgpa: 7.2,
        location: 'Hyderabad',
        stipend_or_salary: '₹13,50,000 / annum',
        deadline: new Date(now + 35 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[5]._id,
        title: 'Clinical Data Analytics Intern',
        category: 'Data Science & Analytics',
        type: 'internship',
        required_skills: ['Python', 'SQL', 'Data Analytics', 'Pandas'],
        min_cgpa: 7.0,
        location: 'Remote',
        stipend_or_salary: '₹34,000 / month',
        deadline: new Date(now + 19 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[5]._id,
        title: 'Biomedical Image Processing Engineer',
        category: 'Artificial Intelligence & ML',
        type: 'job',
        required_skills: ['Python', 'Computer Vision', 'Deep Learning', 'PyTorch'],
        min_cgpa: 8.0,
        location: 'Bangalore',
        stipend_or_salary: '₹18,00,000 / annum',
        deadline: new Date(now + 44 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 7. Apex Robotics ---
      {
        company_id: companies[6]._id,
        title: 'Autonomous Navigation Robotics Intern',
        category: 'Robotics & Automation',
        type: 'internship',
        required_skills: ['ROS', 'C++', 'Python', 'SLAM', 'Robotics'],
        min_cgpa: 8.0,
        location: 'Bangalore',
        stipend_or_salary: '₹48,000 / month',
        deadline: new Date(now + 26 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[6]._id,
        title: 'Robotics Control Systems Engineer',
        category: 'Robotics & Automation',
        type: 'job',
        required_skills: ['C++', 'ROS', 'Python', 'Linux'],
        min_cgpa: 8.2,
        location: 'Pune',
        stipend_or_salary: '₹19,00,000 / annum',
        deadline: new Date(now + 42 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[6]._id,
        title: 'Perception & Sensor Fusion Engineer',
        category: 'Robotics & Automation',
        type: 'job',
        required_skills: ['C++', 'ROS', 'Computer Vision', 'Python'],
        min_cgpa: 8.5,
        location: 'Bangalore',
        stipend_or_salary: '₹22,00,000 / annum',
        deadline: new Date(now + 48 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[6]._id,
        title: 'Robot Simulation & Gazebo Intern',
        category: 'Robotics & Automation',
        type: 'internship',
        required_skills: ['ROS', 'Python', 'C++', 'Linux'],
        min_cgpa: 7.2,
        location: 'Remote',
        stipend_or_salary: '₹38,000 / month',
        deadline: new Date(now + 21 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 8. Quantico Analytics ---
      {
        company_id: companies[7]._id,
        title: 'Quantitative Research Analyst',
        category: 'Quantitative Finance',
        type: 'job',
        required_skills: ['Python', 'SQL', 'Financial Modeling', 'Statistics'],
        min_cgpa: 8.5,
        location: 'Mumbai',
        stipend_or_salary: '₹26,00,000 / annum',
        deadline: new Date(now + 32 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[7]._id,
        title: 'Big Data Pipeline Engineering Intern',
        category: 'Data Science & Analytics',
        type: 'internship',
        required_skills: ['Python', 'SQL', 'Kafka', 'Docker'],
        min_cgpa: 7.5,
        location: 'Gurgaon',
        stipend_or_salary: '₹42,000 / month',
        deadline: new Date(now + 21 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[7]._id,
        title: 'Risk Modeling & Econometrics Specialist',
        category: 'Quantitative Finance',
        type: 'job',
        required_skills: ['Python', 'Statistics', 'Pandas', 'SQL'],
        min_cgpa: 8.2,
        location: 'Mumbai',
        stipend_or_salary: '₹23,00,000 / annum',
        deadline: new Date(now + 36 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 9. Stellar Gaming Studios ---
      {
        company_id: companies[8]._id,
        title: 'Game Engine Software Engineer',
        category: 'Game Development',
        type: 'job',
        required_skills: ['C++', '3D Math', 'Linux', 'OpenGL'],
        min_cgpa: 7.0,
        location: 'Noida',
        stipend_or_salary: '₹15,00,000 / annum',
        deadline: new Date(now + 35 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[8]._id,
        title: 'Gameplay Mechanics Intern',
        category: 'Game Development',
        type: 'internship',
        required_skills: ['C++', 'Unity', 'Game Design'],
        min_cgpa: 6.5,
        location: 'Remote',
        stipend_or_salary: '₹30,000 / month',
        deadline: new Date(now + 17 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[8]._id,
        title: 'Graphics & Shader Programmer',
        category: 'Game Development',
        type: 'job',
        required_skills: ['C++', '3D Math', 'OpenGL'],
        min_cgpa: 7.5,
        location: 'Bangalore',
        stipend_or_salary: '₹18,00,000 / annum',
        deadline: new Date(now + 40 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[8]._id,
        title: 'Multiplayer Network Programmer',
        category: 'Game Development',
        type: 'job',
        required_skills: ['C++', 'Linux', 'Docker'],
        min_cgpa: 7.2,
        location: 'Noida',
        stipend_or_salary: '₹16,50,000 / annum',
        deadline: new Date(now + 34 * day),
        status: 'open',
        applicants_count: 0,
      },

      // --- 10. UrbanMobility Labs ---
      {
        company_id: companies[9]._id,
        title: 'Mobile App Development Intern',
        category: 'Mobile App Development',
        type: 'internship',
        required_skills: ['Flutter', 'React Native', 'Mobile', 'JavaScript'],
        min_cgpa: 6.8,
        location: 'Remote',
        stipend_or_salary: '₹36,000 / month',
        deadline: new Date(now + 24 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[9]._id,
        title: 'EV Telematics Cloud Architect',
        category: 'Cloud Computing & DevOps',
        type: 'job',
        required_skills: ['AWS', 'Python', 'IoT', 'Docker'],
        min_cgpa: 7.5,
        location: 'Pune',
        stipend_or_salary: '₹17,50,000 / annum',
        deadline: new Date(now + 45 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[9]._id,
        title: 'Android Automotive OS (AAOS) Engineer',
        category: 'Mobile App Development',
        type: 'job',
        required_skills: ['Java', 'Linux', 'Mobile'],
        min_cgpa: 7.2,
        location: 'Bangalore',
        stipend_or_salary: '₹16,00,000 / annum',
        deadline: new Date(now + 36 * day),
        status: 'open',
        applicants_count: 0,
      },
      {
        company_id: companies[9]._id,
        title: 'Battery Health Machine Learning Engineer',
        category: 'Data Science & Analytics',
        type: 'job',
        required_skills: ['Python', 'Machine Learning', 'Pandas', 'SQL'],
        min_cgpa: 7.6,
        location: 'Chennai',
        stipend_or_salary: '₹15,00,000 / annum',
        deadline: new Date(now + 33 * day),
        status: 'open',
        applicants_count: 0,
      },
    ]);
    console.log(`[Seed] Created ${jobs.length} diverse jobs across 10 categories`);

    // ==========================================
    // 4. CREATE DIVERSE APPLICATIONS
    // ==========================================
    const applicationsData = [
      // Nexus Cloud
      { student_id: students[0]._id, job_id: jobs[0]._id, status: 'Shortlisted', daysAgo: 7 },
      { student_id: students[3]._id, job_id: jobs[0]._id, status: 'Interview', daysAgo: 5 },
      { student_id: students[11]._id, job_id: jobs[0]._id, status: 'Selected', daysAgo: 4 },
      { student_id: students[2]._id, job_id: jobs[0]._id, status: 'Applied', daysAgo: 2 },
      { student_id: students[1]._id, job_id: jobs[1]._id, status: 'Selected', daysAgo: 8 },
      { student_id: students[7]._id, job_id: jobs[1]._id, status: 'Interview', daysAgo: 4 },
      { student_id: students[2]._id, job_id: jobs[1]._id, status: 'Shortlisted', daysAgo: 3 },
      { student_id: students[4]._id, job_id: jobs[1]._id, status: 'Applied', daysAgo: 1 },
      { student_id: students[7]._id, job_id: jobs[2]._id, status: 'Shortlisted', daysAgo: 6 },
      { student_id: students[0]._id, job_id: jobs[2]._id, status: 'Applied', daysAgo: 2 },

      // FinVibe
      { student_id: students[2]._id, job_id: jobs[5]._id, status: 'Interview', daysAgo: 6 },
      { student_id: students[9]._id, job_id: jobs[5]._id, status: 'Selected', daysAgo: 5 },
      { student_id: students[0]._id, job_id: jobs[5]._id, status: 'Applied', daysAgo: 1 },
      { student_id: students[3]._id, job_id: jobs[6]._id, status: 'Selected', daysAgo: 9 },
      { student_id: students[11]._id, job_id: jobs[6]._id, status: 'Interview', daysAgo: 3 },
      { student_id: students[14]._id, job_id: jobs[6]._id, status: 'Applied', daysAgo: 2 },
      { student_id: students[5]._id, job_id: jobs[7]._id, status: 'Interview', daysAgo: 4 },
      { student_id: students[12]._id, job_id: jobs[7]._id, status: 'Shortlisted', daysAgo: 3 },

      // DataPulse AI
      { student_id: students[1]._id, job_id: jobs[10]._id, status: 'Interview', daysAgo: 5 },
      { student_id: students[5]._id, job_id: jobs[10]._id, status: 'Selected', daysAgo: 6 },
      { student_id: students[4]._id, job_id: jobs[10]._id, status: 'Applied', daysAgo: 2 },
      { student_id: students[5]._id, job_id: jobs[11]._id, status: 'Shortlisted', daysAgo: 7 },
      { student_id: students[1]._id, job_id: jobs[11]._id, status: 'Applied', daysAgo: 1 },
      { student_id: students[5]._id, job_id: jobs[12]._id, status: 'Selected', daysAgo: 6 },
      { student_id: students[7]._id, job_id: jobs[12]._id, status: 'Interview', daysAgo: 2 },

      // CyberShield Defense
      { student_id: students[6]._id, job_id: jobs[15]._id, status: 'Selected', daysAgo: 6 },
      { student_id: students[8]._id, job_id: jobs[15]._id, status: 'Interview', daysAgo: 3 },
      { student_id: students[6]._id, job_id: jobs[16]._id, status: 'Shortlisted', daysAgo: 4 },
      { student_id: students[4]._id, job_id: jobs[16]._id, status: 'Applied', daysAgo: 1 },
      { student_id: students[6]._id, job_id: jobs[17]._id, status: 'Interview', daysAgo: 3 },

      // GreenGrid Energy
      { student_id: students[8]._id, job_id: jobs[19]._id, status: 'Interview', daysAgo: 5 },
      { student_id: students[10]._id, job_id: jobs[19]._id, status: 'Applied', daysAgo: 2 },
      { student_id: students[8]._id, job_id: jobs[20]._id, status: 'Selected', daysAgo: 4 },
      { student_id: students[15]._id, job_id: jobs[20]._id, status: 'Applied', daysAgo: 1 },

      // HealthStack Solutions
      { student_id: students[0]._id, job_id: jobs[23]._id, status: 'Interview', daysAgo: 4 },
      { student_id: students[9]._id, job_id: jobs[23]._id, status: 'Applied', daysAgo: 1 },
      { student_id: students[4]._id, job_id: jobs[24]._id, status: 'Selected', daysAgo: 5 },
      { student_id: students[1]._id, job_id: jobs[25]._id, status: 'Shortlisted', daysAgo: 3 },

      // Apex Robotics
      { student_id: students[10]._id, job_id: jobs[26]._id, status: 'Selected', daysAgo: 7 },
      { student_id: students[8]._id, job_id: jobs[26]._id, status: 'Shortlisted', daysAgo: 3 },
      { student_id: students[10]._id, job_id: jobs[27]._id, status: 'Interview', daysAgo: 4 },
      { student_id: students[5]._id, job_id: jobs[28]._id, status: 'Selected', daysAgo: 6 },

      // Quantico Analytics
      { student_id: students[12]._id, job_id: jobs[30]._id, status: 'Interview', daysAgo: 5 },
      { student_id: students[1]._id, job_id: jobs[30]._id, status: 'Shortlisted', daysAgo: 2 },
      { student_id: students[4]._id, job_id: jobs[31]._id, status: 'Selected', daysAgo: 6 },
      { student_id: students[12]._id, job_id: jobs[32]._id, status: 'Applied', daysAgo: 2 },

      // Stellar Gaming
      { student_id: students[14]._id, job_id: jobs[33]._id, status: 'Interview', daysAgo: 4 },
      { student_id: students[14]._id, job_id: jobs[34]._id, status: 'Selected', daysAgo: 5 },
      { student_id: students[14]._id, job_id: jobs[35]._id, status: 'Applied', daysAgo: 1 },

      // UrbanMobility
      { student_id: students[13]._id, job_id: jobs[37]._id, status: 'Selected', daysAgo: 5 },
      { student_id: students[11]._id, job_id: jobs[37]._id, status: 'Applied', daysAgo: 2 },
      { student_id: students[7]._id, job_id: jobs[38]._id, status: 'Shortlisted', daysAgo: 3 },
      { student_id: students[13]._id, job_id: jobs[39]._id, status: 'Interview', daysAgo: 2 },
      { student_id: students[4]._id, job_id: jobs[40]._id, status: 'Applied', daysAgo: 1 },
    ];

    const createdApplications = [];
    for (const app of applicationsData) {
      const createdApp = await Application.create({
        student_id: app.student_id,
        job_id: app.job_id,
        status: app.status,
        applied_on: new Date(now - app.daysAgo * day),
        updated_on: new Date(now - Math.max(0, app.daysAgo - 1) * day),
      });
      createdApplications.push(createdApp);
    }
    console.log(`[Seed] Created ${createdApplications.length} diverse applications across all stages`);

    // ==========================================
    // 5. UPDATE applicants_count ON JOBS VIA $inc
    // ==========================================
    for (const app of createdApplications) {
      await Job.findByIdAndUpdate(app.job_id, { $inc: { applicants_count: 1 } });
    }
    console.log('[Seed] Synchronized all job applicants_count counters using MongoDB $inc operator');

    console.log('\n=============================================================');
    console.log('       EXPANDED DIVERSE DATABASE SEED COMPLETED              ');
    console.log('=============================================================');
    console.log(`Companies:    ${companies.length} distinct companies across 10 sectors`);
    console.log(`Students:     ${students.length} students with CGPAs from 6.50 to 9.65`);
    console.log(`Jobs:         ${jobs.length} postings across 10 categories and 8 locations`);
    console.log(`Applications: ${createdApplications.length} records in Applied, Shortlisted, Interview, Selected`);
    console.log('All passwords: password123\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedData();
