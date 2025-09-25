/** @param {NS} ns **/

import { materials, industries } from "/corpmaterials.js";

export async function main(ns) {

	/*
	to start:

	0 - amass hacknet funds
	1 - fund corporation
	2 - expand into agriculture, food, pharma
	3 - trade hashes for research until ___ amount
		--get first:
		Bulk Purchasing	5,000
		Market-TA.I			20,000
		upgrade Fulcrum	10,000
		upgrade: Dashboard	5,000
		drones 5,000
		drones Assembly	25,000


	*/

	var refcity = "Sector-12";

	var prodcity = "Aevum";
	//ns.corporation.createCorporation(corpname, true);
	/*
		//	ns.corporation.expandIndustry("Agriculture", agridiv);
		//	var activate = false;
	//	var division = "";
		var lines = ns.args;
		while (lines.length > 0) {
			let item = lines.shift();
			switch (item) {
				case "--doit":
					activate = true;
					break;
				default:
				//	division = ns.corporation.getDivision(item);
					break;
			}
		}
	*/

	var cities = [
		"Sector-12",
		"Aevum",
		"Chongqing",
		"New Tokyo",
		"Ishima",
		"Volhaven"
	];

	var corparray = {};

	if (!ns.corporation.hasUnlockUpgrade("Smart Supply")) {
		if (ns.corporation.getCorporation().funds > ns.corporation.getUnlockUpgradeCost("Smart Supply")) {
			ns.corporation.unlockUpgrade("Smart Supply");
			if (!ns.corporation.hasUnlockUpgrade("Warehouse API")) {
				ns.alert("Remember to manually enable Smart Supply per city");
			}
		}
	}


	while (true) {

		for (const division of ns.corporation.getCorporation().divisions) {
			//division = ns.corporation.getDivision(div);

			let needcities = cities.filter(function (div) {
				return !division.cities.includes(div);
			});

			for (const city of needcities) {
				ns.corporation.expandCity(division.name, city);
				ns.tprint("Expanded " + division.name + " to " + city);
			}

			// collect data from Sector-12
			// source office
			let soffice = ns.corporation.getOffice(division.name, refcity);


			for (const city of cities) {
				let spositions = {
					Unassigned: 0,
					Operations: 0,
					Engineer: 0,
					Business: 0,
					Management: 0,
					"Research & Development": 0,
					Training: 0
				};

				let tpositions = {
					Unassigned: 0,
					Operations: 0,
					Engineer: 0,
					Business: 0,
					Management: 0,
					"Research & Development": 0,
					Training: 0
				};


				if (!ns.corporation.hasUnlockUpgrade("Warehouse API")) {
					if (ns.corporation.getCorporation().funds > ns.corporation.getUnlockUpgradeCost("Warehouse API")) {
						ns.corporation.unlockUpgrade("Warehouse API");
					}
				}

				if (city == refcity) {
					if (ns.corporation.hasUnlockUpgrade("Smart Supply")) {
						ns.corporation.setSmartSupply(division.name, refcity, true);
					}
					continue;
				}

				// target office
				let toffice = ns.corporation.getOffice(division.name, city);

				for (const emp of toffice.employees) {
					tpositions[ns.corporation.getEmployee(division.name, city, emp).pos]++;
				}

				if (division.makesProducts && city == prodcity) {
					let producing = 0;
					for (const prod of division.products) {
						if (ns.corporation.getProduct(division.name, prod).developmentProgress < 100) producing++;
					}
					if (producing) {
						let empcount = ns.corporation.getOffice(division.name, prodcity).employees.length;
						let empop = Math.floor(empcount / 2);
						let empeng = empcount - empop;

						if (empop != tpositions["Operations"] && empeng != tpositions["Engineer"]) {
							//unassign for product development
							for (const pos in spositions) {
								await ns.corporation.setJobAssignment(division.name, prodcity, pos, 0);
							}
							// then assign half/half Operations/Engineer

							await ns.corporation.setJobAssignment(division.name, prodcity, "Operations", empop);
							await ns.corporation.setJobAssignment(division.name, prodcity, "Engineer", empeng);
							ns.tprint(division.name + ": " + prodcity + ": Op and Eng assigned for product dev");

							//skip job assignments if we are in product development in this city
						}
						continue;
					}
				}

				// Upgrade office size to match source city
				if (toffice.size < soffice.size &&
					ns.corporation.getCorporation().funds >
					ns.corporation.getOfficeSizeUpgradeCost(division.name, city, soffice.size - toffice.size)
				) {
					ns.corporation.upgradeOfficeSize(division.name, city, (soffice.size - toffice.size));
				}

				// if there is space for employees, hire some
				if (toffice.employees.length < toffice.size &&
					toffice.employees.length < soffice.employees.length) {
					let empcount = 0;
					ns.tprint("Employee diff " + soffice.employees.length + " - " + toffice.employees.length);

					for (var i = 0; i < soffice.employees.length - toffice.employees.length; i++) {
						ns.corporation.hireEmployee(division.name, city);
						empcount++;
					}
					if (empcount) ns.tprint(city + ": Hired " + empcount + " employees");
				}

				// count number of employees in each position, in source city
				for (const emp of soffice.employees) {
					spositions[ns.corporation.getEmployee(division.name, refcity, emp).pos]++;
				}

				//unassign first
				for (const pos in spositions) {
					if (pos == "Unassigned") continue;
					if (spositions[pos] < tpositions[pos]) {
						ns.tprint(division.name + ": " + city + ": removing employees from " + pos);
						await ns.corporation.setJobAssignment(division.name, city, pos, 0);
					}
				}

				if (tpositions["Unassigned"]) {
					// then auto assign according to count in source office
					for (const pos in spositions) {
						if (pos == "Unassigned") continue;
						//ns.tprint(pos + " " + spositions[pos] + " ?? " + tpositions[pos]);
						if (spositions[pos] != tpositions[pos]) {
							ns.tprint(division.name + ": " + city + ": reassigning jobs: " + pos + ": " + spositions[pos]); await ns.corporation.setJobAssignment(division.name, city, pos, spositions[pos]);

						}
					}
				}


				//get warehouse if none
				if (!ns.corporation.hasWarehouse(division.name, city)) {
					ns.corporation.purchaseWarehouse(division.name, city);
					ns.tprint(division.name + ", " + city + ": purchased warehouse");
				}


				if (ns.corporation.hasUnlockUpgrade("Smart Supply")) {
					ns.corporation.setSmartSupply(division.name, city, true);
				}

				//upgrade warehouse to match
				let warehousediff = ns.corporation.getWarehouse(division.name, refcity).level - ns.corporation.getWarehouse(division.name, city).level;

				if (warehousediff > 0 &&
					ns.corporation.getCorporation().funds > ns.corporation.getUpgradeWarehouseCost(division.name, city, warehousediff)) {
					ns.corporation.upgradeWarehouse(division.name, city, warehousediff);
					ns.tprint(division.name + ", " + city + ": warehouse upgraded " + warehousediff + " levels");
				}


				// PRoducts: selling, buying, amount, prod, market TA
				// only need to do this in one city? but other things need to be done in all cities
				if (//city == prodcity && 
					division.makesProducts && division.products.length > 0) {

					for (const prodname of division.products) {
						//ns.tprint("Manipulating product " + prodname + " of " + division.name);
						let thisprod = ns.corporation.getProduct(division.name, prodname);
						if (thisprod.sCost != "MP") {
							ns.tprint("Selling product " + prodname + " of " + division.name);
							ns.corporation.sellProduct(division.name, city, prodname, "MAX", "MP", true);
						}
/*
// FIXME TODO STARTHERE
						if (thisprod.cityData[city][0] > 0 &&
							thisprod.cityData[city][1] > thisprod.cityData[city][1]) {
								ns.corporation.limitProductProduction(division.name,city, prodname, thisprod.cityData.
						}
						*/

						if (ns.corporation.hasResearched(division.name, "Market-TA.I") && typeof corparray[division.name + prodname + "I"] === "undefined") {
							ns.corporation.setProductMarketTA1(division.name, prodname, true);
							ns.tprint("setting Market I for " + prodname + " in " + city + ":" + division.name);
							corparray[division.name + prodname + "I"] = true;
						}
						if (ns.corporation.hasResearched(division.name, "Market-TA.II") && typeof corparray[division.name + prodname + "II"] === "undefined") {
							ns.corporation.setProductMarketTA2(division.name, prodname, true);
							ns.tprint("setting Market II for " + prodname + " in " + city + ":" + division.name);
							corparray[division.name + prodname + "II"] = true;
						}

					}
				}


				// materials : selling, buying, amount, prod, market TA
				for (const matter in materials) {
					let thismatter = ns.corporation.getMaterial(division.name, city, matter);

					if (thismatter.prod > 0) {
						//	ns.tprint(division.name + " " + city + " "+ matter + " "+ thismatter.sell + " "+thismatter.sCost);
						if (thismatter.sCost != "MP") {
							ns.corporation.sellMaterial(division.name, city, matter, "MAX", "MP");
							//ns.tprint("selling "+ matter + " in " + city + " for MAX");
						}

						// set Market-TA for materials in production
						if (ns.corporation.hasResearched(division.name, "Market-TA.I") && typeof corparray[division.name + city + matter + "I"] === "undefined") {
							ns.corporation.setMaterialMarketTA1(division.name, city, matter, true);
							ns.tprint("setting Market I for " + matter + " in " + city + ":" + division.name);
							corparray[division.name + city + matter + "I"] = true;
						}
						if (ns.corporation.hasResearched(division.name, "Market-TA.II") && typeof corparray[division.name + city + matter + "II"] === "undefined") {
							ns.corporation.setMaterialMarketTA2(division.name, city, matter, true);
							ns.tprint("setting Market II for " + matter + " in " + city + ":" + division.name);
							corparray[division.name + city + matter + "II"] = true;
						}

						// refcity is skipped in loop, so must also specify here
						if (ns.corporation.hasResearched(division.name, "Market-TA.I") && typeof corparray[division.name + refcity + matter + "I"] === "undefined") {
							ns.corporation.setMaterialMarketTA1(division.name, refcity, matter, true);
							ns.tprint("setting Market I for " + matter + " in " + refcity + ":" + division.name);
							corparray[division.name + refcity + matter + "I"] = true;
						}
						if (ns.corporation.hasResearched(division.name, "Market-TA.II") && typeof corparray[division.name + refcity + matter + "II"] === "undefined") {
							ns.corporation.setMaterialMarketTA2(division.name, refcity, matter, true);
							ns.tprint("setting Market II for " + matter + " in " + refcity + ":" + division.name);
							corparray[division.name + refcity + matter + "II"] = true;
						}

					} else if (thismatter.prod == 0) {
						//ns.tprint(division.name + " " + city + " "+ matter + " "+ thismatter.qty + " "+rsCost);

						let refqty = ns.corporation.getMaterial(division.name, refcity, matter).qty;
						let qty = thismatter.qty;
						let need = refqty - qty;
						if (need > 0
							&& ns.corporation.hasResearched(division.name, "Bulk Purchasing") && ns.corporation.getCorporation().funds >
							ns.corporation.getMaterial(division.name, city, matter).cost * need) {
							try {
								ns.corporation.bulkPurchase(division.name, city, matter, need);
								ns.tprint("Bulk " + division.name + ": " + city + ": "
									+ "ref " + refqty + " - " + "toqty " + qty
									+ " = " + need + " " + matter);

							} catch (e) {
								ns.tprint("Purchase failed " + division.name + ": " + city + ": "
									+ "ref " + refqty + " - " + "toqty " + qty
									+ " = " + need + " " + matter);
							}
						}
					}
				}
			}
		}
		await ns.sleep(10000);
	}
}
