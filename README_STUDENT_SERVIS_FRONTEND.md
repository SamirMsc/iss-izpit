# Student Servis Frontend

This frontend was adapted from the original recipe app into a student-servis application.

## Main pages
- Landing page
- Login / Register
- Forgot password
- Dashboard
- Jobs page
- My Applications page
- Company Jobs page
- Notifications page
- Account page

## Important
The UI expects the student-servis backend endpoints on `http://localhost:3000` and uses cookie auth with `withCredentials: true`.

## Start
```bash
npm install
npm start
```

## Notes
- Student can apply for jobs with resume URL and motivation.
- Company can create/edit/delete jobs and accept/reject applications.
- Notifications are shown through a bell icon and on a dedicated page.
