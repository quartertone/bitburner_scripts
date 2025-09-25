/** @param {NS} ns **/
//SOLID
import { panelbox, havebox, gettime } from "settings.js";
import { terminalcommand } from "settings.js";


export async function main(ns) {
	var box = true;
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
		let stockchecker = true;
		let sellcommand = "";
		for (const sym of symbols) {
			symcount++;
			let [shares, avgpx, shorts, avgshortpx] = ns.stock.getPosition(sym);

			let prefix = "";
			let count = 0;
			let gain = 0;
			let deltagain = 0;
			let tr = document.createElement("tr");
			let delta = ns.format.number((100 * Math.abs(0.5 - ns.stock.getForecast(sym))), "00.0");

			if (shares) {
				gain = ns.stock.getSaleGain(sym, shares, "L");
				deltagain = gain - (shares * avgpx);
				totalmoney += gain;
				count = shares;

				tr.addEventListener("click", function (e) {
					sellcommand += 'var sold = ns.stock.sellStock("' + sym + '",' + shares + ');	ns.toast("Sold ' + sym + ': $" + ns.format.number(' + shares + '* sold, "0.000a"), "success", 5000);';

				});

			} else if (shorts) {
				gain = ns.stock.getSaleGain(sym, shorts, "S");
				deltagain = gain - (shorts * avgshortpx);
				totalmoney += gain;
				count = shorts;
				prefix = "-"

				tr.addEventListener("click", function (e) {
					//console.log("selling" + sym + shorts);
					sellcommand += 'var sold = ns.stock.sellShort("' + sym + '",' + shorts + ');	ns.toast("Sold short ' + sym + ': $" + ns.format.number(' + shorts + '* sold, "0.000a"), "success", 5000);';
				});

			}
			if (count) {
				tr.innerHTML += "<td style='text-align:left;cursor:pointer;' title='" + symcount + ":" + (100 * ns.stock.getForecast(sym)).toFixed(2) + "'>" +
					//symcount + ":" +
					delta + ":" + prefix + sym + "</td>" +
					//"</td><td style='text-align:center;cursor:pointer;' title='" + (100 * ns.stock.getForecast(sym)).toFixed(2) + "'>" + delta +
					"<td style='text-align:right;cursor:pointer;' title='" + ns.format.number(gain, "0.000a") + "'>" + ns.format.number(deltagain, "0.00a") + "</td>";
				output.appendChild(tr);
			}

		}
		let footer = document.createElement("tr");
		footer.innerHTML += "<td>Total:</td><td style='text-align:right;font-weight:bold;'>" + ns.format.number(totalmoney, "0.000a") + "</td>";
		let timestamp = document.createElement("tr");
		timestamp.innerHTML = "<td colspan='2' style='text-align:center;' id='panelboxheader'>" + gettime() + "</td>";

		output.appendChild(footer);
		output.appendChild(timestamp);

		var stockinfobtn = document.createElement("button");
		stockinfobtn.innerHTML = "Stocks info(t)";
		stockinfobtn.addEventListener("click", function (e) {
			terminalcommand("run check-stockinfo.js");
		});
		output.appendChild(stockinfobtn);
		

		panelbox(output, "stockpanel");


		await ns.sleep(3000);

		if (sellcommand) {
			try {
				console.log(sellcommand);
				eval(sellcommand);
			} catch (e) {
				console.log(e);
			}
		}


		box = havebox("stockpanel");
	}

	ns.tprint("END");
}