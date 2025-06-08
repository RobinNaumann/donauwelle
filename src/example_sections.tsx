import {
  Banner,
  Button,
  Card,
  Column,
  ElbeError,
  Footer,
  Icons,
  int,
  isElbeError,
  Row,
  showToast,
  Spaced,
  Text,
  toElbeError,
} from "elbe-ui";
import { useState } from "preact/hooks";
import { L10n, useServer } from "./app";
import { apiService } from "./s_api";

export function SectionHero() {
  const { c } = L10n.useL10n();
  return (
    <Column cross="center" gap={0}>
      <img src="./donauwelle.png" height={120} />
      <Spaced height={1} />
      <Text.h2 v="donauwelle" />
      <Text v={c.tagline} italic />
    </Column>
  );
}

export function SectionAbout() {
  return (
    <Column>
      <Text.h3 v="About" />
      <span>
        donauwelle is a small, open-source template for writing web apps and
        their server/backend code in one unified project. It is build for{" "}
        <b>Bun</b> and uses <b>donau</b> for connectivity. It is configured to
        be easily deployable as a docker container.
        <br />
        It is designed for ease-of-use and mainly suitable for small projects
      </span>
      <Text.h5 v="client/server code splitting" />
      <span>
        It uses <b>Vite</b> to split the server and client code at build time.
        This allows you to re-use code accross both targets. <br />
        To avoid importing server dependencies in the client (and vice versa),
        use the following convention for your files:
        <ul>
          <li>
            <Text.code v=".server.ts" /> files are bundeled for the server
          </li>
          <li>
            <Text.code v=".shared.ts" /> files are available to both targets
          </li>
          <li>
            all other files (<Text.code v=".tsx,.ts,.js,..." />) are bundeled
            for the client
          </li>
        </ul>
      </span>
      <Text.h5 v="get started" />
      <span>
        You can integrate the features into your project or take donauwelle as a
        template:
        <ol>
          <li>
            make sure you have <a href="https://bun.sh">Bun</a> installed
          </li>
          <li>
            create a new project using <Text.code v="npm init donauwelle" />
          </li>

          <li>
            We advise using VSCode. If you want to use another editor, make sure
            to set up ESLint
          </li>
          <li>
            run the project by either the <i>Run and Debug</i> tab or{" "}
            <Text.code v="bun run serve" />
          </li>
        </ol>
      </span>
    </Column>
  );
}

export function SectionElbe() {
  return (
    <Column>
      <Text.h3 v="Frontend" />
      <span>
        This template uses <b>preact</b> and the <b>elbe</b> frontend library.
        This ensures both quick load times, and good accessibility of your web
        page.
      </span>
      <Row>
        <Button.major
          ariaLabel="open preact docs"
          label="preact docs"
          icon={Icons.ExternalLink}
          onTap={() => window.open(`https://preactjs.com/`, "_blank")}
        />
        <Button.major
          ariaLabel="open elbe-ui docs"
          label="elbe docs"
          icon={Icons.ExternalLink}
          onTap={() => window.open(`https://robbb.in/elbe/`, "_blank")}
        />
      </Row>
    </Column>
  );
}

export function SectionRestAPI() {
  return (
    <Column>
      <Text.h3 v="REST API" />
      <span>
        this template's server defines a REST API via donau. It is served under
        the <Text.code v="/api" /> prefix. It also serves a openAPI
        documentation by default.
      </span>
      <Row>
        <Button.major
          ariaLabel="open api docs"
          label="open api docs"
          icon={Icons.ExternalLink}
          onTap={() => {
            const [host, port] = window.location.host.split(":");
            const apiPort = import.meta.env.VITE_API_PORT ?? port;
            window.open(`http://${host}:${apiPort}/docs/`, "_blank");
          }}
        />
        <Button.major
          ariaLabel="call hello endpoint"
          label="call /hello?name=John"
          icon={Icons.HandMetal}
          onTap={async () => {
            const msg = await apiService.getHello("John");
            showToast(`API says: '${msg}'`);
          }}
        />
      </Row>
    </Column>
  );
}

export function SectionServerCalls() {
  return (
    <Column>
      <Text.h3 v="Server Calls" />
      <span>
        donauwelle allows you to define functions that are callable from the
        client but are executed on the server. These functions are also type
        safe in Typescript and provide built-in error handling.
        <br /> Under the hood, they utilize the REST api under the{" "}
        <Text.code v="/api/calls/" /> prefix
      </span>
      <_SCExample />

      <Text.h5 v="usage" style={{ marginTop: "1rem" }} />
      <span>
        start by defining the type signatures of your functions in a shared (
        <Text.code v=".shared.ts" />) file:
      </span>
      <Card bordered>
        <Text.code
          v={`import { serverCall } from 'donau/servercalls/shared';

export const serverCalls = {
  squared: serverCall<{ n: number }, number>(),
};`}
        />
      </Card>
      <span>
        next, define the body of these functions in a server (
        <Text.code v=".server.ts" />) file and add the routes to your donau
        config
      </span>
      <Card bordered>
        <Text.code
          v={`donauServerRun(
  ...
  routes: handleServerCalls(serverCalls, {
    squared: async ({ n }) => n*n 
}));`}
        />
      </Card>
      <span>now you can use the functions in your client files: 🎉</span>
      <Card bordered>
        <Text.code
          v={`const useServer = useServerCalls(serverCalls);

const res = await useServer.squared({n: 6});`}
        />
      </Card>
    </Column>
  );
}

function _SCExample() {
  const [n, setN] = useState(1);
  const [res, setRes] = useState<(ElbeError | int) | null>(null);
  return (
    <Card scheme="secondary">
      <Row wrap>
        <Button.major
          ariaLabel="calculate n^2"
          label={`calculate ${n}² on the server`}
          icon={Icons.Calculator}
          onTap={async () => {
            try {
              const res = await useServer.squared({ n });
              setRes(res);
              setN(n + 1);
            } catch (e) {
              setRes(toElbeError(e));
            }
          }}
        />
        {res &&
          (isElbeError(res) ? (
            <Banner
              kind="error"
              title={"server returned an error"}
              children={res.message}
            />
          ) : (
            <Text.code v={`${n - 1}² = ${res}`} bold align="center" />
          ))}
      </Row>
    </Card>
  );
}

export function AppFooter() {
  return (
    <Footer
      marginTop={3}
      right={[
        { label: "source", href: "https://github.com/RobinNaumann/donau" },
      ]}
      copyright="donauwelle"
      version="0.2.2"
      legal={{
        label: "imprint/impressum",
        href: "https://robbb.in/impressum.html",
      }}
    />
  );
}
