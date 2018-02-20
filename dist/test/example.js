"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../lib/index");
var rawMsg = process.env.AIS || '!AIVDM,1,1,,A,13u?etPv2;0n:dDPwUM1U1Cb069D,0*24';
var aisDecoder = new index_1.Decoder(rawMsg);
