FROM postgres:latest
WORKDIR /usr/src/lochatbackend/database
COPY init.sql /docker-entrypoint-initdb.d/10-init.sql
EXPOSE 5432