up:
	docker-compose up -d --build

down:
	docker-compose down --remove-orphans -t 30

shell:
	docker-compose run -p 127.0.0.1:3000:3000 server bash
	$(MAKE) down
