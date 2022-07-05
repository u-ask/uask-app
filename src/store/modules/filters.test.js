import test from "tape";
import store from "../index.js";
import { mapGetters, mapMutations } from "vuex";
import mapBind from "../../mapbind.js";

const { currentParticipantFilters, setParticipantFilters } = mapBind(store, {
  ...mapGetters("filters", ["currentParticipantFilters"]),
  ...mapMutations("filters", ["setParticipantFilters"])
});

test("set and clear the filter list", t => {
  t.deepLooseEqual(currentParticipantFilters(), {});
  const newFilters = {
    "@SAMPLE": "001",
    age: 18,
    acknowledged: true,
    sex: undefined
  };
  setParticipantFilters(newFilters);
  t.equal(currentParticipantFilters().age, 18);
  t.equal(currentParticipantFilters().acknowledged, true);
  t.equal(currentParticipantFilters()["@SAMPLE"], "001");
  t.false(currentParticipantFilters().idParticipant);
  t.false(currentParticipantFilters().sex);
  t.end();
});
