up:
	docker-compose up -d --build

down:
	docker-compose down --remove-orphans -t 30

shell:
	docker-compose run -p 3000:3000 -p 9229:9229 server bash
	$(MAKE) down
