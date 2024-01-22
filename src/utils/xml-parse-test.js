const xml2js = require('xml2js');

function parseXml(xml) {
  return xml2js.parseStringPromise(xml, { explicitArray: false })
    .then((result) => {
      if (result.web_service && result.web_service.event && result.web_service.event.event_data) {
        const eventDataArray = result.web_service.event.event_data;
        const eventDataObject = {};
        eventDataArray.forEach((item) => {
          eventDataObject[item.$.name] = item.$.value;
        });
        const newResult = JSON.parse(JSON.stringify(result));
        newResult.web_service.event.event_data = eventDataObject;
        return newResult;
      }
      return result;
    });
}

// Example XML string (replace this with your actual XML data)
// const xmlData = `<web_service version="1.0">
// <event
//     type="incoming"
//     resource_id="a964609b-aac3-4927-b2e5-5a02ca391131"
//     resource_type="call">
//     <event_data
//         name="call_id"
//         value="a964609b-aac3-4927-b2e5-5a02ca391131"/>
//     <event_data
//         name="called_uri"
//         value="sip:_SIP_1_@10.51.45.13;tag=3638a0a3b7bd524b"/>
//     <event_data
//         name="caller_uri"
//         value="1 &lt;sip:iptB1T1@10.164.90.54&gt;;tag=24cddbba-523ba0bb-9-7ff0113de108-365aa40a-13c4-764"/>
//     <event_data
//         name="content_count"
//         value="0"/>
//     <event_data
//         name="gusid"
//         value="3f525caab547422589418380acca9776"/>
//     <event_data
//         name="headers"
//         value="Request-URI:_SIP_1_@10.51.45.13;transport=TCP&#xD;&#xA;Call-ID:REMOTECONTROL_1-121923-194438-602-10.164.90.54&#xD;&#xA;CSeq: 1 INVITE&#xD;&#xA;To: &lt;sip:_SIP_1_@10.51.45.13&gt;&#xD;&#xA;From: 1 &lt;sip:iptB1T1@10.164.9"/>
//     <event_data
//         name="headers.Allow"
//         value="INVITE, CANCEL, ACK, BYE, OPTIONS, INFO, REFER, NOTIFY, PRACK"/>
//     <event_data
//         name="headers.CSeq"
//         value="1 INVITE"/>
//     <event_data
//         name="headers.Call-ID"
//         value="REMOTECONTROL_1-121923-194438-602-10.164.90.54"/>
//     <event_data
//         name="headers.Contact"
//         value="&lt;sip:iptB1T1@10.164.90.54&gt;"/>
//     <event_data
//         name="headers.Content-Length"
//         value="390"/>
//     <event_data
//         name="headers.Content-Type"
//         value="application/sdp"/>
//     <event_data
//         name="headers.From"
//         value="1 &lt;sip:iptB1T1@10.164.90.54&gt;;tag=24cddbba-523ba0bb-9-7ff0113de108-365aa40a-13c4-764"/>
//     <event_data
//         name="headers.Request-URI"
//         value="_SIP_1_@10.51.45.13;transport=TCP"/>
//     <event_data
//         name="headers.Supported"
//         value="replaces, 100rel, sdp-anat"/>
//     <event_data
//         name="headers.To"
//         value="&lt;sip:_SIP_1_@10.51.45.13&gt;"/>
//     <event_data
//         name="headers.User-Agent"
//         value="RemoteControl 1.0 trunk-12885"/>
//     <event_data
//         name="name"
//         value="app"/>
//     <event_data
//         name="prack_level"
//         value="supported"/>
//     <event_data
//         name="type"
//         value="OFFER"/>
//     <event_data
//         name="uri"
//         value="sip:_SIP_1_@10.51.45.13;transport=TCP"/>
//     </event>
// </web_service>`;

const xmlData = `<web_service version="1.0">
<event
    type="stream"
    resource_id="ed1753fe-c1ba-44ca-af77-2a91f0a0bf9c"
    resource_type="call">
    <event_data
        name="call_id"
        value="ed1753fe-c1ba-44ca-af77-2a91f0a0bf9c"/>
    <event_data
        name="gusid"
        value="09fdc3764aa84c3a964b6470e1308518"/>
    <event_data
        name="state"
        value="streaming"/>
    <event_data
        name="type"
        value="STREAM"/>
    </event>
</web_service>`;

parseXml(xmlData)
  .then((parsedData) => console.log(JSON.stringify(parsedData, null, 2)))
  .catch((err) => console.error(err));

module.exports = parseXml;
