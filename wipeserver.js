/** @param {NS} ns **/
export async function main(ns) {

	if (ns.serverExists(ns.args[0])) {
		ns.killall(ns.args[0]);
	}
}


export function autocomplete(data, args) {
	return [...data.servers];
}