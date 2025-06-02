import { serverCall } from "donau/servercalls/shared";

export const serverCalls = {
  faculty: serverCall<{ n: number }, number>(),
  asString: serverCall<{ x: number }, string>(),
};
