FROM node:12-alpine

LABEL MAINTAINER = 'Patrick Bouffel <patrick@bouffel.com>'

WORKDIR /app

ADD public /app/public
ADD *.js package.json README.md /app/

# Rebuild the frontend apps
RUN cd /app && \
    npm install && \
    npm ci

EXPOSE 3000

USER node
CMD ["node", "app.js"]