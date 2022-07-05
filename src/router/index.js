import Vue from "vue";
import VueRouter from "vue-router";
import { initRedirect, authentRedirect, startRedirect } from "./guard.js";
import { scrollBehavior } from "./scroll.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Platform Center",
    component: () => import("../views/PlatformCenter")
  },
  {
    path: "/callback",
    name: "Callback"
  },
  {
    path: "/callback-logout",
    name: "CallbackLogout"
  },
  {
    path: "/callback-renew",
    name: "CallbackRenew"
  },
  {
    path: "/error",
    name: "Error",
    component: () => import("../views/Error")
  },
  {
    path: "/login",
    name: "Login"
  },
  {
    path: "/:survey",
    name: "Home",
    component: () => import("../views/Survey"),
    children: [
      {
        path: "/:survey/user",
        name: "User profile",
        component: () => import("../views/User")
      },
      {
        path: "/:survey/participant/search",
        name: "Search participant",
        component: () => import("../views/ParticipantSearch")
      },
      {
        path: "/:survey/dashboard",
        name: "Dashboard",
        component: () => import("../views/Dashboard")
      },
      {
        path: "/:survey/participant/:participantCode/form",
        name: "Participant Data",
        component: () => import("../views/Form")
      },
      {
        path: "/:survey/participant/create/form",
        name: "Participant creation",
        component: () => import("../views/Form")
      },
      {
        path: "/:survey/alert/all",
        name: "View alerts",
        component: () => import("../views/Monitoring")
      },
      {
        path: "/:survey/participant/:participantCode/item/:variableName",
        name: "Item details",
        component: () => import("../components/form/ItemDetails")
      },
      {
        path: "/:survey/documents",
        name: "View documents",
        component: () => import("../views/Document")
      },
      {
        path: "/:survey/documents/create",
        name: "Document creation",
        component: () => import("../views/CreateDocument")
      },
      {
        path: "/:survey/admin",
        name: "Admin",
        component: () => import("../views/Admin"),
        redirect: () => ({ name: "Admin users" }),
        children: [
          {
            path: "/:survey/admin/users",
            name: "Admin users",
            component: () => import("../views/AdminUsers")
          },
          {
            path: "/:survey/admin/users/create",
            name: "Admin create user",
            component: () => import("../views/CreateUser")
          },
          {
            path: "/:survey/admin/samples",
            name: "Admin samples",
            component: () => import("../views/AdminSamples")
          },
          {
            path: "/:survey/admin/samples/create",
            name: "Admin create sample",
            component: () => import("../views/CreateSample")
          },
          {
            path: "/:survey/admin/survey",
            name: "Admin survey",
            component: () => import("../views/AdminSurvey")
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior
});

router.beforeEach(authentRedirect);
router.beforeEach(initRedirect);
router.beforeEach(startRedirect);

export default router;
