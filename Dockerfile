FROM node:slim
# install dependencies
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV USERNAME Ja_nawarut
ENV DOMAIN @kkumail.com
ENV PASSWORD ja23102543
ENV URL https://oauth.kku.ac.th/authorize?client_id=33ee975f82e6d6ec&redirect_uri=http%3A%2F%2Fapp-reserve.kku.ac.th%2Fuser%2Fcallback&response_type=code&state=
ENV DURATION week

WORKDIR /app
COPY ./package.json /app
RUN npm install
COPY ./ ./
CMD ["npm", "start"]