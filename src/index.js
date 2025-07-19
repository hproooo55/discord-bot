import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
  ],
});

let cachedInvites = new Map();
const countedUsers = new Set(); // To avoid duplicate joins

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return console.error('❌ Guild not found');

  try {
    const invites = await guild.invites.fetch();
    cachedInvites = new Map(invites.map(inv => [inv.code, inv.uses]));
    console.log('✅ Cached invites');
  } catch (err) {
    console.error('❌ Error fetching invites:', err);
  }
});

client.on('guildMemberAdd', async member => {
  if (countedUsers.has(member.id)) return;
  countedUsers.add(member.id);

  const guild = member.guild;

  try {
    const newInvites = await guild.invites.fetch();
    cachedInvites = new Map(newInvites.map(inv => [inv.code, inv.uses]));

    const fullInviteData = [...newInvites.values()].map(inv => ({
      inviter: inv.inviter?.tag || 'Unknown',
      code: inv.code,
      uses: inv.uses,
    }));

    console.log('📤 Sending full invite data for:', member.user.tag);

    const res = await fetch(process.env.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        joinedUser: member.user.tag,
        joinedUserId: member.id,
        invites: fullInviteData,
      }),
    });

    const result = await res.json();
    console.log('✅ API response:', result);
  } catch (err) {
    console.error('❌ Error sending invite data:', err);
  }
});

client.login(process.env.DISCORD_TOKEN);
