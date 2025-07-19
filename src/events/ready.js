export default async function ready(client) {
  console.log(`Logged in as ${client.user.tag}`);
  // const guild = await client.guilds.fetch(process.env.GUILD_ID);
  // const invites = await guild.invites.fetch();
  // let invArray = [];
  // invites.forEach(inv => {
  //   invArray.push({
  //     "code": `${inv.code}`,
  //     "uses": `${inv.uses}`,
  //     "inviter": `${inv.inviter?.tag || "unknown"}`
  //   });
  // });
  // console.log(invArray);
}