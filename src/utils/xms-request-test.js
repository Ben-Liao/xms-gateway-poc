const axios = require('axios');
const xml2js = require('xml2js');

const username = 'bliao';
const password = 'Password123!@#';
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
const xmsurl = 'http://10.212.44.102:81/default/eventhandlers?tag=remotecontrol_;appid=5632772e-b379-4d73-b84d-633e4c64097e';

const data = `<?xml version="1.0" encoding="UTF-8" ?>
<web_service
    version="1.0">
    <eventhandler>
        <eventsubscribe
            action="add"
            resource_id="any"
            resource_type="any"
            type="any"/>
        <webhooks
            action="add"
            url="https://efa2-159-2-180-142.ngrok-free.app/webhook/tenant/c76c67ef-0ca9-4f52-854b-8d5cc2ee3cfb/interaction/2475a9e3-4364-4f1a-8d41-51705f15aca9"/>
    </eventhandler>
</web_service>`;

axios.post(xmsurl, data, {
  headers: {
    'Content-Type': 'application/xml',
    Authorization: `Basic ${token}`,
  },
})
  .then((response) => new Promise((resolve, reject) => {
    xml2js.parseString(response.data, (err, result) => {
      if (err) {
        console.log('errors:', err);
        reject(err);
      } else {
        console.log('Result:', JSON.stringify(result)); // 打印出 result
        resolve({
          status: 200,
          body: result,
        });
      }
    });
  }))
  .catch((err) => {
    // Handle error
    console.log('getRequest Errors:', err);
    return {
      status: -1,
      body: {
        message: 'failed, http get request',
        error: err.response.data,
      },
    };
  });
