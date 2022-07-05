import { ClientDrivers } from "uask-sys";
import { StudioDrivers } from "uask-studio";
import ky from "ky";

function buildDriver(token, isStudioMode) {
  const client = ky.extend({
    prefixUrl: process.env.VUE_APP_API_URL,
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const clientDrivers = new ClientDrivers(client);
  return isStudioMode ? new StudioDrivers(clientDrivers) : clientDrivers;
}

export class Driver {
  static build = buildDriver;
}
