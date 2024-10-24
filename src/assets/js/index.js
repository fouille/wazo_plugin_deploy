import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import 'bootstrap/dist/css/bootstrap.min.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import JSConfetti from 'js-confetti';
import tippy from 'tippy.js';
import 'bootstrap';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import { App } from '@wazo/euc-plugins-sdk';
import './survey_func';
import { codec_list_text, locale_list_wazo } from './main.const';
import { exportToJsonFile, importJsonToLocalStorage } from './main.functions'
import { Modal } from 'bootstrap';

i18next
  .use(LanguageDetector)
  .init({
    supportedLngs: ['en', 'fr', 'es'],
    resources: {
      fr,
      en,
      es
    }
});
const what = process.env.NODE_ENV;

const canvasJsConfetti = document.getElementById('tsparticles');
const jsConfetti = new JSConfetti({ canvasJsConfetti });

const app = new App();
const version = `© [AIV]{date}[/AIV] FMW - ${i18next.t('global.copyright')} - [AIV]v{version}[/AIV] ${what} - <a href="#" class="btn-import-template" id="open_import_modal_button" data-bs-toggle="modal" data-bs-target="#import-modal"></a>`;

document.querySelector('.copy').innerHTML = version;

export let template_sip_global_data_uuid = "";
export let template_sip_webrtc_data_uuid = "";
export let apps_list = "";
export let host;
let port;
export let tenant_uuid;
export let token_session;
let template;

const codec_list = JSON.parse(codec_list_text);
const locale_list = JSON.parse(locale_list_wazo);
const btn_next = [...document.getElementsByClassName("forward")];
const btn_submit = [...document.getElementsByClassName("wizard_save")];
const btn_template = [...document.getElementsByClassName("template_save")];
const btn_template_remove = [...document.getElementsByClassName("template_remove")];
const btn_template_export = [...document.getElementsByClassName("template_export_btn")];
const btn_template_import = [...document.getElementsByClassName("template_import_btn")];
const btn_stun = [...document.querySelectorAll(".active_stun_wda, .template_active_stun_wda")];
const btn_turn = [...document.querySelectorAll(".active_turn_ma, .template_active_turn_ma")];
const btn_active_codec = document.getElementById("active_codec_video_enable");
const btn_template_active_codec = document.getElementById("template_active_codec_video_enable");
const btn_template_active_template = document.getElementById("flexSwitchCheckEnableTemplate");
const btn_language_fr = document.querySelectorAll(".fi-fr");
const btn_language_en = document.querySelectorAll(".fi-gb");
const btn_language_es = document.querySelectorAll(".fi-es");

//rc1.0.8 I18N LANGUAGE//
const elementsToTranslate = [
    { id: 'backward', key: 'global.backward' },
    { id: 'forward', key: 'global.forward' },
    { id: 'process', key: 'global.process' },
    { id: 'template_info_list', key: 'template.template_info_list' },
    { id: 'template_info_flashMode', key: 'template.template_info_flashMode' },
    { id: 'template_save', key: 'global.process' },
    { id: 'template_remove', key: 'global.delete' },
    { id: 'templateModal', key: 'template.templateModal' },
    { id: 'template_export_btn', key: 'template.template_export_btn' },
    { id: 'open_import_modal_button', key: 'global.open_import_modal_button' },
    { id: 'template_import_title', key: 'template.template_import_title' },
    { id: 'template_import_text', key: 'template.template_import_text' },
    { id: 'template_import_btn', key: 'template.template_import_btn' },
    { id: 'template_import_errorMessage', key: 'template.template_import_errorMessage' },
    { id: 'flexSwitchCheckEnableTemplate_label', key: 'template.activate' },
    { id: 'information_text', key: 'template.information_text' },
    { id: 'collapseOne_btn', key: 'template.collapseOne_btn' },
    { id: 'collapseOne_text', key: 'template.collapseOne_text' },
    { id: 'collapseOne_lang', key: 'template.collapseOne_lang' },
    { id: 'collapseOne_lang_select', key: 'template.collapseOne_lang_select' },
    { id: 'collapseOne_nat', key: 'template.collapseOne_nat' },
    { id: 'collapseOne_nat_label', key: 'template.collapseOne_nat_label' },
    { id: 'collapseOne_codecs', key: 'template.collapseOne_codecs' },
    { id: 'collapseWebrtc_btn', key: 'template.collapseWebrtc_btn' },
    { id: 'collapseWebrtc_text', key: 'template.collapseWebrtc_text' },
    { id: 'collapseWebrtc_codecs_enable', key: 'template.collapseWebrtc_codecs_enable' },
    { id: 'collapseTwo_btn', key: 'template.collapseTwo_btn' },
    { id: 'collapseTwo_text', key: 'template.collapseTwo_text' },
    { id: 'collapseTwo_stun_enable', key: 'template.collapseTwo_stun_enable' },
    { id: 'collapseTwo_stun_uri', key: 'template.collapseTwo_stun_uri' },
    { id: 'collapseThree_btn', key: 'template.collapseThree_btn' },
    { id: 'collapseThree_text', key: 'template.collapseThree_text' },
    { id: 'collapseThree_turn_enable', key: 'template.collapseThree_turn_enable' },
    { id: 'collapseThree_turn_uri', key: 'template.collapseThree_turn_uri' },
    { id: 'collapseThree_turn_username', key: 'template.collapseThree_turn_username' },
    { id: 'collapseThree_turn_password', key: 'template.collapseThree_turn_password' },
    { id: 'title_text', key: 'step0.title_text' },
    { id: 'subtitle_text', key: 'step0.subtitle_text' },
    { id: 'step0_panel1_title', key: 'step0.step0_panel1_title' },
    { id: 'step0_panel1_lang', key: 'step0.step0_panel1_lang' },
    { id: 'step0_panel1_codecs', key: 'step0.step0_panel1_codecs' },
    { id: 'step0_panel1_moh', key: 'step0.step0_panel1_moh' },
    { id: 'step0_panel1_nat', key: 'step0.step0_panel1_nat' },
    { id: 'step0_panel2_title', key: 'step0.step0_panel2_title' },
    { id: 'step0_panel2_codecs', key: 'step0.step0_panel2_codecs' },
    { id: 'step0_panel2_apps', key: 'step0.step0_panel2_apps' },
    { id: 'step1_panel1_title', key: 'step1.step1_panel1_title' },
    { id: 'step1_panel2_title', key: 'step1.step1_panel2_title' },
    { id: 'step1_panel3_title', key: 'step1.step1_panel3_title' },
    { id: 'step1_panel3_moh_default', key: 'step1.step1_panel3_moh_default' },
    { id: 'step1_panel4_title', key: 'step1.step1_panel4_title' },
    { id: 'step1_panel4_nat_enable', key: 'step1.step1_panel4_nat_enable' },
    { id: 'step2_panel1_title', key: 'step2.step2_panel1_title' },
    { id: 'step2_panel1_enable_codecs', key: 'template.collapseWebrtc_codecs_enable' },
    { id: 'step2_panel2_title', key: 'template.collapseTwo_btn' },
    { id: 'step2_panel2_stun_enable', key: 'template.collapseTwo_stun_enable' },
    { id: 'step2_panel2_stun_uri', key: 'template.collapseTwo_stun_uri' },
    { id: 'step2_panel3_title', key: 'template.collapseThree_btn' },
    { id: 'step2_panel3_turn_enable', key: 'template.collapseThree_turn_enable' },
    { id: 'step2_panel3_turn_uri', key: 'template.collapseThree_turn_uri' },
    { id: 'step2_panel3_turn_username', key: 'template.collapseThree_turn_username' },
    { id: 'step2_panel3_turn_password', key: 'template.collapseThree_turn_password' },
    { id: 'main_question', key: 'step3.main_question' },
    { id: 'step3_panel1_title', key: 'step3.step3_panel1_title' },
    { id: 'step3_panel2_title', key: 'step3.step3_panel2_title' },
    { id: 'step3_panel3_title', key: 'step3.step3_panel3_title' },
    { id: 'step3_panel3_text1', key: 'step3.step3_panel3_text1' },
    { id: 'step3_panel3_text2', key: 'step3.step3_panel3_text2' }
  ];
  
const tippyConfigurations = [
    { selector: '#tippy_template_edit', content: i18next.t('template.template_info_text_btn') },
    { selector: '#step1_tippy_app_show', content: i18next.t('step0.step0_panel2_apps_tippy') },
    { selector: '#step1_panel1_title_tippy', content: i18next.t('step1.step1_panel1_title_tippy') },
    { selector: '#step1_panel2_title_tippy', content: i18next.t('step1.step1_panel2_title_tippy') },
    { selector: '#step1_panel3_title_tippy', content: i18next.t('step1.step1_panel3_title_tippy') },
    { selector: '#step1_panel4_title_tippy', content: i18next.t('step1.step1_panel4_title_tippy') },
    { selector: '#step2_panel2_title_tippy', content: i18next.t('step2.step2_panel1_title_tippy') },
    { selector: '#step2_panel2_title_tippy', content: i18next.t('template.collapseTwo_text') },
    { selector: '#step2_panel3_title_tippy', content: i18next.t('template.collapseThree_text') }
  ];

  elementsToTranslate.forEach(({ id, key }) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = i18next.t(key);
    }
  });

  tippyConfigurations.forEach(({ selector, content }) => {
    tippy(selector, {
      content,
      placement: 'left'
    });
  });

  const handleLanguageChange = (lang) => {
    localStorage.setItem("i18nextLng", lang);
    location.reload();
  };

//bouton de choix de langue
btn_language_fr.forEach(element => element.addEventListener("click", () => handleLanguageChange('fr')));
btn_language_en.forEach(element => element.addEventListener("click", () => handleLanguageChange('en')));
btn_language_es.forEach(element => element.addEventListener("click", () => handleLanguageChange('es')));
//fin language//

// FUNCTIONS
//feu artifice
const littleGoodie = () => {
    tsParticles.load({
        id: "tsparticles",
        options: {
          emitters: [
            {
              life: {
                duration: 5,
                count: 1,
              },
              position: {
                x: 0,
                y: 30,
              },
              particles: {
                move: {
                  direction: "top-right",
                },
              },
            },
            {
              life: {
                duration: 5,
                count: 1,
              },
              position: {
                x: 100,
                y: 30,
              },
              particles: {
                move: {
                  direction: "top-left",
                },
              },
            },
          ],
          preset: "confetti",
        },
      });
}
// function pour update du sip template
const updateSipTemplateEndpoint = async (keys) => {
    const { nat, locale, codecs, moh } = keys;
    
    document.getElementById('title_text').innerText = i18next.t('global.wait');
    ['final-step-one', 'final-step-two', 'final-step-three'].forEach(id => {
      document.getElementById(id).innerHTML = '<i class="fa-solid fa-spinner fa-spin-pulse"></i>';
    });
  
    const sayYesOrNo = nat.label === 'yes' ? 'yes' : 'no';
  
    const apiConfdSipTempGlobalPut = '/api/confd/1.1/endpoints/sip/templates/';
    const putOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Wazo-Tenant': tenant_uuid,
        'X-Auth-Token': token_session
      },
      body: JSON.stringify({
        endpoint_section_options: [
          ['rtp_timeout', '7200'],
          ['allow_transfer', 'yes'],
          ['use_ptime', 'yes'],
          ['callerid', 'wazo'],
          ['direct_media', 'no'],
          ['dtmf_mode', 'rfc4733'],
          ['language', locale.sip_value],
          ['inband_progress', 'no'],
          ['rtp_timeout_hold', '0'],
          ['timers_sess_expires', '600'],
          ['timers_min_se', '90'],
          ['trust_id_inbound', 'no'],
          ['allow_subscribe', 'yes'],
          ['allow', codecs.sip_value],
          ['rewrite_contact', sayYesOrNo],
          ['rtp_symmetric', sayYesOrNo],
          ['moh_suggest', moh.sip_value],
          ['send_pai', 'yes'],
          ['set_var', 'TIMEOUT(absolute)=36000']
        ]
      })
    };
  
    try {
      const response = await fetch(`${host}:${port}${apiConfdSipTempGlobalPut}${template_sip_global_data_uuid}`, putOptions);
      if (response && (response.status === 204 || response.ok)) {
        await updateSipTemplateWebrtcEndpoint(keys);
      } else {
        console.log('Authorization failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

// function pour update du sip template WEBRTC
const updateSipTemplateWebrtcEndpoint = async (pkeys) => {
    const apiConfdSipTempGlobalPut = '/api/confd/1.1/endpoints/sip/templates/';
    const putOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Wazo-Tenant': tenant_uuid,
        'X-Auth-Token': token_session
      },
      body: JSON.stringify({
        endpoint_section_options: [
          ['webrtc', 'yes'],
          ['max_audio_streams', '1'],
          ['max_video_streams', '25'],
          ['allow', pkeys.app_codecs.sip_value],
          ['dtls_auto_generate_cert', 'yes']
        ]
      })
    };
  
    try {
      const response = await fetch(`${host}:${port}${apiConfdSipTempGlobalPut}${template_sip_webrtc_data_uuid}`, putOptions);
      if (response && (response.status === 204 || response.ok)) {
        document.getElementById('final-step-one').innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
        updateApps(apps_list, pkeys);
      } else {
        console.log('Authorization failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

const updateOrCreateExtApps = async (name, app_keys, create_or_not) => {
    
const apiConfdSipTempGlobalPut = `/api/confd/1.1/external/apps/${name}`;
let conf;
const method = create_or_not === 0 ? 'PUT' : 'POST';

if (name === 'wazo-euc-application-mobile') {
    conf = {
    turn_servers: JSON.stringify([{
        urls: `turn:${app_keys.app_ma.server_turn_ma}:${app_keys.app_ma.server_port_turn_ma}`,
        username: app_keys.app_ma.server_username_turn_ma,
        credential: app_keys.app_ma.server_password_turn_ma
    }])
    };
    
} else if (name === 'wazo-euc-application-desktop' || name === 'wazo-euc-application-web') {
    conf = {
    stun_servers: `stun:${app_keys.app_wda.server_stun_wda}:${app_keys.app_wda.server_port_stun_wda}`
    };
}

const putOptions = {
    method,
    headers: {
    'Content-Type': 'application/json',
    'Wazo-Tenant': tenant_uuid,
    'X-Auth-Token': token_session
    },
    body: JSON.stringify({
    configuration: conf,
    label: name
    })
};

try {
    const response = await fetch(`${host}:${port}${apiConfdSipTempGlobalPut}`, putOptions);
    if (response && (response.status === 204 || response.ok)) {
    console.log(`${name}: OK`);
    } else {
    console.log(`${name}: NOK`);
    }
} catch (error) {
    console.error('Erreur :', error);
}
};
  
// function pour update ou ajout une configuration d'application 
const updateApps = async (apps_list, app_keys) => {
    const { app_ma, app_wda, app_labels } = app_keys;
  
    if (apps_list.total > 0 && (app_ma.enable === true || app_wda.enable === true)) {
      const appsItems = apps_list.items;
      const appsLabels = app_labels.activate_labels;
  
      for (const label of appsLabels) {
        const appExists = appsItems.some(item => item.name === label);
  
        if (appExists) {
          await updateOrCreateExtApps(label, app_keys, 0);
        } else {
          await updateOrCreateExtApps(label, app_keys, 1);
        }
      }
    } else if (apps_list.total === 0 && (app_ma.enable === true || app_wda.enable === true)) {
      const appsLabels = app_labels.activate_labels;
  
      for (const label of appsLabels) {
        await updateOrCreateExtApps(label, app_keys, 1);
      }
    } else {
      console.log("Il n'y a pas d'app à configurer");
    }
  
    setTimeout(() => {
      const btnSubmit = document.getElementsByClassName("submit");
      const btnBack = document.getElementsByClassName("backward");
  
      Array.from(btnSubmit).forEach(element => element.setAttribute('disabled', 'yes'));
      Array.from(btnBack).forEach(element => element.setAttribute('disabled', 'yes'));
  
      document.getElementById("final-step-two").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
      document.getElementById("final-step-three").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
      document.getElementById("title_text").innerText = i18next.t('step3.finish');
      document.getElementById("subtitle_text").innerText = "";
      document.getElementById("template_info_bloc").style.display = "none";
      document.getElementById("main_question").innerText = i18next.t('step3.configuration');
      jsConfetti.addConfetti({
        confettiRadius: 4,
        confettiNumber: 800,
      });
    }, 1500);
  };

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

const addInfoToSummary = (data_keys) => {
    const { locale, codecs, moh, nat, app_codecs, app_wda, app_ma } = data_keys;
    const checkBeforeSend = document.querySelector(".check_before_send");
    const checkBeforeSendApp = document.querySelector(".check_before_send_app");

    checkBeforeSend.innerHTML = `
      <li><span class='font-weight-bold'>${i18next.t('step3.step3_panel1_lang')}</span> ${locale.label}</li>
      <li><span class='font-weight-bold'>${i18next.t('step3.step3_panel1_codecs')}</span> ${codecs.label}</li>
      <li><span class='font-weight-bold'>${i18next.t('step3.step3_panel1_moh')}</span> ${moh.label}</li>
      <li><span class='font-weight-bold'>${i18next.t('step3.step3_panel1_nat')}</span> ${nat.label === 'yes' ? i18next.t('global.yes') : i18next.t('global.no')}</li>
    `;
  
    checkBeforeSendApp.innerHTML = `
      <li><span class='font-weight-bold'>${i18next.t('step3.step3_panel2_codecs')}</span> ${app_codecs.label}</li>
      <li><span class='font-weight-bold'>${i18next.t('step3.step3_panel2_apps_stun')}</span> ${app_wda.enable ? i18next.t('global.yes') : i18next.t('global.no')}</li>
      <li><span class='font-weight-bold'>${i18next.t('step3.step3_panel2_apps_turn')}</span> ${app_ma.enable ? i18next.t('global.yes') : i18next.t('global.no')}</li>
    `;
};
  
//END FUNCTIONS
tippy('[data-tippy-content]', {
    // trigger: 'click focus',
    placement: 'left-start',
    animation: 'perspective',
});

// BOUTON TEMPLATE SAVE EVENEMENT SUR CLICK
const template_keys = {
    'template_enable': null
};
btn_template.forEach(element => {
    element.addEventListener("click", e => {
      e.preventDefault();
  
      let template_enable;
      const codecs = {
        sip_value: [],
        label: []
      };
      const locales = {
        sip_value: [],
        label: []
      };
      const nat = {
        sip_value: [],
        label: []
      };
      const app_codecs = {
        sip_value: [],
        label: [],
        video: []
      };
      const app_labels = {
        activate_labels: []
      };
      const app_wda = {
        enable: [],
        label_web: [],
        label_desktop: [],
        server_stun_wda: [],
        server_port_stun_wda: []
      };
      const app_ma = {
        enable: [],
        label: [],
        server_turn_ma: [],
        server_port_turn_ma: [],
        server_username_turn_ma: [],
        server_password_turn_ma: []
      };
  
      // Récupérer si template est activé
      template_enable = $('.flexSwitchCheckEnableTemplate.form-check-input[type=checkbox]').is(":checked") ? true : false;
  
      // Récupérer les codecs activés
      $('#template_codec_activable input[type=checkbox]:checked').each(function() {
        codecs.sip_value.push($(this).val());
      });
      $('#template_codec_activable_webrtc input[type=checkbox]:checked').each(function() {
        app_codecs.sip_value.push($(this).val());
      });
      app_codecs.video = document.getElementById("template_active_codec_video_enable").checked;
  
      // Récupérer les locales sélectionnées
      $('.template_locales.selected').each(function() {
        locales.sip_value.push(this.dataset.value);
        locales.label.push($(this).text());
      });
  
      // Récupérer l'état NAT
      nat.sip_value = 'rtp_symmetric,rewrite_contact';
      nat.label = document.getElementById("template_nat_tenant").checked ? 'yes' : 'no';
  
      // Récupérer l'état STUN WDA
      app_wda.enable = document.getElementById("template_active_stun_wda").checked;
      if (app_wda.enable) {
        console.log("état STUN WDA : "+app_wda.enable);
        
        app_labels.activate_labels.push("wazo-euc-application-web", "wazo-euc-application-desktop");
      }
      app_wda.server_stun_wda = $("input[name='template_server_stun_wda']").val();
      app_wda.server_port_stun_wda = $("input[name='template_server_port_stun_wda']").val();
  
      // Récupérer l'état TURN MA
      app_ma.enable = document.getElementById("template_active_turn_ma").checked;
      if (app_ma.enable) {
        app_labels.activate_labels.push("wazo-euc-application-mobile");
      }
      app_ma.server_turn_ma = $("input[name='template_server_turn_ma']").val();
      app_ma.server_port_turn_ma = $("input[name='template_server_port_turn_ma']").val();
      app_ma.server_username_turn_ma = $("input[name='template_server_username_turn_ma']").val();
      app_ma.server_password_turn_ma = $("input[name='template_server_password_turn_ma']").val();
  
      // Création de l'objet JSON
      const template_keys = {
        template_enable,
        codecs,
        locale: locales,
        nat,
        app_labels,
        app_codecs,
        app_ma,
        app_wda
      };
  
      // Stocker dans le localStorage et recharger la page
      localStorage.setItem('template_keys', JSON.stringify(template_keys));
      location.reload();
    });
  });
  
// BOUTON SUIVANT EVENEMENT SUR CLICK
const dkeys = {
    'codecs': [],
    'locale': [],
    'moh': [],
    'nat': [],
    'app_codecs': [],
    'app_wda': [],
    'app_ma': []
};
btn_next.forEach(element => {
  element.addEventListener("click", e => {
    e.preventDefault();
    console.log(dkeys);
    
    // Gestion des erreurs
    document.getElementById('warning_title').innerHTML = i18next.t('error.warning_title');
    document.getElementById('warning_text').innerHTML = i18next.t('error.warning_text_domain');

    // Initialisation des objets
    let codecs = {
      sip_value: "!all",  // Commence directement avec une chaîne
      label: ""
    };
    let locales = {
      sip_value: "",  // Une seule valeur pour locale
      label: ""
    };
    let moh = {
      sip_value: "",  // Une seule valeur pour moh
      label: ""
    };
    let nat = {
      sip_value: "",
      label: ""
    };
    let app_codecs = {
      sip_value: "!all",  // Commence directement avec une chaîne
      label: ""
    };
    let app_labels = {
      activate_labels: []  // Tableau pour stocker les labels
    };
    let app_wda = {
      enable: false,
      server_stun_wda: "",
      server_port_stun_wda: ""
    };
    let app_ma = {
      enable: false,
      server_turn_ma: "",
      server_port_turn_ma: "",
      server_username_turn_ma: "",
      server_password_turn_ma: ""
    };

    // Récupérer les codecs activés
    const codecValues = [];
    const codecLabels = [];
    document.querySelectorAll('#codec_activable input[type=checkbox]:checked').forEach(checkbox => {
      codecValues.push(checkbox.value);
      codecLabels.push(checkbox.dataset.label);
    });

    // Si `sip_value` contient déjà une valeur, on la concatène avec une virgule
    if (codecValues.length > 0) {
      codecs.sip_value += `,${codecValues.join(',')}`;
    }
    // Concatène les labels s'il y a plusieurs valeurs
    codecs.label = codecLabels.join(', ');

    // Récupérer les codecs activés pour WebRTC
    const appCodecValues = [];
    const appCodecLabels = [];
    document.querySelectorAll('#codec_activable_webrtc input[type=checkbox]:checked').forEach(checkbox => {
      appCodecValues.push(checkbox.value);
      appCodecLabels.push(checkbox.dataset.label);
    });

    // Si `sip_value` contient déjà des valeurs, on ajoute une virgule pour les nouvelles valeurs
    if (appCodecValues.length > 0) {
      app_codecs.sip_value += (app_codecs.sip_value ? ',' : '') + appCodecValues.join(',');
    }

    // Concatène les labels s'il y a plusieurs valeurs
    app_codecs.label = appCodecLabels.join(', ');

    // Récupérer l'élément locale (une seule valeur)
    const localeElement = document.querySelector('.locales.selected');
    if (localeElement) {
      locales.sip_value = localeElement.dataset.value;  // Directement assigné sans boucle
      locales.label = localeElement.textContent;        // Directement assigné sans boucle
    }

    // Récupérer l'élément MOH (une seule valeur)
    const mohElement = document.querySelector('.moh.selected');
    if (mohElement) {
      moh.sip_value = mohElement.dataset.value;  // Directement assigné sans boucle
      moh.label = mohElement.textContent;        // Directement assigné sans boucle
    }

    // Récupérer l'état NAT
    const nat_tenant = document.getElementById("nat_tenant").checked;
    nat.sip_value = 'rtp_symmetric,rewrite_contact';
    nat.label = nat_tenant ? 'yes' : 'no';

    // Récupérer l'état STUN WDA
    const active_stun_wda = document.getElementById("active_stun_wda").checked;
    app_wda.enable = active_stun_wda;
    if (active_stun_wda) {
      app_labels.activate_labels.push("wazo-euc-application-web", "wazo-euc-application-desktop");
    }

    const stunWdaElement = document.querySelector("input[name='server_stun_wda']");
    const stunPortElement = document.querySelector("input[name='server_port_stun_wda']");
    if (stunWdaElement) {
      app_wda.server_stun_wda = stunWdaElement.value;
    }
    if (stunPortElement) {
      app_wda.server_port_stun_wda = stunPortElement.value;
    }

    // Récupérer l'état TURN MA
    const active_turn_ma = document.getElementById("active_turn_ma").checked;
    app_ma.enable = active_turn_ma;
    if (active_turn_ma) {
      app_labels.activate_labels.push("wazo-euc-application-mobile");
    }

    const turnMaElement = document.querySelector("input[name='server_turn_ma']");
    const portTurnMaElement = document.querySelector("input[name='server_port_turn_ma']");
    const usernameTurnMaElement = document.querySelector("input[name='server_username_turn_ma']");
    const passwordTurnMaElement = document.querySelector("input[name='server_password_turn_ma']");

    if (turnMaElement) {
      app_ma.server_turn_ma = turnMaElement.value;
    }
    if (portTurnMaElement) {
      app_ma.server_port_turn_ma = portTurnMaElement.value;
    }
    if (usernameTurnMaElement) {
      app_ma.server_username_turn_ma = usernameTurnMaElement.value;
    }
    if (passwordTurnMaElement) {
      app_ma.server_password_turn_ma = passwordTurnMaElement.value;
    }

    // Création du fichier JSON
    dkeys.codecs = codecs;
    dkeys.locale = locales;
    dkeys.moh = moh;
    dkeys.nat = nat;
    dkeys.app_labels = app_labels;
    dkeys.app_codecs = app_codecs;
    dkeys.app_ma = app_ma;
    dkeys.app_wda = app_wda;

    // Appel à la fonction pour ajouter les infos au résumé
    addInfoToSummary(dkeys);
  });
});

// BOUTON ENREGISTRER EVENEMENT SUR CLICK
btn_submit.forEach(element => {
    element.addEventListener("click", e => {
      updateSipTemplateEndpoint(dkeys);
    });
});

// TEMPLATE BTN SUPPR
btn_template_remove.forEach(element => {
    element.addEventListener("click", () => {
      localStorage.removeItem('template_keys');
      location.reload();
    });
  });

// BTN EXPORT TEMPLATE
btn_template_export.forEach(element => {
  element.addEventListener("click", () => {
    exportToJsonFile('template_keys')
  });
});

// BTN IMPORT TEMPLATE
btn_template_import.forEach(element => {
  element.addEventListener("click", () => {
    const fileInput = document.getElementById('file_template_import');
    const file = fileInput.files[0];
    const errorMessage = document.getElementById('template_import_errorMessage');

    // Réinitialiser le message d'erreur
    errorMessage.style.display = 'none';

    if (file) {
        importJsonToLocalStorage(file);
    } else {
        console.log('Veuillez sélectionner un fichier à importer.');
        // Afficher un message d'erreur si aucun fichier n'est sélectionné
        errorMessage.style.display = 'block';
    }
  });
});

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
  const label = document.getElementById("flexSwitchCheckEnableTemplate_label");
  btn_template_active_template.checked 
    ? label.classList.remove("text-danger", "fw-bold")
    : label.classList.add("text-danger", "fw-bold");
})
// Changement état STUN
// Fonction pour montrer un élément avec une transition fluide
const showElement = (el) => {
    el.style.visibility = "visible"; // Rendre l'élément visible
    el.style.opacity = "0"; // Commencer avec une opacité à 0 pour l'animation
    el.style.height = "0"; // Commencer avec une hauteur à 0
    el.style.overflow = "hidden"; // Empêcher le contenu de déborder
    el.classList.remove('hide'); // Supprimer la classe 'hide' si présente

    // Lancer la transition
    setTimeout(() => {
        el.style.height = el.scrollHeight + "px"; // Ajuster la hauteur pour l'animation
        el.style.opacity = "1"; // Faire apparaître l'élément
    }, 10); // Petit délai pour démarrer la transition

    // Après la transition, restaurer la hauteur auto
    setTimeout(() => {
        el.style.height = "auto"; // Restaurer la hauteur auto pour les ajustements dynamiques
    }, 500); // Correspond à la durée de la transition CSS
}

// Fonction pour masquer un élément avec une transition fluide
const hideElement = (el) => {
    el.style.height = el.scrollHeight + "px"; // Définir la hauteur actuelle avant la transition
    el.style.opacity = "1"; // Assurer que l'opacité est au maximum
    el.style.overflow = "hidden"; // Gérer le débordement de contenu

    // Lancer la transition
    setTimeout(() => {
        el.style.height = "0"; // Réduire la hauteur pour cacher l'élément
        el.style.opacity = "0"; // Réduire l'opacité pour l'animation
    }, 10);

    // Cacher l'élément après la transition
    setTimeout(() => {
        el.style.visibility = "hidden"; // Cacher complètement l'élément
        el.classList.add('hide'); // Ajouter la classe 'hide' après la transition
    }, 500); // Durée de la transition
}

btn_stun.forEach(element_stun => {
    const server_stun_wda = document.getElementsByName("server_stun_wda");
    const server_port_stun_wda = document.getElementsByName("server_port_stun_wda");

    element_stun.addEventListener("change", () => {
        const isChecked = element_stun.checked; // Vérifier l'état de la checkbox
      [...server_stun_wda].forEach(box => box.classList.toggle("required"));
      [...server_port_stun_wda].forEach(box => box.classList.toggle("required"));
      document.querySelectorAll(".server_stun_wda, .server_port_stun_wda").forEach(el => 
      {
        if (isChecked) {
            showElement(el); // Appeler la fonction pour montrer l'élément
        } else {
            hideElement(el); // Appeler la fonction pour masquer l'élément
        }
      });
    });
});
  
// Changement état TURN
btn_turn.forEach(element_turn => {
    const server_turn_ma = document.getElementsByName("server_turn_ma");
    const server_port_turn_ma = document.getElementsByName("server_port_turn_ma");
    const server_username_turn_ma = document.getElementsByName("server_username_turn_ma");
    const server_password_turn_ma = document.getElementsByName("server_password_turn_ma");

    element_turn.addEventListener("change", () => {
        const isChecked = element_turn.checked; // Vérifier l'état de la checkbox
        [...server_turn_ma].forEach(box => box.classList.toggle("required"));
        [...server_port_turn_ma].forEach(box => box.classList.toggle("required"));
        [...server_username_turn_ma].forEach(box => box.classList.toggle("required"));
        [...server_password_turn_ma].forEach(box => box.classList.toggle("required"));
        document.querySelectorAll(".server_turn_ma, .server_port_turn_ma, .server_username_turn_ma, .server_password_turn_ma").forEach(el => 
        {
            if (isChecked) {
                showElement(el); // Appeler la fonction pour montrer l'élément
            } else {
                hideElement(el); // Appeler la fonction pour masquer l'élément
            }
        });
    });
});


// BASE : on regarde si le type admin possède les ACL pour charger les éléments.
const get_admin_type = () => {
    (async () => {
        await app.initialize();
        const context = app.getContext();
        console.log(context);
        tenant_uuid = context.app.extra.tenant;
        host = 'https://' + context.app.extra.stack.host;
        port = context.app.extra.stack.port;
        token_session = context.app.extra.stack.session.token;
    
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Wazo-Tenant': tenant_uuid,
                'X-Auth-Token': token_session
            }
        };
        const admin_authorized = Object.values(context.user.acl).includes("deployd.#");

    if (admin_authorized == false) {

        //step0 UPDATE
        document.getElementById('title_text').innerHTML = i18next.t('global.admin_access');
        document.getElementById('subtitle_text').innerHTML = i18next.t('global.admin_access_text');
        document.getElementById('step0_panel1_title').innerHTML = i18next.t('global.admin_access_text');
        //desactivation des elements step0
        const elementsList = document.querySelectorAll("#step0_panel1_lang, #step0_panel1_codecs, #step0_panel1_moh, #step0_panel1_nat, #step0_panel2_title, #step0_panel2_codecs, #step0_panel2_apps, #forward, #step1_tippy_app_show");
        const elementsArray = [...elementsList];
        elementsArray.forEach(element => {
            // console.log(element);
            element.style.display = "none"
        });
    }
    else {
        
            const api_auth_tenant_read = '/api/auth/0.1/tenants?offset=0';
            const api_confd_moh = '/api/confd/1.1/moh?recurse=false';
            const api_confd_sip_temp_global_get = '/api/confd/1.1/endpoints/sip/templates?recurse=false&search=global';
            const api_confd_sip_temp_webrtc_get = '/api/confd/1.1/endpoints/sip/templates?recurse=false&search=webrtc';
            const api_confd_apps_get = '/api/confd/1.1/external/apps?recurse=false';
        
            // appel api pour connaitre le nom du tenant et lexposer dans la page d'accueil
            const client_site_name = await fetch(host + ':' + port + api_auth_tenant_read, options).then(response => response.json());
            // appel api pour lister le template SIP Global et exposer les variables dans la page d'accueil 
            const template_sip_global_data = await fetch(host + ':'  + port + api_confd_sip_temp_global_get, options).then(response => response.json());
            // appel api pour lister le template SIP WEBRTC et exposer les variables dans la page d'accueil 
            const template_sip_webrtc_data = await fetch(host + ':'  + port + api_confd_sip_temp_webrtc_get, options).then(response => response.json());
            // appel api pour lister les noms et uuid des musiques dattente
            const moh_list = await fetch(host + ':'  + port + api_confd_moh, options).then(response => response.json());
            // appel api pour liste les configuration dapp existante
            apps_list = await fetch(host + ':'  + port + api_confd_apps_get, options).then(response => response.json());
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
            // Indicateurs de template
            const templateInfoTextElement = document.getElementById("template_info_text");
        
            //CONSTRUCTOR
            if ("template_keys" in localStorage) {
              
                
                template = JSON.parse(localStorage.getItem('template_keys'));
                
               //1.1.04 fix breaking change de valeur yes/no en true/false, permettant de changer le valeur sans refaire le template
                if (template && (template.template_enable === 'yes' || template.template_enable === 'no')) {
                    template.template_enable = template.template_enable === 'yes'; // true si 'yes', false si 'no'
                    localStorage.setItem('template_keys', JSON.stringify(template));
                    location.reload();
                }

                // console.log('template en localstorage')
        
                document.getElementById("template_active_codec_video_enable").checked = template.app_codecs.video;
                //WDA Template
                document.getElementById("template_active_stun_wda").checked = (template.app_wda.enable === true); //boolean value
                document.getElementsByName("template_server_stun_wda")[0].value = template.app_wda.server_stun_wda;
                document.getElementsByName("template_server_port_stun_wda")[0].value = template.app_wda.server_port_stun_wda;
                //MA Template
                document.getElementById("template_active_turn_ma").checked = (template.app_ma.enable === true); //boolean value
                document.getElementsByName("template_server_turn_ma")[0].value = template.app_ma.server_turn_ma;
                document.getElementsByName("template_server_port_turn_ma")[0].value = template.app_ma.server_port_turn_ma;
                document.getElementsByName("template_server_username_turn_ma")[0].value = template.app_ma.server_username_turn_ma;
                document.getElementsByName("template_server_password_turn_ma")[0].value = template.app_ma.server_password_turn_ma;
                //NAT Template
                let template_nat_tenant = document.getElementById("template_nat_tenant");
                (template.nat.label === 'yes') ? template_nat_tenant.checked = true: template_nat_tenant.checked = false;
        
                if (template.template_enable === true) {
                    // console.log('template actif')
                    document.getElementById("flexSwitchCheckEnableTemplate").checked = true;
                    //BTN ENABLE
                    (btn_template_active_template.checked == false) ? document.getElementById("flexSwitchCheckEnableTemplate_label").classList.add("text-danger", "fw-bold"): document.getElementById("flexSwitchCheckEnableTemplate_label").classList.remove("text-danger", "fw-bold");

                    //modification de l'incateur
                    templateInfoTextElement.innerHTML = i18next.t('template.template_info_text');
                    templateInfoTextElement.classList.add("bg-success");

                    document.getElementsByName("template_remove")[0].style.display = 'inline';
        
                    document.getElementById("active_codec_video_enable").checked = template.app_codecs.video;
        
                    //NAT Wizard
                    // let nat_tenant = document.getElementById("nat_tenant");
                    let nat_tenant = document.getElementById("nat_tenant");
                    (template.nat.label === 'yes') ? nat_tenant.checked = true : nat_tenant.checked = false;
        
        
                    //WDA Wizard
                    document.getElementById("active_stun_wda").checked = (template.app_wda.enable === true); //boolean value
                    document.getElementsByName("server_stun_wda")[0].value = template.app_wda.server_stun_wda;
                    document.getElementsByName("server_port_stun_wda")[0].value = template.app_wda.server_port_stun_wda;
                    //WDA Wizard cache zone WDA
                    if (document.getElementById("active_stun_wda").checked == false) {
                        let server_stun_wda = document.getElementsByName("server_stun_wda")[0];
                        let server_port_stun_wda = document.getElementsByName("server_port_stun_wda")[0];
                        server_stun_wda.classList.toggle("required");
                        server_port_stun_wda.classList.toggle("required");
                        // ajouter 'hide', pour cacher l'element
                        document.querySelectorAll(".server_stun_wda, .server_port_stun_wda").forEach(el => {
                                el.classList.add('hide'); 
                        });
                    }
        
        
                    // MA Wizard
                    document.getElementById("active_turn_ma").checked = (template.app_ma.enable === true); //boolean value
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
                        document.querySelectorAll(".server_turn_ma, .server_port_turn_ma, .server_username_turn_ma, .server_password_turn_ma").forEach(el => {
                                el.classList.add('hide'); // Si l'élément est caché au départ, ajouter 'hide'
                        });
                    }
        
                } else {
                  // console.log('template non actif')
                    document.getElementsByName("template_remove")[0].style.display = 'inline';
                    //modification de l'incateur
                    templateInfoTextElement.innerHTML = i18next.t('template.template_info_text_case2');
                    templateInfoTextElement.classList.add("bg-warning", "text-dark");
                }
            } else {
                // console.log('template pas trouvé');
                document.getElementsByName("template_remove")[0].style.display = 'none';
                //modification de l'incateur
                templateInfoTextElement.innerHTML = i18next.t('template.template_info_text_case3');
                templateInfoTextElement.classList.add("bg-secondary");
        
            }
        
            /////// FIN TEMPLATE
            // condition pour afficher la liste des conf d'app activent et la bulle d'information 
            const apps_list_active = (apps_list.total > 0) ? i18next.t('global.yes') + " (" + dock_value_apps + ")" : (document.getElementById("step1_tippy_app_show").style.display = "none", i18next.t('global.no'));
        
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
            let selectLocalesSelect = "";
            let templateSelectLocalesSelect = "";
            const localesTenantSelect = $("#locales_tenant");
            const localesTenantSelectTemplate = $("#template_locales_tenant");

            locale_list.forEach(locale => {
              console.log(locale);
              
            const { locale: localeValue, locale_text: localeText } = locale;
            const localeOption = `<option data-label="${localeText}" value="${localeValue}">${i18next.t('locales_pbx.' + localeText)}</option>`;
            const selectedOption = `<option selected data-label="${localeText}" value="${localeValue}">${i18next.t('locales_pbx.' + localeText)}</option>`;

            if ("template_keys" in localStorage) {        
                if (template.template_enable === false && localeValue == template.locale.sip_value) {
                    templateSelectLocalesSelect += selectedOption;
                } else if (template.template_enable === true && localeValue == template.locale.sip_value) {
                    selectLocalesSelect += selectedOption;
                    templateSelectLocalesSelect += selectedOption;
                } else {
                    selectLocalesSelect += localeOption;
                    templateSelectLocalesSelect += localeOption;
                }
            } else {
                selectLocalesSelect += localeOption;
                templateSelectLocalesSelect += localeOption;
            }
            });

            localesTenantSelect.append(selectLocalesSelect);

            localesTenantSelect.each(function() {
            const $select = $(this);
            const $dropdown = $select.next('.nice-select');
            const isOpen = $dropdown.hasClass('open');

            if ($dropdown.length) {
                $dropdown.remove();
                create_nice_select($select, 'locales');
                if (isOpen) {
                    $select.next().trigger('click');
                }
            }
            });

            localesTenantSelectTemplate.append(templateSelectLocalesSelect);
            localesTenantSelectTemplate.each(function() {
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
                if ("template_keys" in localStorage && template.template_enable === true) {
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
                } else if ("template_keys" in localStorage && template.template_enable === false) {
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
            document.getElementsByName("lang")[0].innerHTML = i18next.t('locales_pbx.'+language_data);
            document.getElementsByName("codec")[0].innerHTML = dock_value_codecs;
            document.getElementsByName("codec_webrtc")[0].innerHTML = dock_value_codecs_webrtc;
            document.getElementsByName("apps_webrtc")[0].innerHTML = apps_list_active;
            if (template_sip_global_endpoint_section_options.rtp_symmetric === "yes" && template_sip_global_endpoint_section_options.rewrite_contact === "yes") {
                document.getElementsByName("nat")[0].innerHTML = i18next.t('global.yes')
            } else {
                document.getElementsByName("nat")[0].innerHTML = i18next.t('global.no')
            }
            // MOH 
            if (template_sip_global_endpoint_section_options.moh_suggest === undefined) {
                document.getElementsByName("moh")[0].innerHTML = i18next.t('global.undefined')
            } else {
                document.getElementsByName("moh")[0].innerHTML = template_sip_global_endpoint_section_options.moh_suggest
            }
    }
    })();
    
}
get_admin_type()
