const puppeteer = require("puppeteer");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const browser_options = {
  headless: true,
  ignoreHTTPSErrors: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-gpu",
    "--disable-sync",
    "--disable-translate",
    "--mute-audio",
    "--hide-scrollbars",
    "--metrics-recording-only",
    "--no-first-run",
    "--safebrowsing-disable-auto-update",
    "--js-flags=--noexpose_wasm,--jitless",
    "--ignore-certificate-errors",
  ],
};

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const navigate = async (url) => {
  const browser = await puppeteer.launch(browser_options);
  try {
    let page = await browser.newPage();
    await page.bringToFront();

    console.log("Adding flag");
    await page.goto(process.env.PAGE_URL + "/add", {
      waitUntil: "networkidle2",
      timeout: 10000,
    });

    await page.type("#title", "The lovely film about the flag");
    await page.type("#description", process.env.FLAG);
    await page.click("#submit");

    console.log(`Admin navigating to ${url}`);
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 10000,
    });

    await sleep(1000);
    console.log("Done");
    return true;
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
  return false;
};

app.get("/url", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "url.html"));
});

app.post("/url", async (req, res) => {
  const body = req.body;
  const visited = await navigate(body.url);
  if (visited) res.sendStatus(200);
  else res.sendStatus(500);
  res.end();
});

app.listen(PORT, (e) => {
  if (e) console.log(e);
  else console.log("Server listening on PORT", PORT);
});
