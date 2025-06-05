//
// "app.server.ts" IS THE ENTRY POINT TO YOUR APPLICATION.
// YOU CAN MODIFY IT, BUT MAKE SURE NOT TO REMOVE IT
//

import { donauServerRun, err } from "donau";
import { handleServerCalls, serveFrontend } from "donau/servercalls/server";
import { serverCalls } from "./calls.shared";

const PORT = Number.parseInt(process.env.PORT ?? "3000");

donauServerRun(
  PORT,
  {
    info: {
      title: "donauwelle API",
      version: "1.0.3",
      description: "the API of the donauwelle example",
    },
    routes: handleServerCalls(serverCalls, {
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
    }),
  },
  [process.env.SERVE_FRONTEND === "true" && serveFrontend("client")]
);
