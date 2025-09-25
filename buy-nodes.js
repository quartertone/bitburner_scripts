/** @param {NS} ns **/
export async function main(ns) {
	var maxlevel = 200;
	var maxram = 64;
	var maxcores = 16;

	var maxnodes = 0; //ns.args[0]; //or whatever



	var usage = "Buy hack nodes\n\
    Usage: [-h] [-n num]\n\
	[-h]	This help text\n\
	[-n num]	Max number of hack nodes to purchase";

	// parse command line argumentsh
	var lines = ns.args;
	while (lines.length > 0) {
		let item = lines.shift();
		ns.tprint(item);
		switch (item) {
			case "-h":
				maxnodes = 0;
				break;
			case "-n":
				maxnodes = lines.shift();
				break;
			default:
				if (item.match(/^-/)) {
					// bad argument
					maxnodes = 0; // this forces script to fail
				} else {
					// un-tacked argument defaults to target name
					maxnodes = 0;//item;
				}
				break;
		}
	}


	if (maxnodes > 0) {

		//var mymoney = ns.getServerMoneyAvailable("home");
		var newserver = true; // need this to initiate loop
		var upgraded = true; // also need this to get innerinner looploop started 
		while (newserver || upgraded) {
			//ns.tprint("outer while loop");
			await ns.sleep(200);
			newserver = false;
			if (ns.hacknet.numNodes() > 0) {
				//ns.tprint("we have existing nodes");
				// ignore price difference if we have max number of nodes
				let maxedout = ns.hacknet.numNodes() >= maxnodes ? true : false;
				//if (maxedout) ns.tprint("hacknet Nodes purchases Maxed Out");
				upgraded = true;
				while (upgraded) {
					await ns.sleep(25);
					upgraded = false;
					//ns.tprint("Checking for upgradable things");
					for (let i = 0; i < Math.min(maxnodes, ns.hacknet.numNodes()); i++) {
						let nodestat = ns.hacknet.getNodeStats(i);
						//ns.tprint(nodestat);
						if (
							nodestat.level < maxlevel &&
							(maxedout ||
								ns.hacknet.getLevelUpgradeCost(i, 1) <
								ns.hacknet.getPurchaseNodeCost())) {
							// costs less to upgrade level
							if (ns.getServerMoneyAvailable("home") > ns.hacknet.getLevelUpgradeCost(i, 1)
							) {
								//we have money
								//upgrade the level
								ns.hacknet.upgradeLevel(i, 1);
								ns.print("Upgraded hacknode ", i, " level");
							}
							upgraded = true;
						}
						if (
							nodestat.ram < maxram &&
							(maxedout ||
								ns.hacknet.getRamUpgradeCost(i, 1) < ns.hacknet.getPurchaseNodeCost())) {

							// costs less to upgrade level
							if (ns.getServerMoneyAvailable("home") > ns.hacknet.getRamUpgradeCost(i, 1)
							) {
								//we have money
								//upgrade the ram
								ns.hacknet.upgradeRam(i, 1);
								ns.print("Upgraded hacknode ", i, " RAM");
							}
							upgraded = true;
						}
						if (
							nodestat.cores < maxcores &&
							(maxedout ||
								ns.hacknet.getCoreUpgradeCost(i, 1) < ns.hacknet.getPurchaseNodeCost())) {

							// costs less to upgrade level
							if (ns.getServerMoneyAvailable("home") > ns.hacknet.getCoreUpgradeCost(i, 1)
							) {
								//we have money
								//upgrade the Core
								ns.hacknet.upgradeCore(i, 1);
								ns.print("Upgraded hacknode ", i, " RAM");
							}
							upgraded = true;
						}
						//if (upgraded) ns.tprint("Something was upgraded");
					} // for loop complete
					//ns.tprint("while upgraded is true, repeat the loop");
				}
				//ns.tprint("existing nodes are fully upgraded");
				// now it's cheaper to buy new server.
			}

			if (
				ns.hacknet.numNodes() < maxnodes) {

				if (ns.getServerMoneyAvailable("home") > ns.hacknet.getPurchaseNodeCost()
				) {
					let i = ns.hacknet.purchaseNode();
					ns.tprint("Purchased HackNode-", i);
				}
				newserver = true; // bought new server; repeat upgrade loop
			}
			await ns.sleep(20);
		}
		ns.tprint("--- Hacknode purchase complete ---");
	} else {
		ns.tprint(usage);
	}
}