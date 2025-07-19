import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const countedUsers = new Set();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
  ],
});

client.once('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  const userId = member.user.id;
  const guild = member.guild;

  // Skip if already counted
  if (countedUsers.has(userId)) return;

  // Mark user as counted
  countedUsers.add(userId);

  try {
    // Fetch latest invites
    const invites = await guild.invites.fetch();

    const inviteData = invites.map(invite => ({
      code: invite.code,
      uses: invite.uses,
      inviter: invite.inviter?.tag || 'Unknown',
      inviterId: invite.inviter?.id || null,
    }));

    // Send to your REST API
    console.log('📤 Sending invite data to:', process.env.API_URL);
    const response = await fetch(process.env.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newUser: {
          id: userId,
          tag: member.user.tag,
        },
        invites: inviteData,
      }),
    });

    const data = await response.json();
    console.log('📤 Sent invite data to API:', data);
  } catch (error) {
    console.error('❌ Failed to send invite data:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
