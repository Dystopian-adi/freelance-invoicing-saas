# SaaS Starter — Docker Setup

This scaffold gives you: Laravel (PHP-FPM) + Nginx + MySQL + Redis + Node (for Vite/React), all wired together with Docker Compose.

## Folder structure expected

```
laravel-saas-docker/
├── docker-compose.yml
├── Makefile
├── .env                  # docker-compose variables (DB creds etc.)
├── docker/
│   ├── php/Dockerfile
│   └── nginx/default.conf
└── src/                  # <-- your actual Laravel app goes here
```

## Step 1 — Create the Laravel app inside `src/`

Since you don't have Laravel installed yet, the easiest way is to generate it using a temporary Composer container so you don't need PHP/Composer on your host machine at all:

```bash
docker run --rm -v $(pwd):/app -w /app composer:2 \
  create-project laravel/laravel src
```

This creates the `src/` folder with a fresh Laravel install.

## Step 2 — Build and start containers

```bash
docker compose build
docker compose up -d
```

Or with the Makefile shortcuts:
```bash
make build
make up
```

## Step 3 — Configure Laravel's `.env`

Edit `src/.env` (Laravel's own env file, separate from the top-level one) and set:

```
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=saas_app
DB_USERNAME=saas_user
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PORT=6379

QUEUE_CONNECTION=redis
CACHE_STORE=redis
SESSION_DRIVER=redis
```

Then generate the app key and run migrations:

```bash
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
```

Or: `make artisan key:generate` and `make migrate`

## Step 4 — Set up React with Vite (inside the same Laravel project)

Laravel ships with Vite by default. Inside `src/`, add React:

```bash
docker compose exec app composer require laravel/breeze --dev
docker compose exec app php artisan breeze:install react
```

This scaffolds a React frontend (with Inertia.js or as pure API+SPA depending on the option you pick) wired into Laravel's Vite config already — saves you from hand-wiring Axios/CORS/Sanctum from scratch.

> If you'd rather build a fully decoupled SPA (separate React app hitting a Laravel API), skip Breeze and instead just `npm install react react-dom` inside `src/` and build your own `resources/js` entry point — happy to walk you through that version too.

Start the Vite dev server (already running via the `node` container):
```bash
docker compose logs -f node
```

Vite will be available at `http://localhost:5173`, and the app itself (served by Nginx) at `http://localhost:8080`.

## Step 5 — Verify everything's connected

```bash
curl http://localhost:8080
```

You should see the Laravel welcome page (or your Breeze-scaffolded login page).

## Useful commands

| Task | Command |
|---|---|
| Start containers | `make up` |
| Stop containers | `make down` |
| Shell into app container | `make bash` |
| Run artisan command | `make artisan migrate:status` |
| Run composer command | `make composer require some/package` |
| Fresh DB + seed | `make fresh` |
| Run tests | `make test` |
| View logs | `make logs` |
| phpMyAdmin | http://localhost:8081 (user: root / pass: root) |

## Ports reference

| Service | Port |
|---|---|
| App (via Nginx) | 8080 |
| Vite dev server | 5173 |
| MySQL | 3306 |
| Redis | 6379 |
| phpMyAdmin | 8081 |
