import { serverCall } from "donau/servercalls/shared";

export const serverCalls = {
  squared: serverCall<{ n: number }, number>(),
  asString: serverCall<{ x: number }, string>(),
};
