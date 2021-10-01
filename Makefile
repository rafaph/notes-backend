up:
	docker-compose up -d --build

down:
	docker-compose down --remove-orphans -t 30

shell:
	docker-compose run server bash
	$(MAKE) down
