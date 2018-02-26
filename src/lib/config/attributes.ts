
const ATTR_META_DATA = {
	1: {
		sog: { index: 50, len: 10, units: 'knot' },
		cog: { index: 116, len: 12, units: 'degree' },
		rot: { index: 42, len: 8, units: 'degree/min' },
		lon: { index: 61, len: 28, units: 'degree' },
		lat: { index: 89, len: 27, units: 'degree' },
		hdg: { index: 128, len: 9, units: 'degrees' },
		status: { index: 38, len: 4 },
		accuracy: { index: 60, len: 1, units: 'meters' },
		raim: { index: 148, len: 1 }
	},
	4: {
		type: { index: 0, len: 6 },
		repeat: { index: 6, len: 2 },
		mmsi: { index: 8, len: 30 },
		year: { index: 38, len: 14 },
		month: { index: 52, len: 4 },
		day: { index: 56, len: 5 },
		hour: { index: 61, len: 5 },
		minute: { index: 66, len: 6 },
		second: { index: 72, len: 6 },
		accuracy: { index: 78, len: 1 },
		lon: { index: 79, len: 28, units: 'degree' },
		lat: { index: 107, len: 27, units: 'degree' },
		epfd: { index: 134, len: 4, units: 'See "EPFD Fix Types"' },
		raim: { index: 148, len: 1 },
		radio: { index: 149, len: 19 },
	},
	5: {
		ais_version: { index: 38, len: 2 },
		imo: { index: 40, len: 30 },
		callsign: { index: 70, len: 42 },
		shipname: { index: 112, len: 120 },
		shiptype: { index: 232, len: 8 },
		to_bow: { index: 240, len: 9, units: 'meters' },
		to_stern: { index: 249, len: 9, units: 'meters' },
		to_port: { index: 258, len: 6, units: 'meters' },
		to_starboard: { index: 264, len: 6, units: 'meters' },
		epfd: { index: 270, len: 4, units: 'EPFD Fix Types' },
		month: { index: 274, len: 4 },
		day: { index: 278, len: 5 },
		hour: { index: 283, len: 5 },
		minute: { index: 288, len: 6 },
		draught: { index: 294, len: 8 },
		destination: { index: 302, len: 120 },
		dte: { index: 422, len: 1 },
	},
	6: {
		type: { index: 0, len: 6 },
		repeat: { index: 6, len: 2 },
		mmsi: { index: 8, len: 30 },
		seqno: { index: 38, len: 2 },
		dest_mmsi: { index: 40, len: 30 },
		retransmit: { index: 70, len: 1 },
		dac: { index: 72, len: 10 },
		fid: { index: 82, len: 6 },
		data: { index: 88, len: 920 },
	},
	8: {
		type: { index: 0, len: 6 },
		repeat: { index: 6, len: 2 },
		mmsi: { index: 8, len: 30 },
		dac: { index: 40, len: 10 },
		fid: { index: 50, len: 6 },
		data: { index: 56, len: 952 },
	},
	// Type 9: Standard SAR Aircraft Position Report
	9: {
		type: { index: 0, len: 6 },
		repeat: { index: 6, len: 2 },
		mmsi: { index: 8, len: 30 },
		alt: { index: 38, len: 12 },
		sog: { index: 50, len: 10 },
		accuracy: { index: 60, len: 1, units: 'meters' },
		lon: { index: 61, len: 28 },
		lat: { index: 89, len: 27 },
		cog: { index: 116, len: 12 },
		second: { index: 128, len: 6 },
		regional: { index: 134, len: 8 },
		dte: { index: 142, len: 1 },
		assigned: { index: 146, len: 1 },
		raim: { index: 147, len: 1 },
		radio: { index: 148, len: 20 },
	},
	10: {
		type: { index: 0, len: 6 },
		repeat: { index: 6, len: 2 },
		mmsi: { index: 8, len: 30 },
		dest_mmsi: { index: 40, len: 30 }
	},
	11: {
		// Identical to message 4
	},
	12: {
		type: { index: 0, len: 6 },
		repeat: { index: 6, len: 2 },
		mmsi: { index: 8, len: 30 },
		seqno: { index: 38, len: 2 },
		dest_mmsi: { index: 40, len: 30 },
		retransmit: { index: 70, len: 1 },
		text: { index: 72, len: 936 },
	},
	13: {
		//Message type 13 is a receipt acknowledgement to
		// senders of previous messages of type 12.
		// The message layout is identical to a type 7
		// Binary Acknowledge.
	},
	14: {
		type: { index: 0, len: 6 },
		repeat: { index: 6, len: 2 },
		mmsi: { index: 8, len: 30 },
		text: { index: 40, len: 968 },
	},
	18: {
		sog: { index: 46, len: 10, units: 'knot' },
		cog: { index: 112, len: 12, units: 'degree' },
		rot: { index: 46, len: 8, units: 'degree/min' },
		lon: { index: 57, len: 28, units: 'degree' },
		lat: { index: 85, len: 27, units: 'degree' },
		regional: { index: 139, len: 2, units: 'uninterpreted' },
		cs: { index: 141, len: 1, units: 'boolean' },
		display: { index: 142, len: 1, units: 'boolean' },
		dsc: { index: 143, len: 1, units: 'boolean' },
		band: { index: 144, len: 1, units: 'boolean' },
		assigned: { index: 146, len: 1, units: 'boolean' },
		raim: { index: 147, len: 1, units: 'boolean' },
		radio: { index: 148, len: 20, units: 'boolean' },
		hdg: { index: 124, len: 9, units: 'degrees' },
		accuracy: { index: 56, len: 1 },
	},
	19: {
		sog: { index: 46, len: 10, units: 'knot' },
		accuracy: { index: 56, len: 1, units: '' },
		lon: { index: 57, len: 28, units: 'degree' },
		lat: { index: 85, len: 27, units: 'degree' },
		cog: { index: 112, len: 12, units: 'degrees' },
		hdg: { index: 124, len: 9, units: 'degrees' },
		utc: { index: 133, len: 6, units: 'seconds of utc timestamp' },
		shipname: { index: 143, len: 120, units: 'string' },
		shiptype: { index: 263, len: 8, units: 'string' },
		to_bow: { index: 271, len: 9, units: 'meters' },
		to_stern: { index: 280, len: 9, units: 'meters' },
		to_port: { index: 289, len: 6, units: 'meters' },
		to_starboard: { index: 295, len: 6, units: 'meters' },
		epfd: { index: 301, len: 4, units: '' },
		raim: { index: 305, len: 1, units: '' },
		dte: { index: 306, len: 1, units: '' },
		assigned: { index: 307, len: 1, units: '' },
		reserved: { index: 38, len: 8 }
	},
	20: {
		offset1: { index: 40, len: 12 },
		number1: { index: 52, len: 4 },
		timeout1: { index: 56, len: 3 },
		increment1: { index: 59, len: 11 },
		offset2: { index: 70, len: 12 },
		number2: { index: 82, len: 4 },
		timeout2: { index: 86, len: 3 },
		increment2: { index: 89, len: 11 },
		offset3: { index: 100, len: 12 },
		number3: { index: 112, len: 4 },
		timeout3: { index: 116, len: 3 },
		increment3: { index: 119, len: 11 },
		offset4: { index: 130, len: 12 },
		number4: { index: 142, len: 4 },
		timeout4: { index: 146, len: 3 },
		increment4: { index: 149, len: 11 },
	},
	21: {
		aid_type: { index: 38, len: 5 }, // see Navaid Types
		name: { index: 43, len: 120 },
		accuracy: { index: 163, len: 1 },
		lon: { index: 164, len: 28, units: 'degree' },
		lat: { index: 192, len: 27, units: 'degree' },
		to_bow: { index: 219, len: 9, units: 'meters' },
		to_stern: { index: 228, len: 9, units: 'meters' },
		to_port: { index: 237, len: 6, units: 'meters' },
		to_starboard: { index: 243, len: 6, units: 'meters' },
		epfd: { index: 249, len: 4, units: '' },
		second: { index: 253, len: 6 },
		off_position: {},
		regional: { index: 259, len: 1 },
		raim: { index: 268, len: 1 },
		virtual_aid: { index: 269, len: 1 },
		assigned: { index: 270, len: 1 },
	},
	24: {
		partno: { index: 38, len: 2 },
		shipname: { index: 40, len: 120 },
		shiptype: { index: 40, len: 8 },
		vendorid: { index: 48, len: 18 },
		model: { index: 66, len: 4 },
		serial: { index: 70, len: 20 },
		callsign: { index: 90, len: 42 },
		to_bow: { index: 132, len: 9, units: 'meters' },
		to_stern: { index: 141, len: 9, units: 'meters' },
		to_port: { index: 150, len: 6, units: 'meters' },
		to_starboard: { index: 156, len: 6, units: 'meters' },
		mothership_mmsi: { index: 132, len: 30 },
	},
	27: {
		accuracy: { index: 38, len: 1 },
		raim: { index: 39, len: 1, units: 'boolean' },
		status: { index: 40, len: 4 },
		// Longitude: minutes/10 East positive, West negative 181000 = N/A (default)
		lon: { index: 44, len: 18, units: 'degree' },
		// Latitude: minutes/10 North positive, South negative 91000 = N/A (default)
		lat: { index: 62, len: 17, units: 'degree' },
		// Knots (0-62); 63 = N/A (default)
		sog: { index: 50, len: 10, units: 'knot' },
		// 0 to 359 degrees, 511 = not available.
		cog: { index: 85, len: 9, units: 'degree' },
		// 0 = current GNSS position 1 = not GNSS position (default)
		gnss: { index: 94, len: 1 },
	}
};

export function getMetaDataForAttributeByReport(report: number): any {
	if ([1,2,3].indexOf(report) !== -1) {
		return ATTR_META_DATA[1];
	}
	else if ([4, 11].indexOf(report) !== -1) {
		return ATTR_META_DATA[4];
	}
	return ATTR_META_DATA[report] ? ATTR_META_DATA[report] : {};
}
