import { template_sip_global_data_uuid, host, tenant_uuid, token_session } from "./index";
// function pour update du sip template
export async function update_sip_template_endpoint(keys) {
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
        const btn_submit = document.getElementsByClassName("submit");
        const btn_next = document.getElementsByClassName("backward");
        for (let element of btn_submit) {
          element.setAttribute('disabled', 'yes');
        }
        for (let element of btn_next) {
            element.setAttribute('disabled', 'yes');
          }
        document.getElementById("title_text").innerText = "Terminé !";
        document.getElementById("subtitle_text").innerText = ""
      } else {
          console.log("no auth");
      }
      } catch (erreur) {
          console.error("Erreur :", erreur); 
      }
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
    check_before_send.innerHTML = "<li><span class='font-weight-bold'> Langue :</span> "+ data_keys.locale.label + "</li>" +
                                  "<li><span class='font-weight-bold'>Codecs activés :</span> "+ data_keys.codecs.label + "</li>" +
                                  "<li><span class='font-weight-bold'>Musique d'attente :</span> "+ data_keys.moh.label + "</li>" +
                                  "<li><span class='font-weight-bold'>Nat Actif :</span> "+ data_keys.nat.label + "</li>"
  
}