
const ATTR_META_DATA = {
	1: {
		sog: { index: 50, len: 10, units: 'knot' },
		cog: { index: 116, len: 12, units: 'degree' },
		rot: { index: 42, len: 8, units: 'degree/min' },
		lng: { index: 61, len: 28, units: 'degree' },
		lat: { index: 89, len: 27, units: 'degree' },
		hdg: { index: 128, len: 9, units: 'degrees' },
		status: { index: 38, len: 4 },
		accuracy: { index: 60, len: 1, units: 'meters' },
	},
	4: {
		lng: { index: 57, len: 28, units: 'degree' },
		lat: { index: 85, len: 27, units: 'degree' },
	},
	9: {
		accuracy: { index: 60, len: 1, units: 'meters' },
	},
	18: {
		sog: { index: 46, len: 10, units: 'knot' },
		cog: { index: 112, len: 12, units: 'degree' },
		rot: { index: 46, len: 8, units: 'degree/min' },
		lng: { index: 57, len: 28, units: 'degree' },
		lat: { index: 85, len: 27, units: 'degree' },
		regional: { index: 139, len: 2, units: 'uninterpreted' },
		cs: { index: 141, len: 1, units: 'boolean' },
		display: { index: 142, len: 1, units: 'boolean' },
		dsc: { index: 143, len: 1, units: 'boolean' },
		band: { index: 144, len: 1, units: 'boolean' },
		assigned: { index: 146, len: 1, units: 'boolean' },
		raim: { index: 147, len: 1, units: 'boolean' },
		radio: { index: 148, len: 20, units: 'boolean' },
	},
	21: {
		lng: { index: 164, len: 28, units: 'degree' },
		lat: { index: 192, len: 27, units: 'degree' },
	}
};

export function getMetaDataForAttributeByReport(report: number): any {
	if ([1,2,3].indexOf(report) !== -1) {
		return ATTR_META_DATA[1];
	}
	return ATTR_META_DATA[report] ? ATTR_META_DATA[report] : {};
}
