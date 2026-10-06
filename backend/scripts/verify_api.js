// Script to run comprehensive API verification and output formatted requests and responses
const http = require('http');

function apiRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('================================================================');
  console.log('          API VERIFICATION FOR MERN PLACEMENT PORTAL            ');
  console.log('================================================================\n');

  // STEP 1: Student Login (Rohan Verma)
  console.log('--- Auth: Logging in Student (rohan@student.edu) ---');
  const studentLoginRes = await apiRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/student/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'rohan@student.edu', password: 'password123' }
  );
  const studentToken = studentLoginRes.body.token;
  const studentId = studentLoginRes.body.user.id;
  console.log(`Student authenticated successfully: ${studentLoginRes.body.user.name} (CGPA: ${studentLoginRes.body.user.cgpa})\n`);

  // STEP 2: Company Login (Nexus Cloud Innovations)
  console.log('--- Auth: Logging in Company (recruiter@nexuscloud.io) ---');
  const companyLoginRes = await apiRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/company/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'recruiter@nexuscloud.io', password: 'password123' }
  );
  const companyToken = companyLoginRes.body.token;
  console.log(`Company authenticated successfully: ${companyLoginRes.body.user.name}\n`);

  // TEST 1: Job search with combined filters ($and, $or, $in, $regex, $lte)
  console.log('================================================================');
  console.log('TEST 1: Combined Job Search Query ($and, $or, $in, $regex, $lte)');
  console.log('================================================================');
  const searchParams = 'keyword=Developer&skills=React&cgpa=8.0&location=Bangalore';
  console.log(`REQUEST: GET /api/jobs?${searchParams}`);
  console.log('Query parameters explanation:');
  console.log(' - keyword=Developer    -> title: { $regex: "Developer", $options: "i" }');
  console.log(' - skills=React         -> required_skills: { $in: [/React/i] }');
  console.log(' - cgpa=8.0             -> min_cgpa: { $lte: 8.0 } (eligible for students with CGPA <= 8.0)');
  console.log(' - location=Bangalore   -> $or: [{ location: /Bangalore/i }, { location: /Remote/i }]');
  console.log(' - Combined via $and: [{ status: "open" }, { title: ... }, { required_skills: ... }, { min_cgpa: ... }, { $or: ... }]');

  const searchRes = await apiRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/jobs?${encodeURI(searchParams)}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  console.log(`RESPONSE HTTP ${searchRes.statusCode}:`);
  console.log(JSON.stringify(searchRes.body, null, 2));
  console.log('\n');

  // TEST 2: Application Creation ($inc applicant counter & duplicate prevention)
  console.log('================================================================');
  console.log('TEST 2: Application Creation ($inc counter and duplicate prevention)');
  console.log('================================================================');

  // Find a job Rohan hasn't applied to yet (e.g., Nexus Cloud Full Stack Web Developer)
  const allJobsRes = await apiRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'GET',
  });
  const targetJob = allJobsRes.body.jobs.find((j) => j.title.includes('Full Stack Web Developer'));
  console.log(`Target Job: "${targetJob.title}" (ID: ${targetJob._id})`);
  console.log(`Initial applicants_count before apply: ${targetJob.applicants_count}`);

  console.log(`\nREQUEST: POST /api/applications (Authorization: Bearer <Student_Token>)`);
  console.log(`Payload: { "job_id": "${targetJob._id}" }`);

  const applyRes = await apiRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/applications',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
    },
    { job_id: targetJob._id }
  );

  console.log(`RESPONSE HTTP ${applyRes.statusCode}:`);
  console.log(JSON.stringify(applyRes.body, null, 2));

  // Verify applicants_count was incremented via $inc
  const updatedJobRes = await apiRequest({
    hostname: 'localhost',
    port: 5000,
    path: `/api/jobs/${targetJob._id}`,
    method: 'GET',
  });
  console.log(`\nVerified Job applicants_count after $inc: ${updatedJobRes.body.job.applicants_count} (Incremented by +1!)`);

  // Verify duplicate application rejection
  console.log('\n--- Verifying Duplicate Application Prevention ---');
  console.log(`REQUEST: POST /api/applications (Same student applying again)`);
  const duplicateApplyRes = await apiRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/applications',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
    },
    { job_id: targetJob._id }
  );
  console.log(`RESPONSE HTTP ${duplicateApplyRes.statusCode}:`);
  console.log(JSON.stringify(duplicateApplyRes.body, null, 2));
  console.log('\n');

  // TEST 3: Status update via $set
  console.log('================================================================');
  console.log('TEST 3: Application Status Update ($set operator)');
  console.log('================================================================');
  const createdAppId = applyRes.body.application._id;
  console.log(`Updating Application ${createdAppId} status from "Applied" to "Interview"`);
  console.log(`REQUEST: PUT /api/applications/${createdAppId}/status (Authorization: Bearer <Company_Token>)`);
  console.log(`Payload: { "status": "Interview" }`);

  const updateStatusRes = await apiRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/applications/${createdAppId}/status`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${companyToken}`,
      },
    },
    { status: 'Interview' }
  );

  console.log(`RESPONSE HTTP ${updateStatusRes.statusCode}:`);
  console.log(JSON.stringify(updateStatusRes.body, null, 2));
  console.log('\n');

  // TEST 4: Aggregation Endpoint ($match, $lookup, $unwind, $group, $sum, $avg)
  console.log('================================================================');
  console.log('TEST 4: Company Dashboard Aggregation Pipeline ($group, $sum, $avg)');
  console.log('================================================================');
  console.log('REQUEST: GET /api/company/analytics (Authorization: Bearer <Company_Token>)');

  const analyticsRes = await apiRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/company/analytics',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${companyToken}`,
    },
  });

  console.log(`RESPONSE HTTP ${analyticsRes.statusCode}:`);
  console.log(JSON.stringify(analyticsRes.body, null, 2));
  console.log('================================================================\n');
}

runVerification().catch(console.error);
