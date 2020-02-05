FROM nginx:latest
LABEL maintainer="Toni Mägel <tmaegel@posteo.de>"

COPY build/nginx/ssl /etc/nginx/ssl
COPY build/nginx/conf.d /etc/nginx/conf.d
COPY src/ /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
