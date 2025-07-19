// export async function guildMemberAdd(member) {
//   const cachedInvites = invitesCache.get(member.guild.id);
//   const newInvites = await member.guild.invites.fetch();

//   const usedInvite = newInvites.find(inv => {
//     const cached = cachedInvites.get(inv.code);
//     return cached && inv.uses > cached.uses;
//   });

//   invitesCache.set(member.guild.id, newInvites); // update cache

//   if (usedInvite) {
//     const data = {
//       user: member.user.tag,
//       inviteCode: usedInvite.code,
//       uses: usedInvite.uses,
//       inviter: usedInvite.inviter?.tag || 'Unknown'
//     };

//     console.log('New member joined using:', data);

//     // Send to your API
//     await fetch(`http://${process.env.API_URL}/api/track-invites`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//   } else {
//     console.log(`New member ${member.user.tag} joined, but invite is unknown.`);
//   }
// }