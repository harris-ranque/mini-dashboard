# Mini Dashboard

A full-stack sales dashboard: Django REST API, PostgreSQL, React (Vite), and Docker Compose for local development.

## Features

- View sales by client with revenue summary
- Set monthly targets per client
- Client selector dropdown (data loaded from the API)
- Django admin for managing records
- pgAdmin for browsing the database

## Tech stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19, Vite, Axios                           |
| Backend    | Django 6, Django REST Framework, Gunicorn         |
| Database   | PostgreSQL 17                                   |
| Tooling    | Docker Compose, uv (Python), pgAdmin 4          |

## Project structure

```
mini-dashboard/
├── backend/           # Django API
│   ├── config/        # Settings, root URLs
│   ├── dashboard/     # Models, views, serializers
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/          # React app
│   └── src/
├── docker-compose.yaml
├── .env.example       # Root env template (Docker)
└── README.md
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- For local (non-Docker) dev: Python 3.12+, [uv](https://docs.astral.sh/uv/), Node.js 20+

## Quick start (Docker)

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set passwords and `DJANGO_SECRET_KEY`.

2. Start services:

   ```bash
   docker compose up -d --build
   ```

3. Open:

   | Service        | URL                          |
   | -------------- | ---------------------------- |
   | API            | http://127.0.0.1:8000        |
   | Django admin   | http://127.0.0.1:8000/admin/ |
   | pgAdmin        | http://127.0.0.1:5050        |

4. Run the frontend (separate terminal):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open http://localhost:5173 (or the port Vite prints).

5. Add data via Django admin (`/admin/`), then pick a client in the dashboard dropdown.

## Local development (without Docker)

### Database

Start PostgreSQL (Docker is fine for DB only):

```bash
docker compose up -d postgres
```

### Backend

```bash
cd backend
cp .env.example .env   # set DB_HOST=localhost and match postgres credentials
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional: point the frontend at a different API:

```bash
# frontend/.env.local
VITE_API_URL=http://127.0.0.1:8000
```

## Environment variables

Root `.env` (used by `docker compose`):

| Variable               | Description                    |
| ---------------------- | ------------------------------ |
| `POSTGRES_DB`          | Database name                  |
| `POSTGRES_USER`        | Database user                  |
| `POSTGRES_PASSWORD`    | Database password              |
| `POSTGRES_PORT`        | Host port for PostgreSQL       |
| `PGADMIN_*`            | pgAdmin login and port         |
| `DJANGO_SECRET_KEY`    | Django secret key              |
| `DJANGO_DEBUG`         | `True` / `False`               |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hosts          |
| `BACKEND_PORT`         | Host port for the API (8000)   |

`backend/.env` is for running Django on the host (`DB_HOST=localhost`, etc.).

## API

Base URL: `http://127.0.0.1:8000/api/`

| Method | Endpoint    | Description                          |
| ------ | ----------- | ------------------------------------ |
| GET    | `/clients/` | List all clients (`id`, `name`)    |
| GET    | `/sales/`   | Sales for a client (header required) |
| POST   | `/target/`  | Create or update monthly target      |

### Examples

```bash
# List clients
curl http://127.0.0.1:8000/api/clients/

# Sales for client 1
curl -H "Client-Id: 1" http://127.0.0.1:8000/api/sales/

# Update target
curl -X POST http://127.0.0.1:8000/api/target/ \
  -H "Content-Type: application/json" \
  -d '{"client_id": 1, "monthly_goal": "5000.00"}'
```

## pgAdmin

1. Open http://127.0.0.1:5050 and sign in with `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD` from `.env`.
2. Register a server:
   - **Host:** `postgres` (Docker network) or `localhost` (from your machine)
   - **Port:** `5432`
   - **Database / user / password:** same as `POSTGRES_*` in `.env`

## Useful commands

```bash
# View logs
docker compose logs -f backend

# Stop everything
docker compose down

# Django shell (inside backend container)
docker compose exec backend python manage.py shell

# Create superuser
docker compose exec backend python manage.py createsuperuser
```

## Data model

- **Client** — customer (`name`)
- **Sales** — sale line items linked to a client (`product_name`, `amount`)
- **Target** — one monthly goal per client (`monthly_goal`)
