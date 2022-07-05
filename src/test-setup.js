import { LocalStorage } from "node-localstorage";

import { JSDOM } from "jsdom";
import Vue from "vue";
import { Driver } from "./store/drivers.js";
import { buildDriver } from "./store/drivers4test.js";

Driver.build = buildDriver;

Vue.config.devtools = false;

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.navigator = { language: "en-US" };
global.localStorage = new LocalStorage("./scratch");
