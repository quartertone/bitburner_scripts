/** @param {NS} ns **/
//SOLID
//import {number} from "settings.js";
export async function main(ns) {

	var sym = "ALL";
	var threshold = 0;
	let output = "";

	var lines = ns.args;
	while (lines.length > 0) {
		let item = lines.shift();
		switch (item) {
			case "-l":
				threshold = lines.shift();
				break;
			default:
				if (item.match(/^-/)) {
					// bad argument
					sym = "ALL"; // this forces script to fail
				} else {
					// un-tacked argument defaults to target name
					sym = item;
				}
				break;
		}
	}

	if (!sym || sym == "ALL") {

		output += "Checking stock info for " + sym + ", Threshold " + threshold + "\n";
		//	let symbols = ns.stock.getSymbols();
		let symbols = ns.stock.getSymbols()
			.sort(function (a, b) {
				return Math.abs(0.5 - ns.stock.getForecast(b)) - Math.abs(0.5 - ns.stock.getForecast(a));
			});

		while (symbols.length > 0) {
			let sym = symbols.shift();
			if (ns.stock.getForecast(sym) > threshold) output += getstockinfo(sym);
		}
		ns.tprint(output + "\n\n");
	}


	function getstockinfo(sym) {
		var [shares, avgpx, shorts] = ns.stock.getPosition(sym);
		//var mark = shares ? "+" : shorts ? "-" : " ";
		var maxshares = ns.stock.getMaxShares(sym);
		var ownedshares = (100 * (shares + shorts) / maxshares).toFixed(1);
		return sym.padStart(6, " ")
			+ ":" // + mark 
			+ (" $" + ns.format.number(ns.stock.getAskPrice(sym), "0.000a")).padStart(10, " ")
			+ ("  $" + ns.format.number(ns.stock.getAskPrice(sym) * maxshares, "0.000a")).padStart(12, " ")
			+ "   ±" + (100 * ns.stock.getVolatility(sym)).toFixed(2) + "%"
			+ "   " + (100 * ns.stock.getForecast(sym)).toFixed(2) + "%"
			+ " (" + ((100 * ns.stock.getForecast(sym) - 50)).toFixed(2).padStart(6, " ") + ")"
			+ "   " + ownedshares + "%\n";
	}
}