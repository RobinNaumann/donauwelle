import { useServerCalls } from "donau/servercalls/client";
import {
  AppBase,
  Button,
  Column,
  ElbeTheme,
  Icons,
  makeL10n,
  Page,
  Route,
} from "elbe-ui";
import { render } from "preact";
import { useState } from "preact/hooks";
import { serverCalls } from "./calls.shared";
import {
  AppFooter,
  SectionAbout,
  SectionElbe,
  SectionHero,
  SectionRestAPI,
  SectionServerCalls,
} from "./example_sections";

export const useServer = useServerCalls(
  serverCalls,
  import.meta.env.VITE_API_PORT ?? null
);

// you can define localized strings that automatically adapt to
// the browsers language
export const L10n = makeL10n(
  { en_US: { tagline: "easily write web apps with server logic." } },
  { de_DE: { tagline: "Schreibe Web-Apps mit Server-Logik." } }
);

function App() {
  const [dark, setDark] = useState(false);
  const [highVis, setHighVis] = useState(false);

  return (
    <L10n.L10n>
      <ElbeTheme
        highVis={highVis}
        dark={dark}
        seed={{
          color: {
            accent: "#713c1c",
          },
        }}
      >
        <AppBase
          globalActions={[
            <Button.plain
              label="High Visibility"
              ariaLabel="toggle high visibility mode"
              icon={highVis ? Icons.Paintbrush : Icons.Contrast}
              onTap={() => setHighVis(!highVis)}
            />,
            <Button.plain
              label="Dark Mode"
              ariaLabel="toggle dark mode"
              icon={dark ? Icons.Sun : Icons.Moon}
              onTap={() => setDark(!dark)}
            />,
          ]}
        >
          <Route path="/">
            <_Home />
          </Route>
        </AppBase>
      </ElbeTheme>
    </L10n.L10n>
  );
}

function _Home() {
  return (
    <Page title="donauwelle" narrow footer={<AppFooter />} actions={[]}>
      <Column gap={3}>
        <div style="padding: 3rem 0">
          <SectionHero />
        </div>
        <SectionAbout />
        <SectionElbe />
        <SectionRestAPI />
        <SectionServerCalls />
        <i>
          Have fun ☺️
          <br />
          yours, Robin
        </i>
      </Column>
    </Page>
  );
}

const root = document.getElementById("root");
if (root) render(<App />, root);
