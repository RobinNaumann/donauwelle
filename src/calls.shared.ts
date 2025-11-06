import { serverCall } from "donau/servercalls/shared";
import { sharedServerChannel } from "donau/serverchannels/shared";

export const serverCallDefinitions = {
  squared: serverCall<{ n: number }, number>(),
  asString: serverCall<{ x: number }, string>(),
};

export const serverChannelDefinitions = {
  live: sharedServerChannel<{}, { message: string }>({
    sendLatestOnConnect: true,
  }),
};
