console.log("Hello World!");
import { App } from '@wazo/euc-plugins-sdk';
const clm = require('country-locale-map');
// import { Context } from '@wazo/euc-plugins-sdk/types';
const app = new App();
const codec_list = {
    "alaw": "G711a",
    "ulaw": "G711u",
    "h264": "h264"
};




(async () => {
  await app.initialize();
  const context = app.getContext();
  const tenant_uuid = context.app.extra.tenant
  const host = 'https://'+context.app.extra.instance.host
  const token_session = context.app.extra.instance.session.token
  const api_confd_infos = '/api/confd/1.1/infos'; 
  const api_auth_tenant_read = '/api/auth/0.1/tenants?offset=0'

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Wazo-Tenant': tenant_uuid,
      'X-Auth-Token': token_session
    }
  };
// appel api pour connaitre le nom du tenant et lexposer dans la page d'accueil
  const client_site_name = await fetch(host+api_auth_tenant_read, options).then(response => response.json());
// appel api pour lister le template SIP Global et exposer les variables dans la page d'accueil 
  const template_sip_global_data = await fetch(host+"/api/confd/1.1/endpoints/sip/templates?recurse=false&search=global", options).then(response => response.json());
//   console.log(template_sip_global_data);
  const endpoint_section_options = template_sip_global_data.items[0].endpoint_section_options;
  const template_sip_global_endpoint_section_options = new Array();

  for (let i = 0; i < endpoint_section_options.length; i++) {
    for (let f = 0; f < endpoint_section_options[i].length; f++) {
        if ([f] == 0){
            template_sip_global_endpoint_section_options[endpoint_section_options[i][f]] = "no value"
        }
        if ([f]==1) {
            template_sip_global_endpoint_section_options[endpoint_section_options[i][f-1]] = endpoint_section_options[i][f]
        }
    }
  }
  let language_data = template_sip_global_endpoint_section_options.language;
  
  let allow_data = template_sip_global_endpoint_section_options.allow;
  let allow_data_array = allow_data.split(",");
  console.log(allow_data_array);
  console.log(codec_list.alaw);
  console.log('alaw' in codec_list);
  let dock_value_codecs = "";
  for (var a in allow_data_array)
    {
        let codec = allow_data_array[a]
        if (codec in codec_list){
            console.log("if codec list: " + true);
            console.log(codec);
            console.log(codec_list[codec]);
            dock_value_codecs += codec_list[codec]+" ";
        }     
    }

  if(template_sip_global_endpoint_section_options.moh_suggest === undefined){
    document.getElementsByName("moh")[0].value = "Option non définie"
  }else{
    document.getElementsByName("moh")[0].value = template_sip_global_endpoint_section_options.moh_suggest
  }

  document.getElementById("client_site_name").innerHTML = client_site_name.items[0].name;
  document.getElementsByName("lang")[0].value = clm.getCountryNameByAlpha2(language_data.slice(-2));
  document.getElementsByName("codec")[0].value = dock_value_codecs;
//   document.getElementsByName("moh")[0].value = template_sip_global_endpoint_section_options.moh_suggest;
  if(template_sip_global_endpoint_section_options.rtp_symmetric && template_sip_global_endpoint_section_options.rewrite_contact){
    document.getElementsByName("nat")[0].value = "yes"
  }else{
    document.getElementsByName("nat")[0].value = "no"
  }

console.log(context);
console.log("Stack Host: "+ host );
console.log("Token: "+ token_session);
console.log("Tenant UUID: "+ tenant_uuid);

})();