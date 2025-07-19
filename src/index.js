import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites
  ]
});

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;
const apiUrl = process.env.API_URL; // e.g., "https://yourdomain.com/api/invite"

const inviteCache = new Map();
const countedUsers = new Set(); // To avoid duplicate counts

client.once('ready', async () => {
  const guild = await client.guilds.fetch(guildId);
  const invites = await guild.invites.fetch();

  invites.forEach(invite => {
    inviteCache.set(invite.code, invite.uses);
  });

  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('guildMemberAdd', async member => {
  if (countedUsers.has(member.id)) return console.log(`User ${member.user.tag} already counted.`);

  const guild = await client.guilds.fetch(guildId);
  const newInvites = await guild.invites.fetch();

  let usedInvite = null;

  newInvites.forEach(invite => {
    const prevUses = inviteCache.get(invite.code) || 0;
    if (invite.uses > prevUses) {
      usedInvite = invite;
    }
  });

  if (usedInvite) {
    countedUsers.add(member.id);
    inviteCache.set(usedInvite.code, usedInvite.uses);

    const data = {
      inviter: {
        id: usedInvite.inviter.id,
        username: usedInvite.inviter.username,
        tag: usedInvite.inviter.tag
      },
      code: usedInvite.code,
      uses: usedInvite.uses,
      joinedUser: {
        id: member.id,
        username: member.user.username,
        tag: member.user.tag,
        joinedAt: new Date()
      }
    };


    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error('❌ Failed to send invite data:', await response.text());
      } else {
        console.log('✅ Invite data sent to API.');
      }
    } catch (error) {
      console.error('❌ Error sending invite data:', error);
    }
  }
});

client.login(token);
