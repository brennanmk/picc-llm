FROM python:3.12-bookworm

RUN apt-get update && apt-get install -y \
    mariadb-server \
    python3-venv \
    netcat-traditional

EXPOSE 8000

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
