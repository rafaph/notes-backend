FROM node:16

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

ENV npm_config_build_from_source=true

RUN ["chmod", "+x", "/usr/local/bin/entrypoint.sh"]

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
