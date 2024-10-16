FROM node:slim AS app

RUN apt-get update \
    && apt-get install -y wget supervisor gnupg \
    && apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 libxshmfence1 libglu1 \
    --no-install-recommends

RUN wget --no-verbose -O /tmp/chrome.deb https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_120.0.6099.129-1_amd64.deb \
    && apt install -y /tmp/chrome.deb \
    && rm /tmp/chrome.deb    

WORKDIR /bot
COPY package*.json .
RUN npm i --verbose

COPY . .

CMD ["npm", "run", "bot"]
