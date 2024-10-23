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
/*!*****************************************!*\
  !*** ./src/assets/js/main.functions.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   exportToJsonFile: () => (/* binding */ exportToJsonFile),
/* harmony export */   importJsonToLocalStorage: () => (/* binding */ importJsonToLocalStorage)
/* harmony export */ });
// Fonction pour récupérer des données du localStorage et les exporter en .json
const exportToJsonFile = (key) => {
    const jsonData = localStorage.getItem(key);
    if (jsonData) {
        const dataBlob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        // Créer un lien temporaire pour le téléchargement
        const a = document.createElement('a');
        a.href = url;
        a.download = "wazo_plugin_template.json"; // Nom du fichier de téléchargement
        document.body.appendChild(a);
        a.click(); // Simuler un clic pour télécharger le fichier
        document.body.removeChild(a); // Nettoyer le DOM
        URL.revokeObjectURL(url); // Libérer l'URL objet
    } else {
        console.log('Aucune donnée trouvée pour la clé spécifiée.');
    }
};

// Fonction pour importer un fichier JSON dans le localStorage
const importJsonToLocalStorage = (file) => {
    const reader = new FileReader();
    
    // Événement déclenché lorsque le fichier est chargé
    reader.onload = (event) => {
        try {
            const jsonData = event.target.result;
            const data = JSON.parse(jsonData); // Convertir le JSON en objet
            
            // Enregistrer les données dans le localStorage
            const key = 'template_keys'; // Choisissez une clé pour stocker les données
            localStorage.setItem(key, JSON.stringify(data));
            console.log('Données importées avec succès dans le localStorage sous la clé :', key);

            // Rafraîchir la page après l'importation
            location.reload();
        } catch (error) {
            console.error('Erreur lors de l\'importation des données :', error);
        }
    };

    // Lire le fichier en tant que texte
    reader.readAsText(file);
};
/******/ })()
;
//# sourceMappingURL=function.5a5240e39c9dd6e89486.js.map