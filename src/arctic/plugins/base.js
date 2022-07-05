/*
 * ============================
 * File: base.js
 * Project: egret-vue
 * File Created: Thursday, 9th April 2020 2:12:17 am
 * Author:UILIB
 * AuthorUrl:https://themeforest.net/user/ui-lib
 * -----
 * Last Modified: Monday, 13th April 2020 7:17:44 pm
 * Modified By: naime hossain (naime.hossain93@gmail.com)
 * -----
 * Copyright 2020 - 2020 UILIB, UILIB
 * ============================
 */

// Automatically loads and bootstraps files
// in the "./src/components/base" folder.

// Imports
import Vue from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

const requireComponent = require.context(
  "@/arctic/components/base",
  true,
  /\.vue$/
);

for (const file of requireComponent.keys()) {
  const componentConfig = requireComponent(file);
  const name = file
    .replace(/index.js/, "")
    .replace(/^\.\//, "")
    .replace(/\.\w+$/, "");
  const componentName = upperFirst(camelCase(name));

  Vue.component(
    `Base${componentName}`,
    componentConfig.default || componentConfig
  );
}
