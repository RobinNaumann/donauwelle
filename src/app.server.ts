//
// "app.server.ts" IS THE ENTRY POINT TO YOUR APPLICATION.
// YOU CAN MODIFY IT, BUT MAKE SURE NOT TO REMOVE IT
//

import { donauServerRun, err, route, serveFrontend } from "donau/server";
import { handleServerCalls } from "donau/servercalls/server";
import { ServerChannelServer } from "donau/serverchannels/server";
import {
  serverCallDefinitions,
  serverChannelDefinitions,
} from "./calls.shared";

const PORT = Number.parseInt(process.env.PORT ?? "3000");

export const channelServer = new ServerChannelServer({
  sharedChannels: serverChannelDefinitions,
});
channelServer.handleShared({
  live: async (params, client) => {
    // this will be called when a client sends a message
  },
});

const serverCallRoutes = handleServerCalls(serverCallDefinitions, {
  asString: async ({ x }) => {
    return x.toString();
  },

  /**
   * calculates n^2 of a number n
   * @param n the number to calculate the square for
   * @returns the square of n
   */
  squared: async ({ n }) => {
    if (n >= 20) throw err.notAcceptable("number too large");
    return n * n;
  },
});

const donauServer = donauServerRun(
  PORT,
  {
    info: {
      title: "donauwelle API",
      version: "1.0.3",
      description: "the API of the donauwelle example",
    },
    routes: [
      ...serverCallRoutes,
      ...channelServer.infoRoutes(),
      route("/hello", {
        method: "get",
        description: "returns a greeting to you",
        parameters: {
          name: {
            type: "string",
            description: "your name",
            optional: false,
          },
        },
        worker: ({ name }) => {
          return `Hey, ${name}! how are you?`;
        },
      }),
    ],
  },
  [process.env.SERVE_FRONTEND === "true" ? serveFrontend("client") : null]
);
if (donauServer?.server) channelServer.serve({ server: donauServer.server });

// send demo messages to the server channels every 5 seconds
const helloInLanguages = [
  "Hello",
  "Hallo",
  "Ciao",
  "Hola",
  "Bonjour",
  "Hej",
  "Salve",
  "Olá",
  "Ahoj",
  "Nǐ hǎo",
];
setInterval(() => {
  const i = Math.floor(Math.random() * helloInLanguages.length);
  console.log(`sending message: ${helloInLanguages[i]}`);
  channelServer.shared.live.send({ message: helloInLanguages[i] });
}, 5000);
