/** @param {NS} ns **/
export async function main(ns) {

  //ns.disableLog("ALL");

  var server = "home";
  var commands = [
    ["scanhosts.js", 1, "phantasy", "-q", "--hackable", "-e", "pserv"],
    ["buy-redditstocks.js", 1, "-f", "0.565"],
    ["batch-install-all.js", 1],
    //["controlpanel.js", 		1],
  ];
  //memcheck(["share.js", 				47500]);
  if (!ns.serverExists("pserv-24"))
    commands.push(["buy-servers.js", 1, "-r", "20", "phantasy"]);

  for (const comm of commands) {
    await memcheck(comm);
  }

  async function memcheck(args) {
    var freemem = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    while (ns.getScriptRam(args[1]) > freemem) {
      await ns.sleep(1000);
      //wait until free ram
    }
    //let script = args.shift();
    //let threads = args.shift();
    //ns.tprint(...args);
    ns.run(...args);
    //ns.exec(args.shift(), args.shift(), [...args]);
  }

}