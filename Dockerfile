FROM nginx:mainline-alpine
LABEL maintainer="Toni Mägel <tmaegel@posteo.de>"

COPY --chown=101:101 build/nginx/ /etc/nginx/
COPY --chown=101:101 dist/ /usr/share/nginx/html
RUN chown -R 101:101 /usr/share/nginx/html /etc/nginx
# User nginx
USER 101
