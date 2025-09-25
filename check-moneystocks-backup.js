/** @param {NS} ns **/
//SOLID
import { panelbox, havebox, time } from "settings.js";
export async function main(ns) {

	var box = true;
	var console = ns.args[0] ? true : false;

	var output = document.createElement("table");
	output.id = "stocktable";
	output.style = "width:100%";
	while (box) {

		let symbols = ns.stock.getSymbols()
			.sort(function (a, b) {
				return Math.abs(0.5 - ns.stock.getForecast(b)) - Math.abs(0.5 - ns.stock.getForecast(a));
			});;
		//if (!box && !ns.args[0] ) break;
		output.innerHTML = "";
		var totalmoney = 0;
		let symcount = 0;
		for (const sym of symbols) {
			symcount++;
			var [shares, avgpx, shorts] = ns.stock.getPosition(sym);

			let prefix = "";
			let count = 0;
			let gain = 0;
			let sellcommand = "";
			if (shares) {
				gain = ns.stock.getSaleGain(sym, shares, "Long");
				totalmoney += gain;
				count = shares;
				
				/*	if (console) {
						output.innerHTML += sym + "\t" + ns.format.number(shares, "0.000a") + " pos \t" + ns.format.number(salegain, "0.000a") + "\n";
					} else {
						output.innerHTML += "<tr><td>" + sym + "</td><td>" + (100 * ns.stock.getForecast(sym)).toFixed(2) + "</td><td style='text-align:right'>" + ns.format.number(salegain, "0.000a") + "</td></tr>";
					}*/
			} else if (shorts) {
				gain = ns.stock.getSaleGain(sym, shorts, "Short");
				totalmoney += gain;
				count = shorts;
				prefix = "-"
				/*if (console) {
					output.innerHTML += "-" + sym + "\t" + ns.format.number(shorts, "0.000a") + " pos \t" + ns.format.number(shortgain, "0.000a") + "\n";
				} else {
					output.innerHTML += "<tr><td>-" + sym + "</td><td>" + (100 * ns.stock.getForecast(sym)).toFixed(2) + "</td><td style='text-align:right'>" + ns.format.number(shortgain, "0.000a") + "</td></tr>";
				}*/
			}
			if (count) {
				if (console) {
					output.innerHTML += prefix + sym + "\t" + ns.format.number(count, "0.000a") + " pos \t" + ns.format.number(gain, "0.000a") + "\n";
				} else {
					output.innerHTML += "<tr><td>" +
					symcount + ":" + prefix + sym + "</td><td style='text-align:center'>" + (100 * ns.stock.getForecast(sym)).toFixed(2) + "</td><td style='text-align:right'>" + ns.format.number(gain, "0.000a") + "</td></tr>";
				}
			}

		}
		if (console) {
			output.innerHTML += "Total money in Stocks:\t" + ns.format.number(totalmoney, "0.000a") + "\n" + time(); //+ " = " + totalmoney;
		} else {
			output.innerHTML += "<tr><td>Total:</td><td></td><td style='text-align:right;font-weight:bold;'>" + ns.format.number(totalmoney, "0.000a") + "</td></tr>"
				+ "<tr><td></td><td id='panelboxheader'>" + time() + "</td></tr></table>";

		}
		if (console) {
			ns.tprint("\n" + output.innerHTML);
			break;
		} else {
			panelbox(output, "stockpanel");
		}

		await ns.sleep(4000);

		box = havebox("stockpanel");
	}
	ns.tprint("END");
}