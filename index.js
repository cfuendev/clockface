const Eris = require("eris");
// const commands = require("./commands");
const { BotIOManager } = require("./lib/io");
const timezones = require("./clockface.config");
const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

console.log(`
 ██████╗██╗      ██████╗  ██████╗██╗  ██╗███████╗ █████╗  ██████╗███████╗
██╔════╝██║     ██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗██╔════╝██╔════╝
██║     ██║     ██║   ██║██║     █████╔╝ █████╗  ███████║██║     █████╗  
██║     ██║     ██║   ██║██║     ██╔═██╗ ██╔══╝  ██╔══██║██║     ██╔══╝  
╚██████╗███████╗╚██████╔╝╚██████╗██║  ██╗██║     ██║  ██║╚██████╗███████╗
 ╚═════╝╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
`);
console.log("CLOCKFACE v.1.0");

// Cargamos las variables de entorno (Archivo .env)
require("dotenv").config();

// Creamos un nuevo "Cliente" (Bot) con Eris
console.log("\n🔁 Preparing Bot...");
const bot = Eris(`Bot ${process.env.DISCORD_TOKEN}`, {
  intents: ["guilds", "guildMembers", "guildPresences", "guildMessages"],
  getAllUsers: true,
});

/*
  botIO es un objeto que simplifica el I/O
  Y le mandamos el prefijo, que en este caso es "sudo"
*/
const botIO = new BotIOManager(bot, "cf!", true);

bot.on("ready", () => {
  console.log(`✅ Bot connected! I'm ${bot.user.username}!\n`);

  const findMemberTimezone = (idStr) => {
    let foundTimezone;
    let idx = 0;
    Object.values(timezones).forEach((timezone) => {
      if (timezone.find((timezoneUserID) => timezoneUserID === idStr)) {
        foundTimezone = Object.keys(timezones)[idx];
      }
      idx++;
    });
    return foundTimezone || null;
  };

  // TODO: This is HIDEOUSLY slow. Make a role blacklist instead.
  const memberHasAdminPermissions = (guild, member) => {
    let answer = false;
    member.roles.forEach((memberRole) => {
      if (guild.roles.get(memberRole).permissions.allow & 8n) {
        answer = true;
      }
    });
    return answer;
  };

  const editMemberWithTimeout = (guild, memberId, options, timeoutMillis) => {
    return Promise.race([
      guild.editMember(memberId, options),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Edit member timeout")),
          timeoutMillis
        )
      ),
    ]);
  };

  const iterateAndUpdateNicknames = () => {
    const greenwichTime = dayjs().utcOffset(0);

    // iterate through guilds
    if (greenwichTime.minute() % 5 === 0) {
      console.log(
        `This minute is modulo 5. It's currently ${greenwichTime.format(
          "hh:mm A"
        )}`
      );
      bot.guilds.forEach((guild) => {
        console.log(`\n=====================`);
        console.log(`Server / Guild: ${guild.name}`);
        console.log(`---------------------`);
        guild.fetchAllMembers();
        guild.members.forEach(async (member) => {
          // check for any matching ids (not owner's)
          if (
            member.id !== guild.ownerID &&
            !memberHasAdminPermissions(guild, member)
          ) {
            const nick = member.nick ? member.nick : member.user.username;
            console.log(
              `🤖 nick: ${member.nick} || username: ${member.user.username}`
            );
            const memberTimezone = findMemberTimezone(member.id);
            // if id matches, update with correct nickname "currentNickname + (HH:MM)"
            if (memberTimezone) {
              let memberTime;

              memberTimezone.slice(0, 1) === "+"
                ? (memberTime = greenwichTime
                    .add(parseInt(memberTimezone.slice(1)), "hours")
                    .format(" (hh:mm A)"))
                : (memberTime = greenwichTime
                    .subtract(parseInt(memberTimezone.slice(1)), "hours")
                    .format(" (hh:mm A)"));

              console.log(
                `⚙️ ${nick.replace(
                  /\s\(\d{1,2}:\d{2}\s[AP]M\)$|$/,
                  ""
                )} -> UTC${memberTimezone}`
              );
              console.log(
                `${greenwichTime.format(
                  " (hh:mm A)"
                )} ${memberTimezone} = ${memberTime}`
              );
              await editMemberWithTimeout(
                guild,
                member.user.id,
                {
                  nick: nick.replace(
                    /\s\(\d{1,2}:\d{2}\s[AP]M\)$|$/,
                    memberTime
                  ),
                },
                240000
              )
                .then(() =>
                  console.log(
                    `✅ Succesfully renamed ${member.username} from ${guild.name}`
                  )
                )
                .catch((err) => {
                  console.log(`💀 Renaming ${nick} from ${guild.name} failed`);
                  console.log(`💀📃 ${err.toString().replace(/\n.+/, "")}`);
                });
            }
          }
        });
      });
    } else {
      console.log(
        `Not yet at a minute that's modulo 5. It's currently ${greenwichTime.format(
          "(hh:mm A)"
        )}`
      );
    }
    console.log("\n🔁 Retrying in 30 secs...\n");
  };
  iterateAndUpdateNicknames();
  setInterval(iterateAndUpdateNicknames, 30000);
  return;
});

// Connect to Discord
bot.connect();
