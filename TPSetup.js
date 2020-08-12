const APP_ID = 12348;
const APP_KEY =
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF";
const SERVICE_TYPE = "sandbox";

TPDirect.setupSDK(APP_ID, APP_KEY, SERVICE_TYPE);

TPDirect.card.setup({
  fields: {
    number: {
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      element: "#card-expiration-date",
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "CCV",
    },
  },
  styles: {
    input: {
      "font-family": '"Microsoft JhengHei", sans-serif',
    },
    ".valid": {
      color: "green",
    },

    ".invalid": {
      color: "red",
    },

    ":focus": {
      color: "black",
    },
  },
});
