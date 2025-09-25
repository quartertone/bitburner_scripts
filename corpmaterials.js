/** @param {NS} ns **/

//corpmaterial calculator

export var materials = {
	// size of material in warehouse
	Water: 0.05,
	Energy: 0.01,
	Food: 0.03,
	Plants: 0.05,
	Metal: 0.1,
	Hardware: 0.06,
	Chemicals: 0.05,
	Drugs: 0.02,
	Robots: 0.5,
	AICores: 0.1,
	RealEstate: 0.005
};


export var industries = {
	
	Energy: { //energy
		reFac: 0.65,
		sciFac: 0.7,
		robFac: 0.05,
		aiFac: 0.3,
		advFac: 0.08,
		reqMats: {
			Hardware: 0.1,
			Metal: 0.2,
		},
	},
	Utilities: { //water
		reFac: 0.5,
		sciFac: 0.6,
		robFac: 0.4,
		aiFac: 0.4,
		advFac: 0.08,
		reqMats: {
			Hardware: 0.1,
			Metal: 0.1,
		},
	},

	Agriculture: { // plants, food
		reFac: 0.72,
		sciFac: 0.5,
		hwFac: 0.2,
		robFac: 0.3,
		aiFac: 0.3,
		advFac: 0.04,
		reqMats: {
			Water: 0.5,
			Energy: 0.5,
		},
	},

	Fishing: { //food
		reFac: 0.15,
		sciFac: 0.35,
		hwFac: 0.35,
		robFac: 0.5,
		aiFac: 0.2,
		advFac: 0.08,
		reqMats: {
			Energy: 0.5,
		},
	},

	Mining: { //metal
		reFac: 0.3,
		sciFac: 0.26,
		hwFac: 0.4,
		robFac: 0.45,
		aiFac: 0.45,
		advFac: 0.06,
		reqMats: {
			Energy: 0.8,
		},
	},

	Food: { // products
		//reFac is unique for this bc it diminishes greatly per city. Handle this separately in code?
		sciFac: 0.12,
		hwFac: 0.15,
		robFac: 0.3,
		aiFac: 0.25,
		advFac: 0.25,
		reFac: 0.05,
		reqMats: {
			Food: 0.5,
			Water: 0.5,
			Energy: 0.2,
		},
	},
	Tobacco: { //products
		reFac: 0.15,
		sciFac: 0.75,
		hwFac: 0.15,
		robFac: 0.2,
		aiFac: 0.15,
		advFac: 0.2,
		reqMats: {
			Plants: 1,
			Water: 0.2,
		},
	},
	Chemical: { //chemical
		reFac: 0.25,
		sciFac: 0.75,
		hwFac: 0.2,
		robFac: 0.25,
		aiFac: 0.2,
		advFac: 0.07,
		reqMats: {
			Plants: 1,
			Energy: 0.5,
			Water: 0.5,
		},
	},

	Pharmaceutical: { //drugs, products
		reFac: 0.05,
		sciFac: 0.8,
		hwFac: 0.15,
		robFac: 0.25,
		aiFac: 0.2,
		advFac: 0.16,
		reqMats: {
			Chemicals: 2,
			Energy: 1,
			Water: 0.5,
		},
	},

	Computer: { //hardwaro
		reFac: 0.2,
		sciFac: 0.62,
		robFac: 0.36,
		aiFac: 0.19,
		advFac: 0.17,
		reqMats: {
			Metal: 2,
			Energy: 1,
		},
	},

	Robotics: {//robots, products
		reFac: 0.32,
		sciFac: 0.65,
		aiFac: 0.36,
		advFac: 0.18,
		hwFac: 0.19,
		reqMats: {
			Hardware: 5,
			Energy: 3,
		},
	},

	Software: { //AI cores, products
		sciFac: 0.62,
		advFac: 0.16,
		hwFac: 0.25,
		reFac: 0.15,
		aiFac: 0.18,
		robFac: 0.05,
		reqMats: {
			Hardware: 0.5,
			Energy: 0.5,
		},
	},

	Healthcare: { //products
		reFac: 0.1,
		sciFac: 0.75,
		advFac: 0.11,
		hwFac: 0.1,
		robFac: 0.1,
		aiFac: 0.1,
		reqMats: {
			Robots: 10,
			AICores: 5,
			Energy: 5,
			Water: 5,
		},
	},

	RealEstate: { //realestate, products
		robFac: 0.6,
		aiFac: 0.6,
		advFac: 0.25,
		sciFac: 0.05,
		hwFac: 0.05,
		reqMats: {
			Metal: 5,
			Energy: 5,
			Water: 2,
			Hardware: 4,
		},
	},
};






/*

let multSum = 0;
for (let i = 0; i < CorporationConstants.Cities.length; ++i) {
	const city = CorporationConstants.Cities[i];
	const warehouse = this.warehouses[city];
	if (!(warehouse instanceof Warehouse)) {
		continue;
	}

	const materials = warehouse.materials;

	const cityMult =
		Math.pow(0.002 * materials.RealEstate.qty + 1, this.reFac) *
		Math.pow(0.002 * materials.Hardware.qty + 1, this.hwFac) *
		Math.pow(0.002 * materials.Robots.qty + 1, this.robFac) *
		Math.pow(0.002 * materials.AICores.qty + 1, this.aiFac);
	multSum += Math.pow(cityMult, 0.73);
}
/*
eg: Realestate 10


*/