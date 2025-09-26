// Built upon u/pwillia7 's stock script.
// u/ferrus_aub stock script using simple portfolio algorithm.
// https://www.reddit.com/r/Bitburner/comments/rn7l84/stock_script_to_end_your_financial_problems/
/** @param {NS} ns **/
//SOLID

// moved to settings.js
/*
export var settings = {
	volthresh: 0.05, // max allowable volatility
	minshares: 5, //minimum number of shares to buy
	minbuy: 1000000, // minimum purchase
};
*/

import { settings } from "settings.js";

export async function main(ns) {
	//var maxSharePer = 1.00;
	var threshold = settings.threshold; //0.60; // min forecast threshold
	var moneykeep = settings.moneykeep; // hold onto this much
	var volthresh = settings.volthresh; // max allowable volatility
	var minshares = settings.minshares; //minimum number of shares to buy
	var minbuy = settings.minbuy; // minimum purchase

	// existence of file indicates the "on" status of this script
	var runfile = "runfile-" + ns.getScriptName() + ".txt";

	ns.disableLog('disableLog');
	ns.disableLog('sleep');
	ns.disableLog('getServerMoneyAvailable');

	var dryrun = false;

	var usage = "Continuously buy and sell stocks by simple algorithm\n\
	Usage: {flags}\n\
	[-h]		This help text\n\
	[-k]		Amount of money to hold onto. Default " + ns.format.number(moneykeep,"0.000a") + "\n\
	[-f thresh]	Minimum forecast threshold to buy. Default " + threshold + "\n\
	[--dryrun]	Dryrun";
	var help = false;


	var lines = ns.args;
	while (lines.length > 0) {
		let item = lines.shift();
		switch (item) {
			case "--dryrun":
				dryrun = true; // Make money!
				break;
			case "-f":
				threshold = lines[0] > 0.50 ? lines.shift() : 0;
				break;
			case "-k":
				moneykeep = lines.shift();
				break;
			case "-h":
			default:
				if (item.match(/^-/)) {
					// bad argument
				} else {
					// un-tacked argument
				}
				help = true;
				break;
		}
	}


	if (!help) {

		if (!ns.fileExists(runfile, "home")) {
			// create runfile if it does'nt exist
			await ns.write(runfile, "running " + runfile, "w");
			ns.tprint("Created runfile: ", runfile,
				"\n\t\tDelete file to gracefully kill the script");
			//ns.tprint("run ", switchscript, " first");
		}

		if (!ns.scriptRunning("check-moneystocks.js", "home")) {
			ns.exec("check-moneystocks.js", "home",1);
		}

		ns.tprint("Keeping " + ns.format.number(moneykeep, "0.000a"));
		var positioncount = 0; // number of positions in portfolio
		while (threshold && ns.fileExists(runfile, "home") || positioncount > 0) { // external loop control
			// sort stock symbols by forecast strength?
			//var nowtime = new Date();
			let symbols = ns.stock.getSymbols()
				.sort(function (a, b) {
					return ns.stock.getForecast(b) - ns.stock.getForecast(a);
				});
			positioncount = 0;
			for (const sym of symbols) {
				var position = ns.stock.getPosition(sym);
				if (position[0]) {
					// if we possess stocks, sell them if appropriate
					// returns number of positions, or zero if sold
					// running count of portfolio. If zero, there's nothing to sell
					positioncount += sellpositions(sym); //
				}
				if (ns.fileExists(runfile, "home")) {
					//ns.isRunning(switchscript, "home")) {
					// if runswitch is turned off, stop buying stocks
					// will continue selling until positioncount is zero
					buypositions(sym);
				}
			}
			//ns.print('Cycle Complete');
			await ns.sleep(2000);
		}
		ns.tprint("Done with Stocks! Kbye!");
		if (ns.fileExists(runfile, "home")) await ns.rm(runfile, "home");

	} else {
		ns.tprint(usage);
	}

	function buypositions(sym) {
		// to externalize, need to pass:
		// threshold, moneykeep, sym
		// use export var settings in this file to pass
		//  volthresh, minshares, minbuy
		// then import into external buy script
		let maxshares = ns.stock.getMaxShares(sym) - position[0];
		let askprice = ns.stock.getAskPrice(sym);
		let forecast = ns.stock.getForecast(sym);
		let volatility = ns.stock.getVolatility(sym);
		let playermoney = ns.getServerMoneyAvailable('home') - moneykeep;

		let shares = Math.min(
			Math.floor(playermoney / askprice),
			maxshares);
		if (forecast >= threshold // positive forecast
			&& volatility <= volthresh // make sure it's not too volatile
			&& (playermoney // if enough money to buy minshares
				> ns.stock.getPurchaseCost(sym, minshares, "Long"))
			&& ns.stock.getPurchaseCost(sym, shares, "Long") > minbuy
		) {

			let bought = dryrun ? "(" + (shares * askprice).toFixed(2) + ")" : ns.stock.buy(sym, shares);
			if (bought) ns.print("Buying ", sym, ": ",
				shares, " shares for ", ns.format.number(bought, "0.000a"),
				" = ", ns.format.number(shares * bought, "0.000a")
			);
		}
	}
	/* */


	function sellpositions(sym) {
		let forecast = ns.stock.getForecast(sym);
		if (forecast < 0.5) {
			let shares = position[0];
			//let gain = ns.stock.getSaleGain(sym, shares, "Long");
			let sold = dryrun ? "___" : ns.stock.sell(sym, shares);
			ns.print("Sold ", sym, ": ",
				ns.format.number(shares, "0.000a"), " shares for ", ns.format.number(sold, "0.000a"),
				" = $", ns.format.number(shares * sold, "0.000a") //, " gain: ", number (gain)
			);
			ns.toast("Sold " + sym + ": $" + ns.format.number(shares * sold, "0.000a"), "success", 5000);
			return 0; // sold, return zero
		} else {
			return position[0];
		}
	}
}