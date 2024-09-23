/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*************************************!*\
  !*** ./src/assets/js/main.const.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   codec_list_text: () => (/* binding */ codec_list_text),
/* harmony export */   locale_list_wazo: () => (/* binding */ locale_list_wazo)
/* harmony export */ });
// constante codecs
const codec_list_text = `[
    {"value": "alaw", "name": "G.711 A-law"},
    {"value": "ulaw", "name": "G.711 U-law"},
    {"value": "opus", "name": "Opus"},
    {"value": "g722", "name": "G.722"},
    {"value": "g729", "name": "G.729A"},
    {"value": "h263", "name": "H.263"},
    {"value": "h264", "name": "H.264"},
    {"value": "vp8", "name": "VP8"},
    {"value": "vp9", "name": "VP9"}
]`;

// constante locales 
const locale_list_wazo = `[
    {"locale": "fr_FR", "locale_text": "French"},
    {"locale": "en_US", "locale_text": "English - US"},
    {"locale": "en_GB", "locale_text": "English - GB"},
    {"locale": "fr_CA", "locale_text": "Canadian"},
    {"locale": "es_ES", "locale_text": "Spanish"},
    {"locale": "de_DE", "locale_text": "German"},
    {"locale": "nl_NL", "locale_text": "Dutch"}
]`;
/******/ })()
;
//# sourceMappingURL=main.ccde6acb02fbaf1ca963.js.map