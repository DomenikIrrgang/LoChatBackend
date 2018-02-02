FROM postgres:latest
WORKDIR /usr/src/lochatbackend/database
COPY init.sql /docker-entrypoint-initdb.d/10-init.sql
EXPOSE 5432
RUN sed -e "s/[#]\?listen_addresses = .*/listen_addresses = '*'/g" -i '/etc/postgresql/10.1/main/postgresql.conf