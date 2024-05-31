import i18next from "i18next";

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
					document.getElementById("title_text").innerText = i18next.t('step1.title_text');
        			document.getElementById("subtitle_text").innerText = i18next.t('step1.subtitle_text');
				}
				if (state.stepsComplete == 2) {
					document.getElementById("title_text").innerText = i18next.t('step2.title_text');
        			document.getElementById("subtitle_text").innerText = i18next.t('step2.subtitle_text');
				}
				if (state.stepsComplete == state.stepsPossible) {
					document.getElementById("title_text").innerText = i18next.t('step3.title_text');
        			document.getElementById("subtitle_text").innerText = i18next.t('step3.subtitle_text');
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