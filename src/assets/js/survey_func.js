	/*  Wizard */
	jQuery(function ($) {
		"use strict";
		$("#wizard_container").wizard({
			stepsWrapper: "#wrapped",
			submit: ".submit",
			beforeSelect: function (event, state) {
				if ($('input#website').val().length != 0) {
					return false;
				}
				if (!state.isMovingForward)
					return true;
				var inputs = $(this).wizard('state').step.find(':input');
				return !inputs.length || !!inputs.valid();
			}
		}).validate({
			errorPlacement: function (error, element) {
				if (element.is(':radio') || element.is(':checkbox')) {
					error.insertBefore(element.next());
				} else {
					error.insertAfter(element);
				}
			}
		});
		//  progress bar
		$("#progressbar").progressbar();
		$("#wizard_container").wizard({
			afterSelect: function (event, state) {
				$("#progressbar").progressbar("value", state.percentComplete);
				$("#location").text("(" + state.stepsComplete + "/" + state.stepsPossible + ")");
				$("#location").attr("data-state", state.stepsComplete);
				if (state.stepsComplete == 1) {
					document.getElementById("title_text").innerText = "Configuration Globale du site";
        			document.getElementById("subtitle_text").innerText = "A cette étape, choisissez les paramètres globaux à affecter au site"
				}
				if (state.stepsComplete == 2) {
					document.getElementById("title_text").innerText = "Configuration Pour les Applications";
        			document.getElementById("subtitle_text").innerText = "A cette étape, choisissez les paramètres destinés aux applications Wazo"
				}
				if (state.stepsComplete == state.stepsPossible) {
					document.getElementById("title_text").innerText = "Résumé des Configurations";
        			document.getElementById("subtitle_text").innerText = "Vérifiez et sauvegardez vos réglages"
				}
			}
		});
		// Validate select
		$('#wrapped').validate({
			ignore: [],
			rules: {
				select: {
					required: true
				}
			},
			errorPlacement: function (error, element) {
				if (element.is('select:hidden')) {
					error.insertAfter(element.next('.nice-select'));
				} else {
					error.insertAfter(element);
				}
			}
		});
	});