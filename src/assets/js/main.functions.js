import { apps_list, template_sip_webrtc_data_uuid, template_sip_global_data_uuid, host, tenant_uuid, token_session } from "./index";
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
          console.log("no auth");
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
        console.log("no auth");
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
      console.log(name + ": OK");
    }else{
      console.log(name + ": NOK");
    }
  }
  catch (erreur) {
        console.error("Erreur :", erreur); 
  }
}
// function pour update ou ajout une configuration d'application 
async function update_apps(apps_list, app_keys) {
  console.log(apps_list);
  if (apps_list.total > 0 && (app_keys.app_ma.enable == "true" || app_keys.app_wda.enable == "true")){
    console.log("Etat MA = " + app_keys.app_ma.enable);
    console.log("Etat WDA = " + app_keys.app_wda.enable);
    let apps_items = apps_list.items;
    let apps_labell = app_keys.app_labels.activate_labels;
    for (let g = 0; g < apps_labell.length; g++) {
      console.log(apps_items);
      console.log("Demande d'app conf: "+ apps_labell[g]);
      const checkItemsExist = obj => obj.name === apps_labell[g];
      console.log("CHECK ITEM");
      let label_name_check = apps_items.some(checkItemsExist);
      console.log(label_name_check);
      console.log("FIN CHECK");
      let label_name = apps_labell[g];
      //je trouve un objet dans les items dapp retournés
      if (label_name_check === true) {
        console.log("L'app existe deja alors");
        console.log("BOUCLE UPDATE");       
        if (label_name == apps_labell[g]) {
          console.log("boucle update label: "+label_name);
          await updateORcreate_ext_apps(label_name, app_keys, 0)
        }else{
          console.log("erreur boucle update");
        }
      }else if (label_name_check === false) {
        console.log("L'app N'existe PAS deja alors");
        console.log("BOUCLE CREATE");
        console.log(apps_labell[g]);
        console.log("boucle create label: "+apps_labell[g]);
        await updateORcreate_ext_apps(apps_labell[g], app_keys, 1)
      }
    }
  }else if(apps_list.total == 0 && (app_keys.app_ma.enable == "true" || app_keys.app_wda.enable == "true")){
    console.log("il ny a pas d'app configuree : ");
    console.log("MA2 = " + app_keys.app_ma.enable);
    console.log("WDA2 = " + app_keys.app_wda.enable);
    //fonction de creation des conf dapp
    let apps_label = app_keys.app_labels.activate_labels;
    for (let h = 0; h < apps_label.length; h++){
      console.log("create app : " + apps_label[h]);
      await updateORcreate_ext_apps(apps_label[h], app_keys, 1)
    }
  }
  else{
    console.log("il ny a pas d'app à configurer");
  }
  // EXIT de fin
  setTimeout(function(){
    let btn_submit = document.getElementsByClassName("submit");
    let btn_next = document.getElementsByClassName("backward");
    for (let element of btn_submit) {
      element.setAttribute('disabled', 'yes');
    }
    for (let element of btn_next) {
        element.setAttribute('disabled', 'yes');
      }
      document.getElementById("final-step-two").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
      document.getElementById("final-step-three").innerHTML = '<i class="fa-solid fa-circle-check text-success fa-beat"></i>';
    document.getElementById("title_text").innerText = "Terminé !";
    document.getElementById("subtitle_text").innerText = ""
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