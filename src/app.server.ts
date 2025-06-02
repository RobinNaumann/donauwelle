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
       * calculates the factorial of a number n.
       * @param n the number to calculate the factorial for
       * @returns the factorial of n
       */
      faculty: async ({ n }) => {
        if (n < 0) throw err.notAcceptable("Negative numbers are not allowed");
        if (n >= 20) throw err.notAcceptable("number too large");
        if (n === 0 || n === 1) return 1;
        return Array.from({ length: n - 1 }, (_, i) => i + 2).reduce(
          (res, i) => res * i,
          1
        );
      },
    }),
  },
  [process.env.SERVE_FRONTEND === "true" && serveFrontend("client")]
);
