import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import tippy from 'tippy.js';
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

const codec_list = JSON.parse(codec_list_text);
const locale_list = JSON.parse(locale_list_wazo);
export const btn_next = document.getElementsByClassName("forward");
export const btn_submit = document.getElementsByClassName("submit");
const btn_stun = document.getElementsByClassName("active_stun_wda");
const btn_turn = document.getElementsByClassName("active_turn_ma");
const btn_active_codec = document.getElementsByClassName("active_codec_video_enable");

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
              "7200"],
            ["allow_transfer",
              "yes"],
            [ "use_ptime",
              "yes"],
            ["callerid",
              "wazo"],
            ["direct_media",
              "no"],
            ["dtmf_mode",
              "rfc4733" ],
            ["language",
              keys.locale.sip_value],
            ["inband_progress",
              "no"],
            ["rtp_timeout_hold",
              "0"],
            ["timers_sess_expires",
              "600"],
            ["timers_min_se",
              "90"],
            ["trust_id_inbound",
              "no"],
            ["allow_subscribe",
              "yes"],
            ["allow",
              keys.codecs.sip_value],
            ["rewrite_contact",
              say_yes_or_no],
            ["rtp_symmetric",
              say_yes_or_no],
            ["moh_suggest",
              keys.moh.sip_value]
          ]
        })
      };
      try {
        let promise = await fetch(host+api_confd_sip_temp_global_put+template_sip_global_data_uuid, put_options);
        if (promise == null || promise.status == 204 || promise.ok){
          update_sip_template_webrtc_endpoint(keys)
        } else {
            // console.log("no auth");
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
            "yes"],
          ["max_audio_streams",
            "1"],
          [ "max_video_streams",
            "25"],
          ["allow",
          pkeys.app_codecs.sip_value],
          ["dtls_auto_generate_cert",
            "yes"]
        ]
      })
    };
    try {
      let promise = await fetch(host+api_confd_sip_temp_global_put+template_sip_webrtc_data_uuid, put_options);
      if (promise == null || promise.status == 204 || promise.ok){
        document.getElementById("final-step-one").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
        update_apps(apps_list, pkeys)
      } else {
          // console.log("no auth");
      }
      } catch (erreur) {
          console.error("Erreur :", erreur); 
      }
  }
  
  async function updateORcreate_ext_apps(name, app_keys, create_or_not) {
    const api_confd_sip_temp_global_put = '/api/confd/1.1/external/apps/'+name;
    let conf;
    let PUT_or_POST;
    if (name == "wazo-euc-application-mobile") {
      (create_or_not == 0) ? PUT_or_POST = "PUT" : PUT_or_POST = "POST";
      conf = {
        "turn_servers":"[{\"urls\":\"turn:"+app_keys.app_ma.server_turn_ma+":"+app_keys.app_ma.server_port_turn_ma+"\",\"username\":\""+app_keys.app_ma.server_username_turn_ma+"\",\"credential\":\""+app_keys.app_ma.server_password_turn_ma+"\"}]"
      }
      
    }
    else if (name == "wazo-euc-application-desktop" || name == "wazo-euc-application-web") {
      (create_or_not == 0) ? PUT_or_POST = "PUT" : PUT_or_POST = "POST";
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
      let promise = await fetch(host+api_confd_sip_temp_global_put, put_options);
      if (promise == null || promise.status == 204 || promise.ok){
        // console.log(name + ": OK");
      }else{
        // console.log(name + ": NOK");
      }
    }
    catch (erreur) {
          console.error("Erreur :", erreur); 
    }
  }
  // function pour update ou ajout une configuration d'application 
  async function update_apps(apps_list, app_keys) {
    // console.log(apps_list);
    if (apps_list.total > 0 && (app_keys.app_ma.enable == "true" || app_keys.app_wda.enable == "true")){
      // console.log("Etat MA = " + app_keys.app_ma.enable);
      // console.log("Etat WDA = " + app_keys.app_wda.enable);
      let apps_items = apps_list.items;
      let apps_labell = app_keys.app_labels.activate_labels;
      for (let g = 0; g < apps_labell.length; g++) {
        // console.log(apps_items);
        // console.log("Demande d'app conf: "+ apps_labell[g]);
        const checkItemsExist = obj => obj.name === apps_labell[g];
        // console.log("CHECK ITEM");
        let label_name_check = apps_items.some(checkItemsExist);
        // console.log(label_name_check);
        // console.log("FIN CHECK");
        let label_name = apps_labell[g];
        //je trouve un objet dans les items dapp retournés
        if (label_name_check === true) {
          // console.log("L'app existe deja alors");
          // console.log("BOUCLE UPDATE");       
          if (label_name == apps_labell[g]) {
            // console.log("boucle update label: "+label_name);
            await updateORcreate_ext_apps(label_name, app_keys, 0)
          }else{
            // console.log("erreur boucle update");
          }
        }else if (label_name_check === false) {
          // console.log("L'app N'existe PAS deja alors");
          // console.log("BOUCLE CREATE");
          // console.log(apps_labell[g]);
          // console.log("boucle create label: "+apps_labell[g]);
          await updateORcreate_ext_apps(apps_labell[g], app_keys, 1)
        }
      }
    }else if(apps_list.total == 0 && (app_keys.app_ma.enable == "true" || app_keys.app_wda.enable == "true")){
      // console.log("il ny a pas d'app configuree : ");
      // console.log("MA2 = " + app_keys.app_ma.enable);
      // console.log("WDA2 = " + app_keys.app_wda.enable);
      //fonction de creation des conf dapp
      let apps_label = app_keys.app_labels.activate_labels;
      for (let h = 0; h < apps_label.length; h++){
        // console.log("create app : " + apps_label[h]);
        await updateORcreate_ext_apps(apps_label[h], app_keys, 1)
      }
    }
    else{
      // console.log("il ny a pas d'app à configurer");
    }
    // EXIT de fin
    setTimeout(function(){
      // let btn_submit = document.getElementsByClassName("submit");
      // let btn_next = document.getElementsByClassName("backward");
      for (let element of btn_submit) {
        element.setAttribute('disabled', 'yes');
      }
      for (let element of btn_next) {
          element.setAttribute('disabled', 'yes');
        }
        document.getElementById("final-step-two").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
        document.getElementById("final-step-three").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
      document.getElementById("title_text").innerText = "Terminé !";
      document.getElementById("subtitle_text").innerText = "";
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
      
      $dropdown.find('.current').html($selected.data('display') || $selected.text());
      
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
      check_before_send.innerHTML = "<li><span class='font-weight-bold'> Langue :</span> "+ data_keys.locale.label + "</li>" +
                                    "<li><span class='font-weight-bold'>Codecs activés :</span> "+ data_keys.codecs.label + "</li>" +
                                    "<li><span class='font-weight-bold'>Musique d'attente :</span> "+ data_keys.moh.label + "</li>" +
                                    "<li><span class='font-weight-bold'>Nat Actif :</span> "+ data_keys.nat.label + "</li>";
      check_before_send_app.innerHTML = "<li><span class='font-weight-bold'>Codecs activés :</span> "+ data_keys.app_codecs.label + "</li>" +
                                    "<li><span class='font-weight-bold'>Service STUN (Web & Desktop) :</span> "+ ((data_keys.app_wda.enable === "true") ? 'Oui' : 'Non') + "</li>" +
                                    "<li><span class='font-weight-bold'>Service TURN (Mobile) :</span> "+ ((data_keys.app_ma.enable === "true") ? 'Oui' : 'Non') + "</li>"
    
  }

//END FUNCTIONS


tippy('[data-tippy-content]', {
  // trigger: 'click focus',
  placement: 'left-start',
  animation: 'perspective',
});
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
      $('.nat_tenant li.selected').each(function() {
          nat.sip_value += this.dataset.value;
          nat.label += $(this).text();
      })
      $('#active_stun_wda').each(function() {
          app_wda.enable += ((this.value === "yes") ? true : false);
          ((this.value === "yes") ? app_labels.activate_labels.push("wazo-euc-application-web", "wazo-euc-application-desktop") : "");
          app_wda.server_stun_wda += $("input[name='server_stun_wda']").val();
          app_wda.server_port_stun_wda += $("input[name='server_port_stun_wda']").val();
      })
      $('#active_turn_ma').each(function() {
        app_ma.enable += ((this.value === "yes") ? true : false);
        ((this.value === "yes") ? app_labels.activate_labels.push("wazo-euc-application-mobile") : "");
        app_ma.server_turn_ma += $("input[name='server_turn_ma']").val();
        app_ma.server_port_turn_ma += $("input[name='server_port_turn_ma']").val();
        app_ma.server_username_turn_ma += $("input[name='server_username_turn_ma']").val();
        app_ma.server_password_turn_ma += $("input[name='server_password_turn_ma']").val();
    })
      // creation du fichier json 
      dkeys.codecs = codecs;
      dkeys.locale = locales;
      dkeys.moh = moh;
      dkeys.nat = nat;
      dkeys.app_labels = app_labels;
      dkeys.app_codecs = app_codecs;
      dkeys.app_ma = app_ma;
      dkeys.app_wda = app_wda;
      console.log(dkeys);
      add_info_to_summary(dkeys);
  })
}
// BOUTON ENREGISTRER EVENEMENT SUR CLICK
for (let element of btn_submit) {
  element.addEventListener("click", function(e) {
      update_sip_template_endpoint(dkeys)
  })
}

// changement codec pour video 
for (let element_codec of btn_active_codec) {
    let select_vp8 = document.getElementsByClassName("vp8");
    let select_vp9 = document.getElementsByClassName("vp9");
    let select_h264 = document.getElementsByClassName("h264");
    element_codec.onchange = () => {
        (select_vp8[0].checked) ? select_vp8[0].checked = false : select_vp8[0].checked = true ;
        (select_vp9[0].checked) ? select_vp9[0].checked = false : select_vp9[0].checked = true ;
        (select_h264[0].checked) ? select_h264[0].checked = false : select_h264[0].checked = true ;
    }
}

// changement etat select stun 
for (let element_stun of btn_stun) {
    let server_stun_wda = document.getElementsByName("server_stun_wda");
    let server_port_stun_wda = document.getElementsByName("server_port_stun_wda");
    element_stun.onchange = () => {
        for (let box_server_stun_wda of server_stun_wda){
            box_server_stun_wda.classList.toggle("required");
        }
        for (let box_server_port_stun_wda of server_port_stun_wda){
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
        for (let box_server_turn_ma of server_turn_ma){
            box_server_turn_ma.classList.toggle("required");
        }
        for (let box_server_port_stun_ma of server_port_turn_ma){
            box_server_port_stun_ma.classList.toggle("required");
        }
        for (let box_server_username_turn_ma of server_username_turn_ma){
            box_server_username_turn_ma.classList.toggle("required");
        }
        for (let box_server_password_turn_ma of server_password_turn_ma){
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
  const api_confd_apps_get =  '/api/confd/1.1/external/apps?recurse=false';

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
  // console.log(apps_list);
  
  // traitement si configuration app existe pour affichage sur page accueil
  let dock_value_apps = "";
  if(apps_list.total > 0){
    let apps_items = apps_list.items;
    for (let g = 0; g < apps_items.length; g++){
        (apps_items[g].name == "wazo-euc-application-mobile") ? dock_value_apps += "Wazo Mobile" + " " : '';
        (apps_items[g].name == "wazo-euc-application-web") ? dock_value_apps += "Wazo Web" + " " : '';
        (apps_items[g].name == "wazo-euc-application-desktop") ? dock_value_apps += "Wazo Desktop" + " " : '';
    }
  }

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


  // CODECS Global
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
  // CODECS WebRTC
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
  let locales_tenant_select = $("#locales_tenant");
  for (let i = 0; i < locale_list.length; i++) {
      select_locales_select += '<option data-label="' + locale_list[i].locale_text + '" value="' + locale_list[i].locale + '">' + locale_list[i].locale_text + '</option>'
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
  ///////
  //genere select box pour CODECS 
  let select_box = "";
  let select_box_webrtc = "";
  //liste codec pour template global et webrtc
  for (let i = 0; i < codec_list.length; i++) {
      if (codec_list[i].value == "alaw") {
          select_box += '<div class="form-group form-check-inline">' +
              '<label class="container_check version_2">' + codec_list[i].name +
              '<input type="checkbox" name="active_codec" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="" checked>' +
              '<span class="checkmark"></span>' +
              '</label>' +
              '</div>';
              //liste codec pour template webrtc
          select_box_webrtc += '<div class="form-group form-check-inline">' +
              '<label class="container_check version_2">' + codec_list[i].name +
              '<input type="checkbox" name="active_codec_webrtc" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="' + codec_list[i].value + '" checked>' +
              '<span class="checkmark"></span>' +
              '</label>' +
              '</div>'
      } 
      else if (codec_list[i].value == "vp8" || codec_list[i].value == "vp9" || codec_list[i].value == "h264") {
        //liste codec VIDEO pour template global (nactive pas)
        select_box += '<div class="form-group form-check-inline">' +
              '<label class="container_check version_2">' + codec_list[i].name +
              '<input type="checkbox" name="active_codec" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="" >' +
              '<span class="checkmark"></span>' +
              '</label>' +
              '</div>';
        //liste et ACTIVE codec VIDEO pour template webrtc
        select_box_webrtc += '<div class="form-group form-check-inline">' +
        '<label class="container_check version_2">' + codec_list[i].name +
        '<input type="checkbox" name="active_codec_webrtc" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="' + codec_list[i].value + '" checked>' +
        '<span class="checkmark"></span>' +
        '</label>' +
        '</div>'
      } else {
          select_box += '<div class="form-group form-check-inline">' +
              '<label class="container_check version_2">' + codec_list[i].name +
              '<input type="checkbox" name="active_codec" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="">' +
              '<span class="checkmark"></span>' +
              '</label>' +
              '</div>';
              //liste codec pour template webrtc
          select_box_webrtc += '<div class="form-group form-check-inline">' +
              '<label class="container_check version_2">' + codec_list[i].name +
              '<input type="checkbox" name="active_codec_webrtc" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="' + codec_list[i].value + '">' +
              '<span class="checkmark"></span>' +
              '</label>' +
              '</div>'
      }
  }

    document.getElementById("codec_activable").innerHTML = select_box;
    document.getElementById("codec_activable_webrtc").innerHTML = select_box_webrtc;
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