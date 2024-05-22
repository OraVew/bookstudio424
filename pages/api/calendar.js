import { google } from 'googleapis';
import moment from 'moment-timezone';

export default async function handler(req, res) {
  console.log('Received request:', req.method, req.query); // Log the request method and query parameters

  if (req.method === 'GET') {
    try {
      // Configure a JWT auth client
      let jwtClient = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newline escape character
        ['https://www.googleapis.com/auth/calendar']
      );

      // Authorize the client
      await jwtClient.authorize();

      // Google Calendar API setup
      const calendar = google.calendar({ version: 'v3', auth: jwtClient });

      // Convert the UTC date to a Chicago date using moment-timezone
      const chicagoDate = moment.tz(req.query.date, 'UTC').tz('America/Chicago');

      // Set time bounds for the start and end of the day in Chicago timezone
      const timeMin = chicagoDate.clone().startOf('day');
      const timeMax = chicagoDate.clone().startOf('day').add(26, 'hours').subtract(1, 'milliseconds');

      // Make a call to the Google Calendar API freebusy query
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          timeZone: 'America/Chicago',
          items: [{ id: 'c_f64009fdd73360de1ae776964d11f0462b2a173ac1ddf90381d397df396fe5fd@group.calendar.google.com' }],
        },
      });

      // Define normal working hours from 9:00 AM to 11:59 PM and additional early morning hours
      const normalHoursEnd = chicagoDate.clone().set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      const earlyMorningStart = chicagoDate.clone().add(1, 'day').startOf('day');
      const earlyMorningEnd = earlyMorningStart.clone().add(2, 'hours');

      let availableTimes = [];
      let current = chicagoDate.clone().set({ hour: 9, minute: 0, second: 0, millisecond: 0 });

      // Calculate available times
      const busyTimes = response.data.calendars['c_f64009fdd73360de1ae776964d11f0462b2a173ac1ddf90381d397df396fe5fd@group.calendar.google.com'].busy;
      busyTimes.forEach(busyTime => {
        let busyStart = moment(busyTime.start);
        let busyEnd = moment(busyTime.end);

        if (current.isBefore(busyStart)) {
          availableTimes.push({ start: current.toISOString(), end: busyStart.toISOString() });
        }
        current = busyEnd;
      });

      // Adjust for any remaining time after the last busy period up to normal hours end and early morning end
      if (current.isBefore(normalHoursEnd)) {
        availableTimes.push({ start: current.toISOString(), end: normalHoursEnd.toISOString() });
      }
      current = earlyMorningStart;
      busyTimes.forEach(busyTime => {
        let busyStart = moment(busyTime.start);
        let busyEnd = moment(busyTime.end);

        if (current.isBefore(busyStart)) {
          availableTimes.push({ start: current.toISOString(), end: busyStart.toISOString() });
        }
        current = busyEnd;
      });
      if (current.isBefore(earlyMorningEnd)) {
        availableTimes.push({ start: current.toISOString(), end: earlyMorningEnd.toISOString() });
      }

      // Convert available times to CST for response
      const availableTimesCST = availableTimes.map(slot => ({
        start: moment(slot.start).tz('America/Chicago').format(),
        end: moment(slot.end).tz('America/Chicago').format(),
      }));

      console.log('Sending response:', availableTimesCST);
      res.status(200).json(availableTimesCST);
    } catch (error) {
      console.error('Error fetching free/busy info:', error);
      res.status(500).send('Error fetching calendar data');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
