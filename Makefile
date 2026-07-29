.PHONY: up down build bash artisan composer migrate fresh test logs

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build --no-cache

bash:
	docker compose exec app bash

artisan:
	docker compose exec app php artisan $(filter-out $@,$(MAKECMDGOALS))

composer:
	docker compose exec app composer $(filter-out $@,$(MAKECMDGOALS))

migrate:
	docker compose exec app php artisan migrate

fresh:
	docker compose exec app php artisan migrate:fresh --seed

test:
	docker compose exec app php artisan test

logs:
	docker compose logs -f
