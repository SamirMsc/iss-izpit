# Student Servis Backend

## Pokretanje

```bash
npm install
npx prisma generate
npx prisma migrate dev --name student_servis_init
npm run start:dev
```

## Glavne rute

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/signout`
- `POST /auth/forgot-password`
- `PATCH /auth/update-password`
- `GET /users/me`
- `PATCH /users/me`
- `GET /jobs`
- `GET /jobs/:id`
- `GET /jobs/company/me`
- `POST /jobs`
- `PATCH /jobs/:id`
- `DELETE /jobs/:id`
- `POST /applications`
- `GET /applications/me`
- `GET /applications/company`
- `PATCH /applications/:id/status`
- `GET /notifications`
- `PATCH /notifications/:id/read`

## Logika

- company pravi oglase
- student se prijavljuje
- student može imati najviše 3 `PENDING` prijave
- company prihvata ili odbija prijavu
- student dobija notifikaciju
