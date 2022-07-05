import { getTranslation, ItemTypes } from "uask-dom";

function joinMessages(...messages) {
  const message = messages.filter(p => p).join(" - ");
  return message ? [`(${message})`] : [];
}

function getLabel(typename, args, value, { locale, fallbackLocale }) {
  locale = locale?.split("-")[0];
  fallbackLocale = fallbackLocale?.split("-")[0];
  if (typeof value == "undefined") return "";
  if (typename == "mlstring")
    return getTranslation(value, locale, fallbackLocale);
  if (typename == "date" && Object.keys(args).length == 0)
    return new Date(value).toLocaleString("sv", { dateStyle: "short" });
  if (typename == "datetime") return new Date(value).toLocaleString("sv");
  const type = ItemTypes.create({ name: typename, ...args });
  return type.label(value, locale) ?? type.label(value, fallbackLocale);
}

// eslint-disable-next-line no-unused-vars
export function itemToValue(typeName, valueString, args) {
  switch (typeName) {
    case "date": {
      return valueString?.includes("{") ? JSON.parse(valueString) : valueString;
    }
    case "integer":
    case "scale":
    case "score":
    case "real": {
      const num = Number.parseFloat(valueString);
      return Number.isFinite(num) ? num : undefined;
    }
    case "yesno": {
      return valueString === undefined
        ? undefined
        : valueString == "true" || valueString == true
        ? true
        : false;
    }
    default:
      return valueString;
  }
}

function i18nToLabels(i18n, key) {
  return Object.entries(i18n.messages).reduce(
    (labels, [lang, msgs]) => ({ ...labels, [lang]: msgs[key] }),
    {}
  );
}

export default {
  methods: {
    joinMessages,
    getLabel,
    itemToValue,
    i18nToLabels
  }
};
