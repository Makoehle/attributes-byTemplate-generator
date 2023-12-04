<script setup lang="ts">
import {
  LoginManager,
  LoginManagerConfiguration,
} from "@bosch-engineering/azure-ad-auth-browser";
import { computed, onMounted, ref } from "vue";
import type { AuthenticationResult } from "@azure/msal-common";

const authResult = ref<AuthenticationResult | null>(null);
const account = computed(() => authResult.value?.account);

const conf: LoginManagerConfiguration = {
  clientId: "4cf26522-97ed-414a-813a-0f95be32bbe4",
  tenantId: "0ae51e19-07c8-4e4b-bb6d-648ee58410f4",
  msalOptions: {
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            default:
              console.log(message);
              break;
          }
        },
      },
    },
  },
};

const scopes = [
  "api://4cf26522-97ed-414a-813a-0f95be32bbe4/user_impersonation",
];

const loginManager = new LoginManager(conf);

// getTokenResult needs to be called before each api call
async function getTokenResult(scopes: string[]) {
  // can be configured if you have a different url for login and redirect.
  const redirectLoginOptions = {
    redirectUri: "/",
    redirectStartPage: "/",
  };

  const result = await loginManager.getToken(scopes, {
    redirectLoginOptions, // optional
  });

  authResult.value = result;
}

onMounted(async () => {
  await loginManager.initialize();
  authResult.value = await loginManager.getToken(scopes, {
    allowInteractiveAuth: false,
  });
});
</script>

<template>
  <h1>
    {{ account?.name ? `Hallo, ${account?.name}` : "Du musst dich noch " }}
    <a
      v-if="!account"
      href="javascript:void(0);"
      @click="getTokenResult(scopes)"
      >einloggen</a
    >
  </h1>
  <h1>Vorlage für Fahrzeugattribute einer Organisation</h1>
  <section>
    <h1>Vorlagen</h1>
  </section>
  <section>
    <h1>Neue Vorlage</h1>
  </section>
  <section>
    <h1>In Projekten erzeugen</h1>
  </section>
</template>
