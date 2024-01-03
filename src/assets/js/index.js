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
export let host;
export let tenant_uuid;
export let token_session;

const codec_list = JSON.parse(codec_list_text);
const locale_list = JSON.parse(locale_list_wazo);
const btn_next = document.getElementsByClassName("forward");
const btn_submit = document.getElementsByClassName("submit");

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
  'nat': []
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
      // recuperer elements dans la ckeckbox codecs
      $('input[type=checkbox]:checked').each(function() {
          if (jQuery(this).is(":checked")) {
              codecs.sip_value += "," + $(this).val();
              codecs.label += this.dataset.label + " ";
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
      // creation du fichier json 
      keys.codecs = codecs;
      keys.locale = locales;
      keys.moh = moh;
      keys.nat = nat;
      add_info_to_summary(keys);
  })
}
// BOUTON ENREGISTRER EVENEMENT SUR CLICK
for (let element of btn_submit) {
  element.addEventListener("click", function(e) {
      update_sip_template_endpoint(keys)
  })
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
  // appel api pour lister les noms et uuid des musiques dattente
  const moh_list = await fetch(host + api_confd_moh, options).then(response => response.json());
  const endpoint_section_options = template_sip_global_data.items[0].endpoint_section_options;
  template_sip_global_data_uuid = template_sip_global_data.items[0].uuid;

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
  let language_data = template_sip_global_endpoint_section_options.language;

  // MOH 
  if (template_sip_global_endpoint_section_options.moh_suggest === undefined) {
      document.getElementsByName("moh")[0].value = "Option non définie"
  } else {
      document.getElementsByName("moh")[0].value = template_sip_global_endpoint_section_options.moh_suggest
  }
  // CODECS
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
  for (let i = 0; i < codec_list.length; i++) {
      if (codec_list[i].value == "alaw") {
          select_box += '<div class="form-group form-check-inline">' +
              '<label class="container_check version_2">' + codec_list[i].name +
              '<input type="checkbox" name="active_codec" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="" checked>' +
              '<span class="checkmark"></span>' +
              '</label>' +
              '</div>'
      } else {
          select_box += '<div class="form-group form-check-inline">' +
              '<label class="container_check version_2">' + codec_list[i].name +
              '<input type="checkbox" name="active_codec" data-label="' + codec_list[i].name + '" value="' + codec_list[i].value + '" class="">' +
              '<span class="checkmark"></span>' +
              '</label>' +
              '</div>'
      }
  }
  document.getElementById("codec_activable").innerHTML = select_box;
  ///////////
  document.getElementById("client_site_name").innerHTML = client_site_name.items[0].name;
  document.getElementsByName("lang")[0].value = clm.getCountryNameByAlpha2(language_data.slice(-2));
  document.getElementsByName("codec")[0].value = dock_value_codecs;
  if (template_sip_global_endpoint_section_options.rtp_symmetric === "yes" && template_sip_global_endpoint_section_options.rewrite_contact === "yes") {
      document.getElementsByName("nat")[0].value = "Oui"
  } else {
      document.getElementsByName("nat")[0].value = "Non"
  }
})();