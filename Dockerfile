FROM ubuntu:latest

RUN apt-get update && apt-get -y install cron curl

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs
# RUN adduser nonroot --system
RUN adduser nonroot

# install stuff for chromium
# ENV TERM 8
RUN DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata
RUN apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
    libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
    libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
    libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev \
    ca-certificates \
    fonts-liberation gconf-service libappindicator1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 \
    libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
    libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
    libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils


COPY node_source /node_source
WORKDIR /node_source
# RUN npm install
RUN su - nonroot -c "cd /node_source; npm install"
RUN chmod 777 /node_source/check_price.sh

# Copy hello-cron file to the cron.d directory
COPY check_price_cron_job /etc/cron.d/check_price_cron_job
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/check_price_cron_job
# Apply cron job
RUN crontab /etc/cron.d/check_price_cron_job
# Create the log file to be able to run tail
RUN touch /var/log/cron.log
# Run the command on container startup
CMD cron && tail -f /var/log/cron.log
# CMD su - nonroot -c "node /node_source/index.js"
# CMD /node_source/check_price.sh
