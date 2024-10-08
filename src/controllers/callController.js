// require("dotenv").config();
// const AccessToken = require("twilio").jwt.AccessToken;
// const VoiceGrant = AccessToken.VoiceGrant;
// const VoiceResponse = require("twilio").twiml.VoiceResponse;
// const defaultIdentity = "alice";
// const callerId = "client:quick_start";
// const callerNumber = "1234567890";

// function tokenGenerator(request, response) {
//   var identity = null;
//   if (request.method == "POST") {
//     identity = request.body.identity;
//   } else {
//     identity = request.query.identity;
//   }

//   if (!identity) {
//     identity = defaultIdentity;
//   }

//   // Used when generating any kind of tokens
//   const accountSid = process.env.ACCOUNT_SID;
//   const apiKey = process.env.API_KEY;
//   const apiSecret = process.env.API_KEY_SECRET;

//   // Used specifically for creating Voice tokens
//   const pushCredSid = process.env.PUSH_CREDENTIAL_SID;
//   const outgoingApplicationSid = process.env.APP_SID;

//   // Create an access token which we will sign and return to the client,
//   // containing the grant we just created
//   const voiceGrant = new VoiceGrant({
//     outgoingApplicationSid: outgoingApplicationSid,
//     pushCredentialSid: pushCredSid,
//   });

//   // Create an access token which we will sign and return to the client,
//   // containing the grant we just created
//   const token = new AccessToken(accountSid, apiKey, apiSecret);
//   token.addGrant(voiceGrant);
//   token.identity = identity;
//   console.log("Token:" + token.toJwt());
//   return response.send(token.toJwt());
// }

// function makeCall(request, response) {
//   // The recipient of the call, a phone number or a client
//   var to = null;
//   if (request.method == "POST") {
//     to = request.body.to;
//   } else {
//     to = request.query.to;
//   }

//   const voiceResponse = new VoiceResponse();

//   if (!to) {
//     voiceResponse.say(
//       "Congratulations! You have made your first call! Good bye."
//     );
//   } else if (isNumber(to)) {
//     const dial = voiceResponse.dial({ callerId: callerNumber });
//     dial.number(to);
//   } else {
//     const dial = voiceResponse.dial({ callerId: callerId });
//     dial.client(to);
//   }
//   console.log("Response:" + voiceResponse.toString());
//   return response.send(voiceResponse.toString());
// }

// async function placeCall(request, response) {
//   // The recipient of the call, a phone number or a client
//   var to = null;
//   if (request.method == "POST") {
//     to = request.body.to;
//   } else {
//     to = request.query.to;
//   }
//   console.log(to);
//   // The fully qualified URL that should be consulted by Twilio when the call connects.
//   var url = request.protocol + "://" + request.get("host") + "/incoming";
//   console.log(url);
//   const accountSid = process.env.ACCOUNT_SID;
//   const apiKey = process.env.API_KEY;
//   const apiSecret = process.env.API_KEY_SECRET;
//   const client = require("twilio")(apiKey, apiSecret, {
//     accountSid: accountSid,
//   });

//   if (!to) {
//     console.log("Calling default client:" + defaultIdentity);
//     call = await client.api.calls.create({
//       url: url,
//       to: "client:" + defaultIdentity,
//       from: callerId,
//     });
//   } else if (isNumber(to)) {
//     console.log("Calling number:" + to);
//     call = await client.api.calls.create({
//       url: url,
//       to: to,
//       from: callerNumber,
//     });
//   } else {
//     console.log("Calling client:" + to);
//     call = await client.api.calls.create({
//       url: url,
//       to: "client:" + to,
//       from: callerId,
//     });
//   }
//   console.log(call.sid);
//   //call.then(console.log(call.sid));
//   return response.send(call.sid);
// }

// /**
//  * Creates an endpoint that plays back a greeting.
//  */
// function incoming() {
//   const voiceResponse = new VoiceResponse();
//   voiceResponse.say(
//     "Congratulations! You have received your first inbound call! Good bye."
//   );
//   console.log("Response:" + voiceResponse.toString());
//   return voiceResponse.toString();
// }

// function isNumber(to) {
//   if (to.length == 1) {
//     if (!isNaN(to)) {
//       console.log("It is a 1 digit long number" + to);
//       return true;
//     }
//   } else if (String(to).charAt(0) == "+") {
//     number = to.substring(1);
//     if (!isNaN(number)) {
//       console.log("It is a number " + to);
//       return true;
//     }
//   } else {
//     if (!isNaN(to)) {
//       console.log("It is a number " + to);
//       return true;
//     }
//   }
//   console.log("not a number");
//   return false;
// }

// module.exports = { tokenGenerator, makeCall, placeCall, incoming };
