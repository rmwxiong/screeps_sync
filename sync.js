/*
* sync and control script for screeps game by abnessor@gmail.com
* licence: GPLv3
* write based on laverdet gist https://gist.github.com/laverdet/b67db14ccc8520abea2c
*/

"use strict";
var port = 9090; // port
var host = 'localhost.doomcalc.com'; // A 127.0.0.1
// if watch dir does not exists, it set to '.'
var watchDir = 'scripts'; // dir with your scripts
var includeRegexp = /\.js$/; // only *.js
var excludeRegexp = /^sync\d*\.js$/; // exclude same name(sync.js)
var replaceRegexp = /\..+$/; // strip extensions from modules names
var showDebug = true;

// keys valid only for localhost.doomcalc.com (A 127.0.0.1)
// Issued free by WoSign
// Expires on 15-08-18
var options = {
  key: `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAw493k23259VyYo4RlDG1xZ9g0pNZL8Dcg2Lc66eTBE+SMZWE
5zJb7aBeANiFxksKyHiF8TJjdykhoOqxZwB+A4KBMqdkAdRJrsWLRPPyP7ubRNWM
6yUL+f8C40GC+2eGERCTIIGLRZKcORrspXrRw6aFBA/wBqZ03OvTZiJyOd6AJa7J
IIUl85cfCJte9dMn9kzi+3/xNmHHJU/5MeIvuGpRqFHWiNbgrdUjidoRoe+buIzW
8Ew+awYVlPvMCNxYAVDjp1OL+tvWW8ln7vuBDuZaXuO8UPzPovRCKa1mG8G8sjun
3Ro9WNC9zveCi3ASVKVaYvIxGFmKzx1etZMhHwIDAQABAoIBAH4kL2xAdQ/LZXHe
08X0XpxvloOdmdysmVCCV6AFwlX4gYNMP6Lln9hiJeCDyZ5DT1xKKZOP/gqh1Fg4
ql+XOLFI389tm5t2dGSwdYnvlKW5fIjk+nW+ur/x1soButwxRZACUfSYut4QmIZZ
MKX42A9MfOZG5XtUqXLLBtwNggKCuvpWjxsNf1JD2QhYMefVQ1yFXe4Cvxm4nPvn
A0zfIDUMNtWQxGOCnlXDE3Fn6WpVG6eK5VUvljdNQkdjFL2mru1DJsE72TK3iTYL
3bB10Yg73QoWUoWpnSC0SC/sO4vft7N9UZHuLoudfcMzgnln2v32WCqOKYHDoOJl
5qLYfBECgYEA5r3Av189Qk9aq1aIc4uwEHEt2nKymOaB/n0cCdx8Ul4S0GjLN+Jr
8uXTrQVmDMToKws81G79VIGRP53xVbY/wls+TQpcJTYQg5eDLci5j8LZ8j0CMz36
LJr4OYCVnu/TfujH1+AUEg6kbwoqktv3SUhEagtI4Bqq6OgsvXue1pkCgYEA2PfQ
baF+9Yam9G4jQb86Jsar8dvg6rjZMmIpH7oOW1aYw4G+Qun7qLxmcYS0lO5hzMht
avl5uGM+Q0aTmMIOK83xqyJZdivkHEW8gYvV9EnRSBdMl/QhbRoI2tKGTpepvWg8
wIhDJJAZnGUS2/+QmDocUBk5LF2O1c0BAr7kYHcCgYABTmOv8acUIATgYW4GUW0e
urVKvkl6ihuESEsHV0Mw6C1tFprH5zU7O8fV++jW+6pgzAB9J1+xwcYDuS4rkQuN
WxzgLMXWxBaV2B66/J7oTG8Vavj/N0OaSwpKsQqnyq3E0yaGd1NFwuV1Z3ZUPICK
3qjcfNHdyujaxq2yKOf+SQKBgFF/XFohxFejeYjs6e9jTguMqr+RcP2Z63PCbWIO
eCAU+hLN5FKsIyxxgCV5zH74v+G1E2yQQwlgtd19YCmMEtifZfx7TZFW0TtRcopS
pU46gBMNNWcKe5fIpLTVST+yNj8ALXnAdUABpK0bRic+6uhTQ5lOsCwbBHEIrS2D
2LLnAoGAEKdFoDpn7PoLqPTnZp7rTBgEf/LpiNexfbhldQ4xWDUD+G84YqF0a44n
kEQwErHkVkZ+IobhQWjB1VsAIa36dPvrNa1FivX7o0XE5juYv2/Vj9GjEEZl7w02
Cm3WHjUSlGHu9pXaXGewfl1c134X2ePLxp92MDPXX1O+9yeZ4j8=
-----END RSA PRIVATE KEY-----`,
	cert: `-----BEGIN CERTIFICATE-----
MIIEsTCCA5mgAwIBAgIQQqmWlzhy1V98Mnvjfv/oHTANBgkqhkiG9w0BAQsFADBV
MQswCQYDVQQGEwJDTjEaMBgGA1UEChMRV29TaWduIENBIExpbWl0ZWQxKjAoBgNV
BAMTIVdvU2lnbiBDQSBGcmVlIFNTTCBDZXJ0aWZpY2F0ZSBHMjAeFw0xNTA4MTQy
MTQxNDlaFw0xODA4MTQyMTQxNDlaMCExHzAdBgNVBAMMFmxvY2FsaG9zdC5kb29t
Y2FsYy5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDDj3eTbfbn
1XJijhGUMbXFn2DSk1kvwNyDYtzrp5MET5IxlYTnMlvtoF4A2IXGSwrIeIXxMmN3
KSGg6rFnAH4DgoEyp2QB1EmuxYtE8/I/u5tE1YzrJQv5/wLjQYL7Z4YREJMggYtF
kpw5GuyletHDpoUED/AGpnTc69NmInI53oAlrskghSXzlx8Im1710yf2TOL7f/E2
YcclT/kx4i+4alGoUdaI1uCt1SOJ2hGh75u4jNbwTD5rBhWU+8wI3FgBUOOnU4v6
29ZbyWfu+4EO5lpe47xQ/M+i9EIprWYbwbyyO6fdGj1Y0L3O94KLcBJUpVpi8jEY
WYrPHV61kyEfAgMBAAGjggGvMIIBqzALBgNVHQ8EBAMCBaAwHQYDVR0lBBYwFAYI
KwYBBQUHAwIGCCsGAQUFBwMBMAkGA1UdEwQCMAAwHQYDVR0OBBYEFJgc9OZDInAK
ObaRdZSDK5w0EdlWMB8GA1UdIwQYMBaAFNKnFiB8r9mVnutDChny4Ll0DqjHMH0G
CCsGAQUFBwEBBHEwbzA0BggrBgEFBQcwAYYoaHR0cDovL29jc3A2Lndvc2lnbi5j
b20vY2E2L3NlcnZlcjEvZnJlZTA3BggrBgEFBQcwAoYraHR0cDovL2FpYTYud29z
aWduLmNvbS9jYTYuc2VydmVyMS5mcmVlLmNlcjA9BgNVHR8ENjA0MDKgMKAuhixo
dHRwOi8vY3JsczYud29zaWduLmNvbS9jYTYtc2VydmVyMS1mcmVlLmNybDAhBgNV
HREEGjAYghZsb2NhbGhvc3QuZG9vbWNhbGMuY29tMFEGA1UdIARKMEgwCAYGZ4EM
AQIBMDwGDSsGAQQBgptRBgECAgEwKzApBggrBgEFBQcCARYdaHR0cDovL3d3dy53
b3NpZ24uY29tL3BvbGljeS8wDQYJKoZIhvcNAQELBQADggEBADrT5aemyqS+vT8N
50gnpydAqX+Ksd/v/tkV1LXI3xbjoAtqHSILL9oXn+yh30YhoIizAtLb2SoO4CJQ
2OXT32wXxwg1+mfiY3EjUYPor0FRjHCn1k0TwXrGYtFRuSZajusngeRFN1i+bNYo
2bCocrvxGOXqBVsKQJU9AGzothJDTI7ZQnd3R0LNuaSbixcDIQ9S4zWE/ImfdG4c
wn3p88hDXO6jCVVDH9R2Sdf1jk61YeWTRaxU/Bod2nvqPpmUvnB9RBDqOYoV4nSf
rt7UjuVxox0/2paDayeIz6jnJbiQht6qiJqUErzg/45RZlwn88fUKlp3d8Njl8N3
mpVLj14=
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
MIIFrDCCA5SgAwIBAgIQOPZFweJdkSzOOys5EjF0DTANBgkqhkiG9w0BAQsFADBV
MQswCQYDVQQGEwJDTjEaMBgGA1UEChMRV29TaWduIENBIExpbWl0ZWQxKjAoBgNV
BAMTIUNlcnRpZmljYXRpb24gQXV0aG9yaXR5IG9mIFdvU2lnbjAeFw0xNDExMDgw
MDU4NThaFw0yOTExMDgwMDU4NThaMFUxCzAJBgNVBAYTAkNOMRowGAYDVQQKExFX
b1NpZ24gQ0EgTGltaXRlZDEqMCgGA1UEAxMhV29TaWduIENBIEZyZWUgU1NMIENl
cnRpZmljYXRlIEcyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA47SA
DmswUIIvH+edv/h8QiXtrmHE64aHI38RH8CTXxuSkB53jLx29/sKpdV9rNxLGNhY
Lt9GazQPRWRghMLrmg5R1CpUUT4nO2Rohm98awA8mfZMqEUnraXLKzftWcNSTE/e
NJzyt9H6WMvlYp5VRly3xY04JDXvlyx8ZRAN75+XCNXlsxJ6kt3+iA+PpK+9xdY2
90Eb6Fndhv81v+3k0aCTblGomcvf3b5xiMPasWXMe5XEZo++TgZ/m1OMazzOlyaC
Hxcwuj/I3swLobTvEj2Tywgw5xqYl4A6JoSP/nN0lVMPUbKqiVf0lkByEx3kZ5hO
j8ZAC/UdDEUt4NWSgwIDAQABo4IBdjCCAXIwDgYDVR0PAQH/BAQDAgEGMB0GA1Ud
JQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDATASBgNVHRMBAf8ECDAGAQH/AgEAMDAG
A1UdHwQpMCcwJaAjoCGGH2h0dHA6Ly9jcmxzMS53b3NpZ24uY29tL2NhMS5jcmww
cgYIKwYBBQUHAQEEZjBkMCcGCCsGAQUFBzABhhtodHRwOi8vb2NzcDEud29zaWdu
LmNvbS9jYTEwOQYIKwYBBQUHMAKGLWh0dHA6Ly9haWExLndvc2lnbi5jb20vY2Ex
ZzItc2VydmVyMS1mcmVlLmNlcjAdBgNVHQ4EFgQU0qcWIHyv2ZWe60MKGfLguXQO
qMcwHwYDVR0jBBgwFoAU4WbPDtHxs0u3BiAU/ocS1fb++z4wRwYDVR0gBEAwPjA8
Bg0rBgEEAYKbUQYBAgIBMCswKQYIKwYBBQUHAgEWHWh0dHA6Ly93d3cud29zaWdu
LmNvbS9wb2xpY3kvMA0GCSqGSIb3DQEBCwUAA4ICAQCWWt+WkRdokF0vtDIVgAMD
C+kct3Ns2qj6lN3dPjQrLoCTbPqmZ9MbeoJBzp7/P++yg2qe/DL9RPOCZqrPRC+z
N0HweRLjAieGSJK+z1bXy9fnHiWdQdsK5zMSWK2V2J7Ut5Upuv7/34Ckd1sVYg9p
+IdtdOqFonZdn5UuA7yK+YqsgWRQ8gtFS+yXMDl05ad+FiRiK1DxXNhPzS6iGCWj
zvYfYN0V3iAVGw5/r4XZQKwHKjTdUbAaqOYOn1/bRnDm9dklHPAd5UKhLSKdbhHJ
jaZlvA6qdnPIVmAv+z+GuaX1M+/VEx9JTDgHnlkiWsdO2SUkulNw/GMqVFHrw0tB
feToPCyldlq/2UyoDa5SbqVdmD1skG14H8NwlYYHP1Tj6oqBZGKajzGveyp+kiLD
jsxTrMecmRErSD9ScStuwOGzCuUDYteJGChMCo0/C0WJgYuIpJPCf0TlHltAAPwv
zDv4ankx/UQUto9IhUyrCp27Nwr8URng/llqO49gYqcHgq8IZqDy2mAC6tg0fldx
obX+adf73Vqc8//E6s10+pRw01iSzq8S5G7r3bivHeJl1EbqCz7jaA4KTCeDUJEG
xnv4+psm7SwOZ7hs5SyYbV96KMOEPAMN9+ID4ZTCWCf4TYFZL/F8YclXXb3cnIDQ
ZN98h3iF5pSLcIsFR+TIew==
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
MIIGXDCCBESgAwIBAgIHGcKFMOk7NjANBgkqhkiG9w0BAQsFADB9MQswCQYDVQQG
EwJJTDEWMBQGA1UEChMNU3RhcnRDb20gTHRkLjErMCkGA1UECxMiU2VjdXJlIERp
Z2l0YWwgQ2VydGlmaWNhdGUgU2lnbmluZzEpMCcGA1UEAxMgU3RhcnRDb20gQ2Vy
dGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMDYwOTE3MjI0NjM2WhcNMTkxMjMxMjM1
OTU5WjBVMQswCQYDVQQGEwJDTjEaMBgGA1UEChMRV29TaWduIENBIExpbWl0ZWQx
KjAoBgNVBAMTIUNlcnRpZmljYXRpb24gQXV0aG9yaXR5IG9mIFdvU2lnbjCCAiIw
DQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAL3Kjay4kRVWl3trXHrC3mvZobDD
ECP6p6GyzDH6PtmmKW8WPeBr+LhAX9s5qAB6i6BNVH3CInj8jgm4qIXXzJWXS3TY
nn7wAOQOia5JKEQaEJkyDyWIU6QNsw8SCBYLA3EnHH/h29L9Z2jEBV0KDl1w19iX
oLxTQZqRjfSeNmZ6flbBkF/msWggNqSMJCwsRwtZdmYwtb7e7Y/4ndO7ATDm8vMO
4CySgPOF+SiKtFQumu33dvwVaBbrSmzrLhKP1M/+DMdcHQt+BTK+XrAJKkLVyU6Q
s1kNu3p+zdUIWrR/2BxpEfknD3sGr1SDGHvh3VR6UWhud/zGv1JKZkahsmcau6NP
d6C+Xf/8VgtDcneQyp758jn1Dan06tfnsxAvMEI3IcwwcMmGmA/MWE2Du33lGqU3
jbasMpcAOmNxJB6eN8T/dNQ3wOL+iEZgEd0IP1A2q7h6pJViam6wymohWmnz8/sd
cDmV86dupoGJoYjFO3HKo1Lug7v9oHf05G/nQtttSpmKNEi8F9zkgAgitvIxwD8E
PuufIHnWuAZkZAIx16nNUvuERWkJACrcVYvEBkZLwEodCVs5KP2pq84A+S5ISybm
MEylWMq0RIJP55EeM8Owk/8R/IHSyh9xKd12T5Ilrx2Btw8vjMMGzC8no0rkDpm6
fB5FH3+qGUWW/fw9AgMBAAGjggEHMIIBAzASBgNVHRMBAf8ECDAGAQH/AgECMA4G
A1UdDwEB/wQEAwIBBjAdBgNVHQ4EFgQU4WbPDtHxs0u3BiAU/ocS1fb++z4wHwYD
VR0jBBgwFoAUTgvvGqRAW6UXaYcwyjRoQ9BBrvIwaQYIKwYBBQUHAQEEXTBbMCcG
CCsGAQUFBzABhhtodHRwOi8vb2NzcC5zdGFydHNzbC5jb20vY2EwMAYIKwYBBQUH
MAKGJGh0dHA6Ly9haWEuc3RhcnRzc2wuY29tL2NlcnRzL2NhLmNydDAyBgNVHR8E
KzApMCegJaAjhiFodHRwOi8vY3JsLnN0YXJ0c3NsLmNvbS9zZnNjYS5jcmwwDQYJ
KoZIhvcNAQELBQADggIBALZt+HD74g1MmLMHSRX1BMRsysr1aKAI/hJtnAQGya2a
kVI+eMRc7p9UHe7j8V4wyUnhOeCmnTZsV/rmNE9V6IeoLN0F8VgSkejKzih4j98H
hQGl3EWWBdSAsisFmsuapYvgOmfmc0e+Sv0nsYjv5srPjQ4mn/pfV3itbf6umzUI
scO6wQBKS30Uvffx01UYrNAzcIhtxAlxFKYrT4iB5wsAN6kVfX7XAZY/L697Yq4K
Sr9LOS41EIv+BDnkPDoMCVZAOrX0wmgMtflSze6d+Jj8eOdYR48cc1hpM6v/3d+O
JAF3mBk6sGZ5vOEIow5PwQSz8wHI69NZHDXSkx5wZYJ/28/7yJkSYMNEbzqAS9e+
IaoUemTL3TdDRVsyLkXw2VkfaxjwfOlVNhlhX7V98Y29iOR1S5jdJ7DkhEQqYYRX
BYIRH6o1WPMgDq9Z7/pVcnINJtCbU0mszjcuZWH/9uwb6vbxptPRtXu+NfQiwbyN
Ab1oXoMNL+zW2mMMJ9FUPuSo085LMriRlP/7W0ktdRiounGaO67ZwKlPh5Hti3tr
IJiJOYNPgMRpzBfJyE6+5KmlgXZwBgQyzYNl9Lx9PhO80uhvY6q1O9qNhjKCeJ3Z
zP+/V2R07Sg9RGIVYUv3lLANKmcc8MubpZK/+EFawT1g7Z+7uG2bzqlqFj9+6gbx
-----END CERTIFICATE-----
`,
};

// ################################################################################
// static files

// help
var helpString0 = `https://${host}:${port}/`;
var helpString1 = `// Paste code into JS debug console (*not* console tab):`;
var helpString2 = `window.syncJsBootstrap=function(){var s;document.body.appendChild(s=document.createElement('script'));s.className='syncjs';s.src='https://${host}:${port}/bootstrap.js';};window.syncJsBootstrap();`;
var helpString3 = `<!DOCTYPE html>
<html><head><title>sync.js by abnessor@gmail.com</title></head>
<body onload="var c=document.getElementById('code');c.focus();c.select();">
	${helpString1}<br />
	<textarea readonly="readonly" id="code" style="background-color: #eee; width: 100%" rows="3" onclick="this.select()">${helpString2}</textarea><br />
	<a href="https://chrome.google.com/webstore/detail/custom-javascript-for-web/poakhlngfciodnhlhhgnaaelnpjljija?hl=en">chrome CJS extension</a><br />
	<br />
	<a href="/bootstrap.js">/bootstrap.js</a><br />
	<a href="/log.html">/log.html</a><br />
	<a href="/modules.json">/modules.json</a><br />
	<a href="/comm.json">/comm.json</a><br />
	<a href="/style.css">/style.css</a><br />
</body></html>
`;

// style.css
var style_css = `
div.sync_js_menu {
	float: left;
	background-color: #111;
	color: #fff;
	text-transform: none;
	padding: 5px;
}
pre.syncjs-info {
	background-color: transparent;
	border: 1px solid #888;
	margin: 1px;
	padding: 1px;
	border-radius: 0px;
	color: #fff;
	font-size: 8px;
}
`;

// ################################################################################
// bootstrap.js

function bootstrap(){
	var sync = {
		addAction: function(el, caption, func, title, br){
			var that = this;
			var t = document.createElement('a');
			el.appendChild(t);
			if(br)
				el.appendChild(document.createElement('br'));
			t.href="#";
			t.onclick = function(e){func.call(that, e, this);return false;};
			t.textContent = caption;
			t.title = title;
		},
		injectCSS: function(){
			this.linkCSS = document.createElement('link');
			this.linkCSS.rel = 'stylesheet';
			this.linkCSS.type = 'text/css';
			this.linkCSS.href = "https://__HOST__:__PORT__/style.css";
			document.head.appendChild( this.linkCSS );
		},
		injectMenuItem: function(){
			document.querySelector('ul.navbar-nav')
				.appendChild( this.menu_li = document.createElement('li') );
			this.addAction(this.menu_li, 'sync menu', this.menuClick);
		},
		injectMenu: function(){
			var container = document.querySelector('.zoom-controls');
			if(!container)
				return false;
			container.appendChild( this.menu = document.createElement('div') );
			this.menu.className = "sync_js_menu";
			this.addAction(this.menu, 'close', function(){this.menu.classList.add('hidden');}, 'close menu', true);
			this.addAction(this.menu, 'reload menu', this.reload, 'reload sync js bootstrap', true);
			//this.addAction(this.menu, 'test', this.test, 'test', true);
			this.infoEl = document.createElement('pre');
			this.infoEl.className = 'syncjs-info';
			this.menu.appendChild( this.infoEl );
		},
		menuClick: function(){
			this.injectMenu();
			if(!this.menu)
				return;
			this.menu.classList.remove('hidden');
			return false;
		},
		reload: function(){
			document.head.removeChild(this.linkCSS);
			if(this.loopId)
				clearInterval(this.loopId);
			this.menu.parentNode.removeChild(this.menu);
			this.menu_li.parentNode.removeChild(this.menu_li);
			var rlist = document.querySelectorAll('.syncjs');
			for(var i=0;i<rlist.length;++i){
				var t = rlist[i];
				t.parentNode.removeChild(t);
			}
			setTimeout(function(){window.syncJsBootstrap();}, 1);
		},
		setCommand: function(cmd){
			angular.element(document.getElementsByClassName('console-input')[0]).scope().Console.command = cmd;
		},
		runCommand: function(cmd){
			this.setCommand(cmd);
			angular.element(document.getElementsByClassName('console-input')[0]).scope().Console.sendCommand();
		},
		getMessages: function(){
			var c = angular.element(document.querySelector('.console-message')).scope().Console;
			var m = c.getMessages();
			var pos = m.indexOf(this.lastMessage);
			this.lastMessage = m[m.length-1];
			if(pos !== -1)
				return m.slice(pos+1);
			else
				return m;
		},
		log: function(text){
			var c = angular.element(document.querySelector('.console-message')).scope().Console;
			var m = c.getMessages(text);
			m.push({out: true, text: 'sync.js: '+text});
		},
		fooModule: function(){
			angular.element(document.getElementsByClassName('branch-controls')[0]).scope().Script.modules.foo = '// sync.js';
			angular.element(document.getElementsByClassName('branch-controls')[0]).scope().Script.submit();
		},
		updateInfo: function(){
			if(!this.infoEl)
				return false;
			var text = '';
			for(var i in this.info){
				var t = this.info[i];
				text += i+": "+t+"\n";
			}
			this.infoEl.textContent = text;
		},
		request: function(data, func){
			var that = this;
			var body = JSON.stringify(data);
			var req = new XMLHttpRequest();
			req.open("POST", "https://__HOST__:__PORT__/comm.json", true);
			//req.setRequestHeader('Content-Type', 'application/json');
			//req.setRequestHeader('Content-length', body.length);
			//req.setRequestHeader('Connection', 'keep-alive');
			req.onreadystatechange = function(){
				if(req.readyState === 4){
					if (req.status === 200){
						var data = JSON.parse(req.responseText);
						that.handleResponse.call(that, data);
					}
				}
			};
			req.send(body);
		},
		sync: function(){
			var data = {
				mode: 'sync',
				messages: this.getMessages(),
			};
			this.request(data);
		},
		handleResponse: function(data){
			switch(data.mode){
				case 'sync':
					if(this.serverId !== data.serverId){
						this.resync(data);
					}else{
						var modules = [];
						for(var i in data.versions)
							if(this.versions[i] !== data.versions[i])
								modules.push(i);
						var req = {mode: 'read', modules: modules};
						this.request(req);
					}
					break;
				case 'read':
					var modules = angular.element(document.getElementsByClassName('branch-controls')[0]).scope().Script.modules;
					var updated = 0;
					for(var i in data.modules){
						if(data.versions[i] === this.versions[i])
							continue;
						++updated;
						if(!data.modules[i]){
							angular.element(document.getElementsByClassName('branch-controls')[0]).scope().Script.removeModule(i);
						}else
							modules[i] = data.modules[i];
						this.versions[i] = data.versions[i];
					}
					if(updated)
						angular.element(document.getElementsByClassName('branch-controls')[0]).scope().Script.submit();
					break;
			}
		},
		resync: function(data){
			this.serverId = data.serverId;
			var modules = [];
			for(var i in data.versions)
				modules.push(i);
			var req = {mode: 'read', modules: modules};
			this.request(req);

		},
		loop: function(){
			++this.info.cycles;
			this.sync();
			this.updateInfo();
		},
		test: function(){
		},
		init: function(){
			this.versions = {};
			this.serverId = 0;
			this.info = {serverId: '', cycles: 0, updates: 0,};
			this.injectCSS();
			this.injectMenuItem();
			this.injectMenu();
			console.log('sync.js initialized');
			this.log('initialized');
			this.loopId = setInterval(this.loop.bind(this), 1000);
		},
	};
	sync.init();
}

// ################################################################################
// node server

var http = require('https');
var URL = require('url');

var server = http.createServer(options, function(req, res) {
	var path = URL.parse(req.url, true);
	switch (path.pathname) {
		case '/bootstrap.js':
			res.writeHead(200, { 'Content-Type': 'text/javascript' });
			res.end('~('+bootstrap.toString().replace(/__HOST__/g, host).replace(/__PORT__/g, port)+')();');
			break;
		case '/style.css':
			res.writeHead(200, { 'Content-Type': 'text/css' });
			res.end(style_css);
			break;
		case '/comm.json':
			res.writeHead(200, {
				'Access-Control-Allow-Origin': '*',
				//'Content-Type': 'application/json'
			});
			req.body = '';
			req.on('data', function(data){
				req.body += data.toString();
			});
			req.on('end', function(){
				var data = JSON.parse(req.body);
				var answer = comm(data);
				res.end(JSON.stringify(answer));
			});
			break;
		default:
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(helpString3);
			break;
	}
});

// ################################################################################
// comm
function comm(data){
	var a = {
		mode: 'O_o',
		serverId: serverId,
		versions: versions,
	};
	switch(data.mode){
		case 'sync':
			a.mode = 'sync';
			for(var i in data.messages){
				var t = data.messages[i];
				log( (t.out ? "> " : "< ") + t.text.replace(/<br\s*\/?>/gi, "\n").replace(/\n$/,''), INFO);
			}
			break;
		case 'read':
			a.mode = 'read';
			a.modules = {};
			for(var i in data.modules){
				var mod = data.modules[i];
				a.modules[mod] = modules[mod];
			}
			var syncjs = {data: (new Date()).toISOString(), versions: versions};
			a.modules.syncjs_versions = `var syncjs = ${JSON.stringify(syncjs)}`;
			break;
	}
	return a;
}

// ################################################################################
// fs tracker

var fs = require('fs');
var Path = require('path');
var versions = {};
var modules = {};
var serverId = Math.random()*2147483647 >> 0;

if(!fs.existsSync(watchDir))
	watchDir = '.';
fs.watch(watchDir, function(event, file){
	//if(event === 'change')
	read(watchDir, file);
});

function readAll(path){
	var list = fs.readdirSync(path);
	for(var i=0; i<list.length; ++i)
		read(path, list[i]);
}

function read(path, name){
	if( !includeRegexp.test(name) || excludeRegexp.test(name) )
		return false;
	var file = Path.join(path, name);
	name = name.replace(replaceRegexp, '');
	try{
		if(fs.existsSync(file)){
			var s = fs.readFileSync(file).toString('utf-8');
			modules[name] = s;
			log(`loaded ${name}`, DEBUG);
		}else{
			modules[name] = '';
			log(`deleted ${name}`, DEBUG);
		}
		versions[name] = (versions[name] || 0) + 1;
		versions['syncjs_versions'] = (versions['syncjs_versions'] || 0) + 1;
		return true;
	}catch(e){
		return false;
	}
}

server.timeout = 0;
server.listen( port );

// ################################################################################
// console

var readline = require('readline');
var cmds = ['/quit', '/exit', '/readall'];
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	completer: function(line){
		var hits = cmds.filter(function(x){return x.indexOf(line) === 0;});
		return [hits.length ? hits : cmds, line];
	},
});

// fixme: extra space after prompt
//rl.setPrompt("\x1b[0;34m\r#");
rl.setPrompt("#");
rl.prompt();
rl.on('line', function(cmd){
	if(!cmd)
		return rl.prompt();
	var a = cmd.trim().split(' ');
	switch(a[0]){
		case '/exit':
		case '/quit':
			process.exit(0);
			break;
		case '/readall':
			readAll(watchDir);
			break;
		default:
			log(`unknown command '${a[0]}'`, ERROR);
	}
	rl.prompt();
});

rl.on('close', function(){
	process.exit(0);
});

const INFO = 1;
const LOG = 2;
const ERROR = 3;
const DEBUG = 4;
var colors = {
	1: "37",
	2: "32",
	3: "31;1",
	4: "35;1",
};
function log(text, color){
	if(!color)
		color = 1;
	if(showDebug && color === DEBUG)
		return false;
	console.log(`\x1b[0;${colors[color]}m${text}\x1b[0;34m`);
}

log(helpString0);
log(helpString1);
log(helpString2);

readAll(watchDir);
