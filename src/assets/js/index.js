import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import tippy from 'tippy.js';
import {
  App
} from '@wazo/euc-plugins-sdk';
import "./survey_func";
import {
  update_sip_template_endpoint,
  create_nice_select,
  add_info_to_summary
} from "./main.functions";
import {
  codec_list_text,
  locale_list_wazo
} from "./main.const";
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
const btn_next = document.getElementsByClassName("forward");
const btn_submit = document.getElementsByClassName("submit");
const btn_stun = document.getElementsByClassName("active_stun_wda");
const btn_turn = document.getElementsByClassName("active_turn_ma");

tippy('[data-tippy-content]', {
  // trigger: 'click focus',
  placement: 'left-start',
  animation: 'perspective',
});
// BOUTON SUIVANT EVENEMENT SUR CLICK
export const keys = {
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
      keys.codecs = codecs;
      keys.locale = locales;
      keys.moh = moh;
      keys.nat = nat;
      keys.app_labels = app_labels;
      keys.app_codecs = app_codecs;
      keys.app_ma = app_ma;
      keys.app_wda = app_wda;
      // console.log(keys);
      add_info_to_summary(keys);
  })
}
// BOUTON ENREGISTRER EVENEMENT SUR CLICK
for (let element of btn_submit) {
  element.addEventListener("click", function(e) {
      update_sip_template_endpoint(keys)
  })
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
              '<input type="checkbox" name="active_codec_webrtc" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="" checked>' +
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
              '<input type="checkbox" name="active_codec_webrtc" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="">' +
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