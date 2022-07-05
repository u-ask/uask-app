import test from "tape";
import { buildDriver } from "../store/drivers4test.js";
import { KPIOptions } from "./kpi.js";

const drivers = buildDriver();

test("create KPIOptions", async t => {
  const survey = await drivers.surveyDriver.getByName("P11-05");
  const kpiOptions = new KPIOptions(survey);
  t.deepEqual(kpiOptions.queriesBySamples.types, ["matrix", "pies", "histogram"]);
  t.end();
});
