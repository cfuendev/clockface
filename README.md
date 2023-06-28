# Clockface

<img src="https://i.imgur.com/LKITHzs.png">

Clockface is a Discord bot that converts everyone's name into clocks, displaying the current time on their respective timezones through their nickname. The bot updates the clock text appended to everyone's nicknames every 5 minutes, ensuring accurate and up-to-date information.

### Deployment and Customization

To use Clockface, you need to deploy it yourself and customize it through a clockface.config.js file. Follow the steps below:

1. Clone the Clockface repository to your local machine.

2. Install the required dependencies.

3. Create a .env file in the project directory.

4. Inside the .env file, add the following line:

```txt
DISCORD_TOKEN=your-bot-token
```
5. Replace <your-bot-token> with the actual token of your Discord bot. This token is necessary for the bot to authenticate with Discord's API.

6. Create a clockface.config.js file in the project directory.

7. Customize the time zones and user IDs in the clockface.config.js file according to your preferences:

```js
const timezones = {
  "-7": ["116493987804857033"],
  "-5": [
    "968982210782858365",
    "155416880726258621",
  ],
  "-4": ["465276284321831768"],
};

module.exports = timezones;
```

In the provided clockface.config.js file, each long string of numbers represents a Discord user's Snowflake/ID. The numbers like "-7" and "+2" correspond to the UTC time zone offset for each user. For example, if someone is in UTC-5 (like in Colombia), their Discord Snowflake/ID should be added to the "-5" array.

If you're unsure how to find someone's Snowflake/ID, you can refer to the [Discordlookup guide](https://discordlookup.com/help#what-is-a-snowflake-and-how-do-i-find-one), which provides a simple explanation on how to obtain it from the Discord UI.

And if to determine someone's UTC offset, you can go to [time.is](https://time.is), search for their city and scroll down to the part where that zone's offset is shown.

<img src="https://i.imgur.com/ib5MZYK.png">