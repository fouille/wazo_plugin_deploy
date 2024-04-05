import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import 'bootstrap/dist/css/bootstrap.min.css';

import tippy from 'tippy.js';
import 'bootstrap';
import {
    App
} from '@wazo/euc-plugins-sdk';
import "./survey_func";
// import {
//   update_sip_template_endpoint,
//   create_nice_select,
//   add_info_to_summary
// } from "./main.functions";
import {
    codec_list_text,
    locale_list_wazo
} from "./main.const";
const version = '© [AIV]{date}[/AIV] FMW - Pour Wazo Communication - [AIV]v{version}[/AIV]';
document.getElementsByClassName("copy")[0].innerHTML = version;
const clm = require('country-locale-map');
const app = new App();
export let template_sip_global_data_uuid = "";
export let template_sip_webrtc_data_uuid = "";
export let apps_list = "";
export let host;
export let tenant_uuid;
export let token_session;
let template;

const codec_list = JSON.parse(codec_list_text);
const locale_list = JSON.parse(locale_list_wazo);
export const btn_next = document.getElementsByClassName("forward");
export const btn_submit = document.getElementsByClassName("wizard_save");
const btn_template = document.getElementsByClassName("template_save");
const btn_stun = document.getElementsByClassName("active_stun_wda");
const btn_turn = document.getElementsByClassName("active_turn_ma");
const btn_active_codec = document.getElementById("active_codec_video_enable");
const btn_template_active_codec = document.getElementById("template_active_codec_video_enable");
const btn_template_remove = document.getElementsByClassName("template_remove");
const btn_template_active_template = document.getElementById("flexSwitchCheckEnableTemplate");
// FUNCTIONS

// function pour update du sip template
export async function update_sip_template_endpoint(keys) {
    document.getElementById("title_text").innerText = "Patientez";
    document.getElementById("final-step-one").innerHTML = '<i class="fa-solid fa-spinner fa-spin-pulse"></i>';
    document.getElementById("final-step-two").innerHTML = '<i class="fa-solid fa-spinner fa-spin-pulse"></i>';
    document.getElementById("final-step-three").innerHTML = '<i class="fa-solid fa-spinner fa-spin-pulse"></i>';
    let say_yes_or_no = "no";
    if (keys.nat.sip_value == "rtp_symmetric,rewrite_contact") {
        say_yes_or_no = "yes"
    };
    const api_confd_sip_temp_global_put = '/api/confd/1.1/endpoints/sip/templates/';
    const put_options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Wazo-Tenant': tenant_uuid,
            'X-Auth-Token': token_session
        },
        body: JSON.stringify({
            "endpoint_section_options": [
                ["rtp_timeout",
                    "7200"
                ],
                ["allow_transfer",
                    "yes"
                ],
                ["use_ptime",
                    "yes"
                ],
                ["callerid",
                    "wazo"
                ],
                ["direct_media",
                    "no"
                ],
                ["dtmf_mode",
                    "rfc4733"
                ],
                ["language",
                    keys.locale.sip_value
                ],
                ["inband_progress",
                    "no"
                ],
                ["rtp_timeout_hold",
                    "0"
                ],
                ["timers_sess_expires",
                    "600"
                ],
                ["timers_min_se",
                    "90"
                ],
                ["trust_id_inbound",
                    "no"
                ],
                ["allow_subscribe",
                    "yes"
                ],
                ["allow",
                    keys.codecs.sip_value
                ],
                ["rewrite_contact",
                    say_yes_or_no
                ],
                ["rtp_symmetric",
                    say_yes_or_no
                ],
                ["moh_suggest",
                    keys.moh.sip_value
                ]
            ]
        })
    };
    try {
        let promise = await fetch(host + api_confd_sip_temp_global_put + template_sip_global_data_uuid, put_options);
        if (promise == null || promise.status == 204 || promise.ok) {
            update_sip_template_webrtc_endpoint(keys)
        } else {
            // // console.log("no auth");
        }
    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}

// function pour update du sip template WEBRTC
async function update_sip_template_webrtc_endpoint(pkeys) {
    const api_confd_sip_temp_global_put = '/api/confd/1.1/endpoints/sip/templates/';
    const put_options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Wazo-Tenant': tenant_uuid,
            'X-Auth-Token': token_session
        },
        body: JSON.stringify({
            "endpoint_section_options": [
                ["webrtc",
                    "yes"
                ],
                ["max_audio_streams",
                    "1"
                ],
                ["max_video_streams",
                    "25"
                ],
                ["allow",
                    pkeys.app_codecs.sip_value
                ],
                ["dtls_auto_generate_cert",
                    "yes"
                ]
            ]
        })
    };
    try {
        let promise = await fetch(host + api_confd_sip_temp_global_put + template_sip_webrtc_data_uuid, put_options);
        if (promise == null || promise.status == 204 || promise.ok) {
            document.getElementById("final-step-one").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
            update_apps(apps_list, pkeys)
        } else {
            // // console.log("no auth");
        }
    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}

async function updateORcreate_ext_apps(name, app_keys, create_or_not) {
    const api_confd_sip_temp_global_put = '/api/confd/1.1/external/apps/' + name;
    let conf;
    let PUT_or_POST;
    if (name == "wazo-euc-application-mobile") {
        (create_or_not == 0) ? PUT_or_POST = "PUT": PUT_or_POST = "POST";
        conf = {
            "turn_servers": "[{\"urls\":\"turn:" + app_keys.app_ma.server_turn_ma + ":" + app_keys.app_ma.server_port_turn_ma + "\",\"username\":\"" + app_keys.app_ma.server_username_turn_ma + "\",\"credential\":\"" + app_keys.app_ma.server_password_turn_ma + "\"}]"
        }

    } else if (name == "wazo-euc-application-desktop" || name == "wazo-euc-application-web") {
        (create_or_not == 0) ? PUT_or_POST = "PUT": PUT_or_POST = "POST";
        conf = {
            "stun_servers": "stun:" + app_keys.app_wda.server_stun_wda + ":" + app_keys.app_wda.server_port_stun_wda
        }
    }
    const put_options = {
        method: PUT_or_POST,
        headers: {
            'Content-Type': 'application/json',
            'Wazo-Tenant': tenant_uuid,
            'X-Auth-Token': token_session
        },
        body: JSON.stringify({
            "configuration": conf,
            "label": name
        })
    };
    try {
        let promise = await fetch(host + api_confd_sip_temp_global_put, put_options);
        if (promise == null || promise.status == 204 || promise.ok) {
            // // console.log(name + ": OK");
        } else {
            // // console.log(name + ": NOK");
        }
    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}
// function pour update ou ajout une configuration d'application 
async function update_apps(apps_list, app_keys) {
    // // console.log(apps_list);
    if (apps_list.total > 0 && (app_keys.app_ma.enable == "true" || app_keys.app_wda.enable == "true")) {
        // // console.log("Etat MA = " + app_keys.app_ma.enable);
        // // console.log("Etat WDA = " + app_keys.app_wda.enable);
        let apps_items = apps_list.items;
        let apps_labell = app_keys.app_labels.activate_labels;
        for (let g = 0; g < apps_labell.length; g++) {
            // // console.log(apps_items);
            // // console.log("Demande d'app conf: "+ apps_labell[g]);
            const checkItemsExist = obj => obj.name === apps_labell[g];
            // // console.log("CHECK ITEM");
            let label_name_check = apps_items.some(checkItemsExist);
            // // console.log(label_name_check);
            // // console.log("FIN CHECK");
            let label_name = apps_labell[g];
            //je trouve un objet dans les items dapp retournés
            if (label_name_check === true) {
                // // console.log("L'app existe deja alors");
                // // console.log("BOUCLE UPDATE");       
                if (label_name == apps_labell[g]) {
                    // // console.log("boucle update label: "+label_name);
                    await updateORcreate_ext_apps(label_name, app_keys, 0)
                } else {
                    // // console.log("erreur boucle update");
                }
            } else if (label_name_check === false) {
                // // console.log("L'app N'existe PAS deja alors");
                // // console.log("BOUCLE CREATE");
                // // console.log(apps_labell[g]);
                // // console.log("boucle create label: "+apps_labell[g]);
                await updateORcreate_ext_apps(apps_labell[g], app_keys, 1)
            }
        }
    } else if (apps_list.total == 0 && (app_keys.app_ma.enable == "true" || app_keys.app_wda.enable == "true")) {
        // // console.log("il ny a pas d'app configuree : ");
        // // console.log("MA2 = " + app_keys.app_ma.enable);
        // // console.log("WDA2 = " + app_keys.app_wda.enable);
        //fonction de creation des conf dapp
        let apps_label = app_keys.app_labels.activate_labels;
        for (let h = 0; h < apps_label.length; h++) {
            // // console.log("create app : " + apps_label[h]);
            await updateORcreate_ext_apps(apps_label[h], app_keys, 1)
        }
    } else {
        // // console.log("il ny a pas d'app à configurer");
    }
    // EXIT de fin
    // Settimeout pour attendre le retour d'appel API
    setTimeout(function() {
        // let btn_submit = document.getElementsByClassName("submit");
        let btn_back = document.getElementsByClassName("backward");
        for (let element of btn_submit) {
            element.setAttribute('disabled', 'yes');
        }
        for (let element of btn_back) {
            element.setAttribute('disabled', 'yes');
        }
        document.getElementById("final-step-two").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
        document.getElementById("final-step-three").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
        document.getElementById("title_text").innerText = "Terminé !";
        document.getElementById("subtitle_text").innerText = "";
        document.getElementById("template_info_text").innerText = "";
        document.getElementById("main_question").innerText = "Configuration appliquée :"
    }, 1500);


}

//function update de niceselect
export function create_nice_select($select, tag) {
    $select.after($('<div></div>')
        .addClass('nice-select')
        .addClass($select.attr('class') || '')
        .addClass($select.attr('disabled') ? 'disabled' : '')
        .attr('tabindex', $select.attr('disabled') ? null : '0')
        .html('<span class="current"></span><ul class="list"></ul>')
    );

    var $dropdown = $select.next();
    var $options = $select.find('option');
    var $selected = $select.find('option:selected');

    $dropdown.find('.current').html($selected.data('display') || $selected.text());

    $options.each(function(i) {
        var $option = $(this);
        var display = $option.data('display');

        $dropdown.find('ul').append($('<li></li>')
            .attr('data-value', $option.val())
            .attr('data-display', (display || null))
            .addClass('option' + ' ' + tag +
                ($option.is(':selected') ? ' selected' : '') +
                ($option.is(':disabled') ? ' disabled' : ''))
            .html($option.text())
        );
    });
}

export function add_info_to_summary(data_keys) {
    // creation des balises pour la page resumé
    const check_before_send = document.getElementsByClassName("check_before_send")[0];
    const check_before_send_app = document.getElementsByClassName("check_before_send_app")[0];
    check_before_send.innerHTML = "<li><span class='font-weight-bold'> Langue :</span> " + data_keys.locale.label + "</li>" +
        "<li><span class='font-weight-bold'>Codecs activés :</span> " + data_keys.codecs.label + "</li>" +
        "<li><span class='font-weight-bold'>Musique d'attente :</span> " + data_keys.moh.label + "</li>" +
        "<li><span class='font-weight-bold'>Nat Actif :</span> " + data_keys.nat.label + "</li>";
    check_before_send_app.innerHTML = "<li><span class='font-weight-bold'>Codecs activés :</span> " + data_keys.app_codecs.label + "</li>" +
        "<li><span class='font-weight-bold'>Service STUN (Web & Desktop) :</span> " + ((data_keys.app_wda.enable === "true") ? 'Oui' : 'Non') + "</li>" +
        "<li><span class='font-weight-bold'>Service TURN (Mobile) :</span> " + ((data_keys.app_ma.enable === "true") ? 'Oui' : 'Non') + "</li>"

}

//END FUNCTIONS


tippy('[data-tippy-content]', {
    // trigger: 'click focus',
    placement: 'left-start',
    animation: 'perspective',
});

// BOUTON TEMPLATE SAVE EVENEMENT SUR CLICK
export const template_keys = {
    'template_enable': null
};
for (let element of btn_template) {
    element.addEventListener("click", function(e) {
        e.preventDefault;
        let template_enable;
        let codecs = {
            'sip_value': [],
            'label': []
        };
        let locales = {
            'sip_value': [],
            'label': []
        };
        let moh = {
            'sip_value': [],
            'label': []
        };
        let nat = {
            'sip_value': [],
            'label': []
        };
        let app_codecs = {
            'sip_value': [],
            'label': [],
            'video': []
        };
        let app_labels = {
            'activate_labels': []
        };
        let app_wda = {
            'enable': [],
            'label_web': [],
            'label_desktop': [],
            'server_stun_wda': [],
            'server_port_stun_wda': []
        };
        let app_ma = {
            'enable': [],
            'label': [],
            'server_turn_ma': [],
            'server_port_turn_ma': [],
            'server_username_turn_ma': [],
            'server_password_turn_ma': []
        };
        // recupere si template enable 
        $('.flexSwitchCheckEnableTemplate.form-check-input[type=checkbox]').each(function() {
            if (jQuery(this).is(":checked")) {
                template_enable = 'yes'
            } else {
                template_enable = 'no'
            }
        });

        // recuperer elements dans la ckeckbox codecs
        $('#template_codec_activable input[type=checkbox]:checked').each(function() {
            if (jQuery(this).is(":checked")) {
                codecs.sip_value.push($(this).val());
                // codecs.label += this.dataset.label + " ";
            }
        });
        $('#template_codec_activable_webrtc input[type=checkbox]:checked').each(function() {
            if (jQuery(this).is(":checked")) {
                app_codecs.sip_value.push($(this).val());
                // app_codecs.label += this.dataset.label + " ";
            }
        });
        // recupere si video enable webrtc
        app_codecs.video = document.getElementById("template_active_codec_video_enable").checked;

        // recuperer elements dans le select locales
        $('.template_locales.selected').each(function() {
            locales.sip_value += this.dataset.value;
            locales.label += $(this).text();
        });
        // recuperer elements dans le select moh
        // $('.moh.selected').each(function() {
        //     moh.sip_value += this.dataset.value;
        //     moh.label += $(this).text();
        // })
        // recuperer elements dans le select nat 
        let template_nat_tenant = document.getElementById("template_nat_tenant").checked;
        if (template_nat_tenant == true) {
            nat.sip_value += 'rtp_symmetric,rewrite_contact';
            nat.label += 'yes';
        } else {
            nat.sip_value += 'rtp_symmetric,rewrite_contact';
            nat.label += 'no';
        }

        let template_active_stun_wda = document.getElementById("template_active_stun_wda").checked;
        app_wda.enable += template_active_stun_wda;
        (template_active_stun_wda) ? app_labels.activate_labels.push("wazo-euc-application-web", "wazo-euc-application-desktop"): "";
        app_wda.server_stun_wda += $("input[name='template_server_stun_wda']").val();
        app_wda.server_port_stun_wda += $("input[name='template_server_port_stun_wda']").val();

        let template_active_turn_ma = document.getElementById("template_active_turn_ma").checked;
        app_ma.enable += template_active_turn_ma;
        (template_active_turn_ma) ? app_labels.activate_labels.push("wazo-euc-application-mobile"): "";
        app_ma.server_turn_ma += $("input[name='template_server_turn_ma']").val();
        app_ma.server_port_turn_ma += $("input[name='template_server_port_turn_ma']").val();
        app_ma.server_username_turn_ma += $("input[name='template_server_username_turn_ma']").val();
        app_ma.server_password_turn_ma += $("input[name='template_server_password_turn_ma']").val();

        // creation du fichier json 
        template_keys.template_enable = template_enable;
        template_keys.codecs = codecs;
        template_keys.locale = locales;
        // template_keys.keys.moh = moh;
        template_keys.nat = nat;
        template_keys.app_labels = app_labels;
        template_keys.app_codecs = app_codecs;
        template_keys.app_ma = app_ma;
        template_keys.app_wda = app_wda;
        // console.log(template_keys);
        localStorage.setItem('template_keys', JSON.stringify(template_keys))
        // Refresh the page
        location.reload();
    })
}

// BOUTON SUIVANT EVENEMENT SUR CLICK
export const dkeys = {
    'codecs': [],
    'locale': [],
    'moh': [],
    'nat': [],
    'app_codecs': [],
    'app_wda': [],
    'app_ma': []
};
for (let element of btn_next) {
    element.addEventListener("click", function(e) {
        e.preventDefault;
        // VERIFICATION DE DOMAINE SAISI pour future version
        // let getstate = document.getElementById("location");
        // let state = getstate.getAttribute('data-state')
        // let el = $("input[name='server_turn_ma']").val();
        // let re = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
        // if (state == 2) {
        //   if (re.test(el)) {
        //     console.log(true);
        //   }else{
        //     console.log(false);
        //     let myModal = new bootstrap.Modal(document.getElementById('warning-modal'), {
        //       keyboard: false
        //     })
        //     myModal.show();
        //   }
        // }


        let codecs = {
            'sip_value': ["!all"],
            'label': []
        };
        let locales = {
            'sip_value': [],
            'label': []
        };
        let moh = {
            'sip_value': [],
            'label': []
        };
        let nat = {
            'sip_value': [],
            'label': []
        };
        let app_codecs = {
            'sip_value': ["!all"],
            'label': []
        };
        let app_labels = {
            'activate_labels': []
        };
        let app_wda = {
            'enable': [],
            'label_web': [],
            'label_desktop': [],
            'server_stun_wda': [],
            'server_port_stun_wda': []
        };
        let app_ma = {
            'enable': [],
            'label': [],
            'server_turn_ma': [],
            'server_port_turn_ma': [],
            'server_username_turn_ma': [],
            'server_password_turn_ma': []
        };
        // recuperer elements dans la ckeckbox codecs
        $('#codec_activable input[type=checkbox]:checked').each(function() {
            if (jQuery(this).is(":checked")) {
                codecs.sip_value += "," + $(this).val();
                codecs.label += this.dataset.label + " ";
            }
        });
        $('#codec_activable_webrtc input[type=checkbox]:checked').each(function() {
            if (jQuery(this).is(":checked")) {
                app_codecs.sip_value += "," + $(this).val();
                app_codecs.label += this.dataset.label + " ";
            }
        });

        // recuperer elements dans le select locales
        $('.locales.selected').each(function() {
            locales.sip_value += this.dataset.value;
            locales.label += $(this).text();
        });
        // recuperer elements dans le select moh
        $('.moh.selected').each(function() {
            moh.sip_value += this.dataset.value;
            moh.label += $(this).text();
        })
        // recuperer elements dans le select nat 
        let nat_tenant = document.getElementById("nat_tenant").checked;
        if (nat_tenant == true) {
            nat.sip_value += 'rtp_symmetric,rewrite_contact';
            nat.label += 'yes';
        } else {
            nat.sip_value += 'rtp_symmetric,rewrite_contact';
            nat.label += 'no';
        }

        let active_stun_wda = document.getElementById("active_stun_wda").checked;
        app_wda.enable += active_stun_wda;
        (active_stun_wda) ? app_labels.activate_labels.push("wazo-euc-application-web", "wazo-euc-application-desktop"): "";
        app_wda.server_stun_wda += $("input[name='server_stun_wda']").val();
        app_wda.server_port_stun_wda += $("input[name='server_port_stun_wda']").val();

        let active_turn_ma = document.getElementById("active_turn_ma").checked;
        app_ma.enable += active_turn_ma;
        (active_turn_ma) ? app_labels.activate_labels.push("wazo-euc-application-mobile"): "";
        app_ma.server_turn_ma += $("input[name='server_turn_ma']").val();
        app_ma.server_port_turn_ma += $("input[name='server_port_turn_ma']").val();
        app_ma.server_username_turn_ma += $("input[name='server_username_turn_ma']").val();
        app_ma.server_password_turn_ma += $("input[name='server_password_turn_ma']").val();

        // creation du fichier json 
        dkeys.codecs = codecs;
        dkeys.locale = locales;
        dkeys.moh = moh;
        dkeys.nat = nat;
        dkeys.app_labels = app_labels;
        dkeys.app_codecs = app_codecs;
        dkeys.app_ma = app_ma;
        dkeys.app_wda = app_wda;
        // // console.log(dkeys);

        add_info_to_summary(dkeys);
    })
}

// BOUTON ENREGISTRER EVENEMENT SUR CLICK
for (let element of btn_submit) {
    element.addEventListener("click", function(e) {
        update_sip_template_endpoint(dkeys)
    })
}

// TEMPLATE BTN SUPPR
for (let element of btn_template_remove) {
    element.addEventListener("click", function() {
        localStorage.removeItem('template_keys');
        location.reload();
    })
}

// changement codec pour video 
btn_active_codec.addEventListener("change", function() {
    let check_btn = document.getElementById("active_codec_video_enable").checked;
    document.getElementsByClassName("vp8")[0].checked = check_btn;
    document.getElementsByClassName("vp9")[0].checked = check_btn;
    document.getElementsByClassName("h264")[0].checked = check_btn;

})
btn_template_active_codec.addEventListener("change", function() {
    let check_btn = document.getElementById("template_active_codec_video_enable").checked;
    document.getElementsByClassName("vp8")[1].checked = check_btn;
    document.getElementsByClassName("vp9")[1].checked = check_btn;
    document.getElementsByClassName("h264")[1].checked = check_btn;

})
btn_template_active_template.addEventListener("change", function() {
    (btn_template_active_template.checked == false) ?
    document.getElementById("flexSwitchCheckEnableTemplate_label").classList.add("text-danger", "fw-bold"):
        document.getElementById("flexSwitchCheckEnableTemplate_label").classList.remove("text-danger", "fw-bold");
})

// changement etat select stun 
for (let element_stun of btn_stun) {
    let server_stun_wda = document.getElementsByName("server_stun_wda");
    let server_port_stun_wda = document.getElementsByName("server_port_stun_wda");
    element_stun.onchange = () => {
        for (let box_server_stun_wda of server_stun_wda) {
            box_server_stun_wda.classList.toggle("required");
        }
        for (let box_server_port_stun_wda of server_port_stun_wda) {
            box_server_port_stun_wda.classList.toggle("required");
        }
        $(".server_stun_wda, .server_port_stun_wda").toggle('show');
    }
}

// changement etat select turn 
for (let element_turn of btn_turn) {
    let server_turn_ma = document.getElementsByName("server_turn_ma");
    let server_port_turn_ma = document.getElementsByName("server_port_turn_ma");
    let server_username_turn_ma = document.getElementsByName("server_username_turn_ma");
    let server_password_turn_ma = document.getElementsByName("server_password_turn_ma");
    element_turn.onchange = () => {
        for (let box_server_turn_ma of server_turn_ma) {
            box_server_turn_ma.classList.toggle("required");
        }
        for (let box_server_port_turn_ma of server_port_turn_ma) {
            box_server_port_turn_ma.classList.toggle("required");
        }
        for (let box_server_username_turn_ma of server_username_turn_ma) {
            box_server_username_turn_ma.classList.toggle("required");
        }
        for (let box_server_password_turn_ma of server_password_turn_ma) {
            box_server_password_turn_ma.classList.toggle("required");
        }
        $(".server_turn_ma, .server_port_turn_ma, .server_username_turn_ma, .server_password_turn_ma").toggle('show');
    }
}

(async () => {
    await app.initialize();
    const context = app.getContext();
    tenant_uuid = context.app.extra.tenant;
    host = 'https://' + context.app.extra.instance.host;
    token_session = context.app.extra.instance.session.token;

    const api_auth_tenant_read = '/api/auth/0.1/tenants?offset=0';
    const api_confd_moh = '/api/confd/1.1/moh?recurse=false';
    const api_confd_sip_temp_global_get = '/api/confd/1.1/endpoints/sip/templates?recurse=false&search=global';
    const api_confd_sip_temp_webrtc_get = '/api/confd/1.1/endpoints/sip/templates?recurse=false&search=webrtc';
    const api_confd_apps_get = '/api/confd/1.1/external/apps?recurse=false';

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Wazo-Tenant': tenant_uuid,
            'X-Auth-Token': token_session
        }
    };
    // appel api pour connaitre le nom du tenant et lexposer dans la page d'accueil
    const client_site_name = await fetch(host + api_auth_tenant_read, options).then(response => response.json());
    // appel api pour lister le template SIP Global et exposer les variables dans la page d'accueil 
    const template_sip_global_data = await fetch(host + api_confd_sip_temp_global_get, options).then(response => response.json());
    // appel api pour lister le template SIP WEBRTC et exposer les variables dans la page d'accueil 
    const template_sip_webrtc_data = await fetch(host + api_confd_sip_temp_webrtc_get, options).then(response => response.json());
    // appel api pour lister les noms et uuid des musiques dattente
    const moh_list = await fetch(host + api_confd_moh, options).then(response => response.json());
    // appel api pour liste les configuration dapp existante
    apps_list = await fetch(host + api_confd_apps_get, options).then(response => response.json());
    // // console.log(apps_list);

    // traitement si configuration app existe pour affichage sur page accueil
    let dock_value_apps = "";
    if (apps_list.total > 0) {
        let apps_items = apps_list.items;
        for (let g = 0; g < apps_items.length; g++) {
            (apps_items[g].name == "wazo-euc-application-mobile") ? dock_value_apps += "Wazo Mobile" + " ": '';
            (apps_items[g].name == "wazo-euc-application-web") ? dock_value_apps += "Wazo Web" + " ": '';
            (apps_items[g].name == "wazo-euc-application-desktop") ? dock_value_apps += "Wazo Desktop" + " ": '';
        }
    }

    ////// TEMPLATE : application des paramètres enregistrés

    //CONSTRUCTOR
    if ("template_keys" in localStorage) {
        template = JSON.parse(localStorage.getItem('template_keys'));
        // console.log('template en localstorage')

        document.getElementById("template_active_codec_video_enable").checked = template.app_codecs.video;
        //WDA Template
        document.getElementById("template_active_stun_wda").checked = (template.app_wda.enable === 'true'); //boolean value
        document.getElementsByName("template_server_stun_wda")[0].value = template.app_wda.server_stun_wda;
        document.getElementsByName("template_server_port_stun_wda")[0].value = template.app_wda.server_port_stun_wda;
        //MA Template
        document.getElementById("template_active_turn_ma").checked = (template.app_ma.enable === 'true'); //boolean value
        document.getElementsByName("template_server_turn_ma")[0].value = template.app_ma.server_turn_ma;
        document.getElementsByName("template_server_port_turn_ma")[0].value = template.app_ma.server_port_turn_ma;
        document.getElementsByName("template_server_username_turn_ma")[0].value = template.app_ma.server_username_turn_ma;
        document.getElementsByName("template_server_password_turn_ma")[0].value = template.app_ma.server_password_turn_ma;
        //NAT Template
        let template_nat_tenant = document.getElementById("template_nat_tenant");
        (template.nat.sip_value == 'rtp_symmetric,rewrite_contact') ? template_nat_tenant.checked = true: template_nat_tenant.checked = false;

        if (template.template_enable == 'yes') {
            // console.log('template actif')
            document.getElementById("flexSwitchCheckEnableTemplate").checked = true;
            //BTN ENABLE
            (btn_template_active_template.checked == false) ? document.getElementById("flexSwitchCheckEnableTemplate_label").classList.add("text-danger", "fw-bold"): document.getElementById("flexSwitchCheckEnableTemplate_label").classList.remove("text-danger", "fw-bold");

            document.getElementById("template_info_text").innerHTML = '<i class="fa-solid fa-gears"></i> Votre modèle de configuration est actif, pour le modifier <a href="#" class="btn-create-template" id="open_modaltemplate_button" data-bs-toggle="modal" data-bs-target="#template-modal">cliquez ici</a>';
            document.getElementById("template_info_text").classList.add("text-success");
            document.getElementsByName("template_remove")[0].style.display = 'inline';


            document.getElementById("active_codec_video_enable").checked = template.app_codecs.video;

            //NAT Wizard
            let nat_tenant = document.getElementById("nat_tenant");
            (template.nat.sip_value == 'rtp_symmetric,rewrite_contact') ? nat_tenant.checked = true: nat_tenant.checked = false;


            //WDA Wizard
            document.getElementById("active_stun_wda").checked = (template.app_wda.enable === 'true'); //boolean value
            document.getElementsByName("server_stun_wda")[0].value = template.app_wda.server_stun_wda;
            document.getElementsByName("server_port_stun_wda")[0].value = template.app_wda.server_port_stun_wda;
            //WDA Wizard cache zone WDA
            if (document.getElementById("active_stun_wda").checked == false) {
                let server_stun_wda = document.getElementsByName("server_stun_wda")[0];
                let server_port_stun_wda = document.getElementsByName("server_port_stun_wda")[0];
                server_stun_wda.classList.toggle("required");
                server_port_stun_wda.classList.toggle("required");
                $(".server_stun_wda, .server_port_stun_wda").toggle('show');
            }


            // MA Wizard
            document.getElementById("active_turn_ma").checked = (template.app_ma.enable === 'true'); //boolean value
            document.getElementsByName("server_turn_ma")[0].value = template.app_ma.server_turn_ma;
            document.getElementsByName("server_port_turn_ma")[0].value = template.app_ma.server_port_turn_ma;
            document.getElementsByName("server_username_turn_ma")[0].value = template.app_ma.server_username_turn_ma;
            document.getElementsByName("server_password_turn_ma")[0].value = template.app_ma.server_password_turn_ma;
            //MA Wizard Cache Zone MA
            if (document.getElementById("active_turn_ma").checked == false) {
                let server_turn_ma = document.getElementsByName("server_turn_ma")[0];
                let server_port_turn_ma = document.getElementsByName("server_port_turn_ma")[0];
                let server_username_turn_ma = document.getElementsByName("server_username_turn_ma")[0];
                let server_password_turn_ma = document.getElementsByName("server_password_turn_ma")[0];
                server_turn_ma.classList.toggle("required");
                server_port_turn_ma.classList.toggle("required");
                server_username_turn_ma.classList.toggle("required");
                server_password_turn_ma.classList.toggle("required");
                $(".server_turn_ma, .server_port_turn_ma, .server_username_turn_ma, .server_password_turn_ma").toggle('show');
            }

        } else {
            document.getElementsByName("template_remove")[0].style.display = 'inline';
            document.getElementById("template_info_text").innerHTML = '<i class="fa-solid fa-gears"></i> Un modèle de configuration a été trouvé mais il n\'est pas actif, pour l\'activer <a href="#" class="btn-create-template" id="open_modaltemplate_button" data-bs-toggle="modal" data-bs-target="#template-modal">cliquez ici</a>';
            document.getElementById("template_info_text").classList.add("text-warning");
            // console.log('template non actif')
        }
    } else {
        // console.log('template pas trouvé');
        document.getElementsByName("template_remove")[0].style.display = 'none';
        document.getElementById("template_info_text").innerHTML = '<i class="fa-solid fa-gears"></i> Aucun modèle de configuration trouvé, pour en créer un <a href="#" class="btn-create-template" id="open_modaltemplate_button" data-bs-toggle="modal" data-bs-target="#template-modal">cliquez ici</a>'

    }

    /////// FIN TEMPLATE
    // condition pour afficher la liste des conf d'app activent et la bulle d'information 
    const apps_list_active = (apps_list.total > 0) ? "Oui (" + dock_value_apps + ")" : (document.getElementById("step1_tippy_app_show").style.display = "none", "Non");

    //traitement des template sip
    const endpoint_section_options = template_sip_global_data.items[0].endpoint_section_options;
    template_sip_global_data_uuid = template_sip_global_data.items[0].uuid;
    const endpoint_section_options_webrtc = template_sip_webrtc_data.items[0].endpoint_section_options;
    template_sip_webrtc_data_uuid = template_sip_webrtc_data.items[0].uuid;
    //retravail le retour JSON du SIP Global pour traitement plus efficace ulterieur
    const template_sip_global_endpoint_section_options = new Array();
    for (let i = 0; i < endpoint_section_options.length; i++) {
        for (let f = 0; f < endpoint_section_options[i].length; f++) {
            if ([f] == 0) {
                template_sip_global_endpoint_section_options[endpoint_section_options[i][f]] = "no value"
            }
            if ([f] == 1) {
                template_sip_global_endpoint_section_options[endpoint_section_options[i][f - 1]] = endpoint_section_options[i][f]
            }
        }
    }
    const template_sip_webrtc_endpoint_section_options = new Array();
    for (let j = 0; j < endpoint_section_options_webrtc.length; j++) {
        for (let k = 0; k < endpoint_section_options_webrtc[j].length; k++) {
            if ([k] == 0) {
                template_sip_webrtc_endpoint_section_options[endpoint_section_options_webrtc[j][k]] = "no value"
            }
            if ([k] == 1) {
                template_sip_webrtc_endpoint_section_options[endpoint_section_options_webrtc[j][k - 1]] = endpoint_section_options_webrtc[j][k]
            }
        }
    }
    let language_data = template_sip_global_endpoint_section_options.language;


    // CODECS actifs Global
    let allow_data = template_sip_global_endpoint_section_options.allow;
    let allow_data_array = allow_data.split(",");
    let dock_value_codecs = "";
    for (var a in allow_data_array) {
        let codec = allow_data_array[a];
        for (var i = 0; i < codec_list.length; ++i) {
            let o = codec_list[i];
            if (o.value == codec) {
                dock_value_codecs += o.name + " ";
                break;
            }
        }
    }


    // CODECS actifs WebRTC
    let allow_data_webrtc = template_sip_webrtc_endpoint_section_options.allow;
    let allow_data_array_webrtc = allow_data_webrtc.split(",");
    let dock_value_codecs_webrtc = "";
    for (var a in allow_data_array_webrtc) {
        let codec_webrtc = allow_data_array_webrtc[a];
        for (var i = 0; i < codec_list.length; ++i) {
            let o = codec_list[i];
            if (o.value == codec_webrtc) {
                dock_value_codecs_webrtc += o.name + " ";
                break;
            }
        }
    }

    //genere select box pour MOH 
    let select_moh_select = "";
    let moh_tenant_select = $("#moh_tenant");
    for (let i = 0; i < moh_list.items.length; i++) {
        select_moh_select += '<option value="' + moh_list.items[i].name + '">' + moh_list.items[i].label + '</option>';
    }
    moh_tenant_select.append(select_moh_select);
    moh_tenant_select.each(function() {
        var $select = $(this);
        var $dropdown = $(this).next('.nice-select');
        var open = $dropdown.hasClass('open');

        if ($dropdown.length) {
            $dropdown.remove();
            create_nice_select($select, 'moh');

            if (open) {
                $select.next().trigger('click');
            }
        }
    });
    ///////
    //genere select box pour LOCALES
    let select_locales_select = "";
    let template_select_locales_select = "";
    let locales_tenant_select = $("#locales_tenant");
    let locales_tenant_select_template = $("#template_locales_tenant");
    for (let i = 0; i < locale_list.length; i++) {
        if ("template_keys" in localStorage) {
            // si inclusion de template 
            if (template.template_enable == 'no' && locale_list[i].locale == template.locale.sip_value) {
                template_select_locales_select += '<option selected data-label="' + locale_list[i].locale_text + '" value="' + locale_list[i].locale + '">' + locale_list[i].locale_text + '</option>';
            } else if (template.template_enable == 'yes' && locale_list[i].locale == template.locale.sip_value) {
                select_locales_select += '<option selected data-label="' + locale_list[i].locale_text + '" value="' + locale_list[i].locale + '">' + locale_list[i].locale_text + '</option>';
                template_select_locales_select += '<option selected data-label="' + locale_list[i].locale_text + '" value="' + locale_list[i].locale + '">' + locale_list[i].locale_text + '</option>';
            } else {
                select_locales_select += '<option data-label="' + locale_list[i].locale_text + '" value="' + locale_list[i].locale + '">' + locale_list[i].locale_text + '</option>';
                template_select_locales_select += '<option data-label="' + locale_list[i].locale_text + '" value="' + locale_list[i].locale + '">' + locale_list[i].locale_text + '</option>'
            }
        } else {
            select_locales_select += '<option data-label="' + locale_list[i].locale_text + '" value="' + locale_list[i].locale + '">' + locale_list[i].locale_text + '</option>';
            template_select_locales_select += '<option data-label="' + locale_list[i].locale_text + '" value="' + locale_list[i].locale + '">' + locale_list[i].locale_text + '</option>'
        }
    }
    locales_tenant_select.append(select_locales_select);
    locales_tenant_select.each(function() {
        let $select = $(this);
        let $dropdown = $(this).next('.nice-select');
        let open = $dropdown.hasClass('open');
        if ($dropdown.length) {
            $dropdown.remove();
            create_nice_select($select, 'locales');
            if (open) {
                $select.next().trigger('click');
            }
        }
    });
    locales_tenant_select_template.append(template_select_locales_select);
    locales_tenant_select_template.each(function() {
        let $select = $(this);
        let $dropdown = $(this).next('.nice-select');
        let open = $dropdown.hasClass('open');
        if ($dropdown.length) {
            $dropdown.remove();
            create_nice_select($select, 'template_locales');
            if (open) {
                $select.next().trigger('click');
            }
        }
    });
    ///////
    //genere select box pour CODECS 
    let select_box = "";
    let select_box_webrtc = "";
    let template_select_box = "";
    let template_select_box_webrtc = "";
    //affiche liste codec basé sur template global et webrtc et/ou sur le template
    for (let i = 0; i < codec_list.length; i++) {
        let selected = '';
        let selected_webrtc = '';
        let template_selected = '';
        let template_selected_webrtc = '';
        if ("template_keys" in localStorage && template.template_enable == 'yes') {
            // // console.log("a1 : " + codec_list[i].value);
            let template_dock_value_codecs = template.codecs.sip_value;
            let template_dock_value_codecs_webrtc = template.app_codecs.sip_value;
            for (let d = 0; d < template_dock_value_codecs.length; d++) {
                // // console.log("a2 : " + codec_list[i].value);
                if (template_dock_value_codecs[d] === codec_list[i].value) {
                    selected = 'checked';
                    template_selected = 'checked';
                }
            }
            for (let j = 0; j < template_dock_value_codecs_webrtc.length; j++) {
                // // console.log("a3 : " + codec_list[i].value);
                if (template_dock_value_codecs_webrtc[j] === codec_list[i].value) {
                    selected_webrtc = 'checked';
                    template_selected_webrtc = 'checked';
                }
            }
        } else if ("template_keys" in localStorage && template.template_enable == 'no') {
            if (codec_list[i].value == "alaw") {
                // // console.log("b1 : " + codec_list[i].value);
                selected = 'checked';
                selected_webrtc = 'checked';
            } else if (codec_list[i].value == "vp8" || codec_list[i].value == "vp9" || codec_list[i].value == "h264") {
                // // console.log("c1 : " + codec_list[i].value);
                selected = '';
                selected_webrtc = 'checked';
            } else {
                // // console.log("d1 : " + codec_list[i].value);
                selected = '';
                selected_webrtc = '';
            }
            // ON APPLIQUE LES CODECS REGLÉS DNAS LE LOCALSTORAGE UNIQUEMENT AU TEMPLATE
            let template_dock_value_codecs = template.codecs.sip_value;
            let template_dock_value_codecs_webrtc = template.app_codecs.sip_value;
            for (let d = 0; d < template_dock_value_codecs.length; d++) {
                // // console.log("a2 : " + codec_list[i].value);
                if (template_dock_value_codecs[d] === codec_list[i].value) {
                    template_selected = 'checked';
                }
            }
            for (let j = 0; j < template_dock_value_codecs_webrtc.length; j++) {
                // // console.log("a3 : " + codec_list[i].value);
                if (template_dock_value_codecs_webrtc[j] === codec_list[i].value) {
                    template_selected_webrtc = 'checked';
                }
            }
        } else if (!("template_keys" in localStorage)) {
            if (codec_list[i].value == "alaw") {
                // // console.log("b1 : " + codec_list[i].value);
                selected = 'checked';
                selected_webrtc = 'checked';
                template_selected = 'checked';
                template_selected_webrtc = 'checked';
            } else if (codec_list[i].value == "vp8" || codec_list[i].value == "vp9" || codec_list[i].value == "h264") {
                // // console.log("c1 : " + codec_list[i].value);
                selected = '';
                selected_webrtc = '';
                selected_webrtc = 'checked';
                template_selected_webrtc = 'checked';
            } else {
                // // console.log("d1 : " + codec_list[i].value);
                selected = '';
                selected_webrtc = '';
                template_selected = '';
                template_selected_webrtc = '';
            }
        }


        ////WIZARD////
        //liste codec global
        select_box += '<div class="form-group form-check-inline">' +
            '<label class="container_check version_2">' + codec_list[i].name +
            '<input type="checkbox" name="active_codec" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="" ' + selected + '>' +
            '<span class="checkmark"></span>' +
            '</label>' +
            '</div>';
        //liste codec webrtc
        select_box_webrtc += '<div class="form-group form-check-inline">' +
            '<label class="container_check version_2">' + codec_list[i].name +
            '<input type="checkbox" name="active_codec_webrtc" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="' + codec_list[i].value + '" ' + selected_webrtc + '>' +
            '<span class="checkmark"></span>' +
            '</label>' +
            '</div>'

        /////TEMPLATE////
        //liste codec template global
        template_select_box += '<div class="form-group form-check-inline">' +
            '<label class="container_check version_2">' + codec_list[i].name +
            '<input type="checkbox" name="template_active_codec" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="" ' + template_selected + '>' +
            '<span class="checkmark"></span>' +
            '</label>' +
            '</div>';
        //liste codec template webrtc
        template_select_box_webrtc += '<div class="form-group form-check-inline">' +
            '<label class="container_check version_2">' + codec_list[i].name +
            '<input type="checkbox" name="template_active_codec_webrtc" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="' + codec_list[i].value + '" ' + template_selected_webrtc + '>' +
            '<span class="checkmark"></span>' +
            '</label>' +
            '</div>'
    }
    document.getElementById("codec_activable").innerHTML = select_box;
    document.getElementById("codec_activable_webrtc").innerHTML = select_box_webrtc;
    document.getElementById("template_codec_activable").innerHTML = template_select_box;
    document.getElementById("template_codec_activable_webrtc").innerHTML = template_select_box_webrtc;
    ///////////
    document.getElementById("client_site_name").innerHTML = client_site_name.items[0].name;
    document.getElementsByName("lang")[0].innerHTML = clm.getCountryNameByAlpha2(language_data.slice(-2));
    document.getElementsByName("codec")[0].innerHTML = dock_value_codecs;
    document.getElementsByName("codec_webrtc")[0].innerHTML = dock_value_codecs_webrtc;
    document.getElementsByName("apps_webrtc")[0].innerHTML = apps_list_active;
    if (template_sip_global_endpoint_section_options.rtp_symmetric === "yes" && template_sip_global_endpoint_section_options.rewrite_contact === "yes") {
        document.getElementsByName("nat")[0].innerHTML = "Oui"
    } else {
        document.getElementsByName("nat")[0].innerHTML = "Non"
    }
    // MOH 
    if (template_sip_global_endpoint_section_options.moh_suggest === undefined) {
        document.getElementsByName("moh")[0].innerHTML = "Option non définie"
    } else {
        document.getElementsByName("moh")[0].innerHTML = template_sip_global_endpoint_section_options.moh_suggest
    }
})();