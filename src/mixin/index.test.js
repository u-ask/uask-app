import test from "tape";
import mixin from "./index.js";

test("Translate Labels", t => {
  const stringLabel = "This is a test";
  const m = mixin.methods;
  t.equal(
    m.getLabel("mlstring", {}, stringLabel, {
      locale: "en",
      fallbackLocale: "fr"
    }),
    "This is a test"
  );

  const composedLabel = {
    en: "This is a test",
    fr: "Ceci est un test"
  };
  t.equal(
    m.getLabel("mlstring", {}, composedLabel, {
      locale: "en",
      fallbackLocale: "fr"
    }),
    "This is a test"
  );

  const noLocaleLabel = {
    martian: "?.\\^[{#",
    fr: "Ceci est un test"
  };
  t.equal(
    m.getLabel("mlstring", {}, noLocaleLabel, {
      locale: "en",
      fallbackLocale: "fr"
    }),
    "Ceci est un test"
  );
  t.end();
});

test("Join messages", t => {
  const single = mixin.methods.joinMessages("first", undefined, "second");
  t.deepEqual(single, ["(first - second)"]);
  t.end();
});
