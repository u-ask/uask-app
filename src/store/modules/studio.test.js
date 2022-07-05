import test from "tape";
import store from "../index.js";
import { mapGetters, mapMutations } from "vuex";
import mapBind from "../../mapbind.js";

const { isStudioMode, setStudioMode } = mapBind(store, {
  ...mapGetters("studio", ["isStudioMode"]),
  ...mapMutations("studio", ["setStudioMode"])
});

test("State studio mode", t => {
  t.equal(isStudioMode(), false);
  setStudioMode(true);
  t.equal(isStudioMode(), true);
  t.end();
});
