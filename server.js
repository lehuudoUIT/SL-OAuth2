const axios = require("axios");
const express = require("express");
const { google } = require("googleapis");
const dayjs = require("dayjs");
require("dotenv").config();

const app = express();

const { SERVER_PORT, CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, API_KEY } =
  process.env;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

const calendar = google.calendar({
  version: "v3",
  auth: API_KEY,
});
const scopes = ["https://www.googleapis.com/auth/calendar"];

app.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.redirect(url);
});

app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  res.send({
    msg: "Successfully",
  });
});

app.get("/schedule_event", async (req, res) => {
  await calendar.events.insert({
    calendarId: "primary",
    auth: oauth2Client,
    requestBody: {
      summary: "This is a test event",
      description: "Test gg api",
      start: {
        dateTime: dayjs().add(1, "d").toISOString(),
        timeZone: "Asia/Ho_Chi_Minh",
      },
      end: {
        dateTime: dayjs().add(1, "d").add(1, "h").toISOString(),
        timeZone: "Asia/Ho_Chi_Minh",
      },
    },
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Connect to port ${SERVER_PORT} successfully!!!`);
});
