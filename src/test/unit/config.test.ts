import * as test from "tape";

import {
  getManeuverIndicator,
  getNavStatus,
  getMessageType,
  getVesselType } from '../../lib/config/index';

test("config.getManeuverIndicator", (t) => {
  t.equal(getManeuverIndicator(0), 'Not available', 'getManeuverIndicator Pass.');
  t.equal(getManeuverIndicator(100), 'Not available', 'getManeuverIndicator Pass.');
  t.equal(getManeuverIndicator(1), 'No special maneuver', 'getManeuverIndicator Pass.');
  t.end();
});

test("config.getNavStatus", (t) => {
  t.equal(getNavStatus(1), 'At anchor', 'getNavStatus Pass.');
  t.equal(getNavStatus(10), 'Reserved for future amendment of Navigational Status for WIG', 'getNavStatus Pass.');
  t.equal(getNavStatus(20), 'Not defined (default)', 'getNavStatus Pass.');
  t.equal(getNavStatus(30), 'Not defined (default)', 'getNavStatus Pass.');
  t.end();
});


test("config.getMessageType", (t) => {
  t.equal(getMessageType(1), 'Position Report Class A', 'getMessageType Pass.');
  t.equal(getMessageType(10), 'UTC and Date Inquiry', 'getMessageType Pass.');
  t.equal(getMessageType(20), 'Data Link Management', 'getMessageType Pass.');
  t.equal(getMessageType(30), 'Unknown', 'getMessageType Pass.');
  t.equal(getMessageType(0), 'Unknown', 'getMessageType Pass.');
  t.end();
});

test("config.getVesselType", (t) => {
  t.equal(getVesselType(1), 'Not available (default)', 'getVesselType Pass.');
  t.equal(getVesselType(10), 'Not available (default)', 'getVesselType Pass.');
  t.equal(getVesselType(20), 'Wing in ground (WIG), all ships of this type', 'getVesselType Pass.');
  t.equal(getVesselType(30), 'Fishing', 'getVesselType Pass.');
  t.equal(getVesselType(0), 'Not available (default)', 'getVesselType Pass.');
  t.end();
});

