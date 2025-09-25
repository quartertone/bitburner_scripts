/** @param {NS} ns **/
import { settings, getservers, getmemtimes } from "/settings.js";
//initiator for batch hacking algorithm
export async function main(ns) {


/*

This script is basically a control script

1 - identify server (from args)
1.5 - controller stays on home server

2 - get list of servers that have memory
for each server, calculate amount number of threads possible



*/

var 	targetlist = getservers(ns).filter((s) => {
	if (s.match("pserv")) return false;
	let info = ns.getServer(s);
	if ( info.
		ns.getServerMaxMoney(s) > 0 
			&& ns.getServerRequiredHackingLevel(s) < ns.getHackingLevel()
			) {
			return true;
		}
	}).sort(function(a,b) {

	});

}
