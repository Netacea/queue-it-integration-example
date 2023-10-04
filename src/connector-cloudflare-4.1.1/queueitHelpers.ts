const CLOUDFLARE_SDK_VERSION = "4.1.1";
declare var window: any;

// Environment variables
declare var QUEUEIT_SECRET_KEY: any;
declare var QUEUEIT_CUSTOMER_ID: any;
declare var QUEUEIT_ENQT_ENABLED: any;
declare var QUEUEIT_ENQT_VALIDITY_TIME: any;
declare var QUEUEIT_ENQT_KEY_ENABLED: any;
declare var QUEUEIT_REQ_BODY_ENABLED: any;

export function getSettingsFromVariables() {
  if (typeof (QUEUEIT_SECRET_KEY) === "undefined") {
    var settingsException = new SettingsException();
    settingsException.Type = "SecretKey";
    throw settingsException;
  }

  var secretKey: string = QUEUEIT_SECRET_KEY;

  if (typeof (QUEUEIT_CUSTOMER_ID) === "undefined") {
    var settingsException = new SettingsException();
    settingsException.Type = "CustomerId";
    throw settingsException;
  }

  var customerId: string = QUEUEIT_CUSTOMER_ID;

  var enqueueTokenEnabled: boolean = true;
  if (typeof (QUEUEIT_ENQT_ENABLED) !== "undefined") {
    enqueueTokenEnabled = Boolean(QUEUEIT_ENQT_ENABLED);
  }

  var enqueueTokenValidityTime: number = 240000;
  if (typeof (QUEUEIT_ENQT_VALIDITY_TIME) !== "undefined") {
    enqueueTokenValidityTime = Number(QUEUEIT_ENQT_VALIDITY_TIME);
  }

  var requestBodyEnabled: boolean = false;
  if (typeof (QUEUEIT_REQ_BODY_ENABLED) !== "undefined") {
    requestBodyEnabled = Boolean(QUEUEIT_REQ_BODY_ENABLED);
  }

  var enqueueTokenKeyEnabled: boolean = false;
  if (typeof (QUEUEIT_ENQT_KEY_ENABLED) !== "undefined") {
    enqueueTokenKeyEnabled = Boolean(QUEUEIT_ENQT_KEY_ENABLED);
  }

  var settings: CloudflareSettings = {
    SecretKey: secretKey,
    CustomerId: customerId,
    EnqueueTokenEnabled: enqueueTokenEnabled,
    EnqueueTokenValidityTime: enqueueTokenValidityTime,
    RequestBodyEnabled: requestBodyEnabled,
    EnqueueTokenKeyEnabled: enqueueTokenKeyEnabled
  };

  return settings;
}

export function getParameterByName(url: string, name: string) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function addConnectorPlatformVersion(redirectQueueUrl: string) {
  return redirectQueueUrl + "&kupver=cloudflare-" + CLOUDFLARE_SDK_VERSION;
}
// Based on REF 4122 section 4.4 http://www.ietf.org/rfc/rfc4122.txt
export function generateUUID(): string {
  const s: any[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  return s.join("");
}

export function hex2bin(str: string) {
  var len = str.length;
  var rv = "";
  var i = 0;

  var c1;
  var c2;

  while (len > 1) {
    let h1 = str.charAt(i++);
    c1 = h1.charCodeAt(0);
    let h2 = str.charAt(i++);
    c2 = h2.charCodeAt(0);

    rv += String.fromCharCode((_hex2bin[c1] << 4) + _hex2bin[c2]);
    len -= 2;
  }

  return rv;
}

export function bin2hex(s: string) {
  //  discuss at: https://locutus.io/php/bin2hex/
  // original by: Kevin van Zonneveld (https://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Linuxworld
  // improved by: ntoniazzi (https://locutus.io/php/bin2hex:361#comment_177616)
  //   example 1: bin2hex('Kev')
  //   returns 1: '4b6576'
  //   example 2: bin2hex(String.fromCharCode(0x00))
  //   returns 2: '00'

  var i;
  var l;
  var o = "";
  var n;

  s += "";

  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i).toString(16);
    o += n.length < 2 ? "0" + n : n;
  }

  return o;
}
// $CVSHeader: _freebeer/www/lib/bin2hex.js,v 1.2 2004/03/07 17:51:35 ross Exp $

// Copyright (c) 2002-2004, Ross Smith.  All rights reserved.
// Licensed under the BSD or LGPL License. See license.txt for details.

const _hex2bin = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, // 0-9
  0, 10, 11, 12, 13, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, // A-F
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 10, 11, 12, 13, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, // a-f
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

export interface CloudflareSettings {
  SecretKey: string,
  CustomerId: string,
  EnqueueTokenEnabled: boolean,
  EnqueueTokenValidityTime: number,
  EnqueueTokenKeyEnabled: boolean,
  RequestBodyEnabled: boolean
}

export class SettingsException {
  Type: string;
}