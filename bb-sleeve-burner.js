/** @param {NS} ns */

var actions = {
	field: "Field analysis",
	recruit: "Recruitment",
	diplomacy: "Diplomacy",
	infiltrate: "Infiltrate synthoids",
	support: "Support main sleeve",
	contracts: "Take on contracts",
};

export async function main(ns) {

	var lines = ns.args;

	console.log(lines);
	var action = ns.args[0] ? ns.args[0] : null;
	var contract = ns.args[1] ? ns.args[1] : null;



	if (!Object.keys(actions).includes(action)) {
		ns.tprint("No such Bladeburner action");
		ns.tprint("Available actions:");
		for (const act in actions) {
			ns.tprint(act + ": \t" + actions[act]);
		}
		ns.exit();
	}


	for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
		ns.tprint("Setting sleeve " + i + " to " + actions[action]);
		if (contract) {
			ns.sleeve.setToBladeburnerAction(i, actions[action], contract);
		} else {
			ns.sleeve.setToBladeburnerAction(i, actions[action]);
		}
	}
}



export function autocomplete(data, args) {
	//console.log(data);
	return [... Object.keys(actions)];
}
