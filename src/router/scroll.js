import store from "../store/index.js";
import { mapGetters } from "vuex";
import mapBind from "../mapbind.js";

const { isStudioMode } = mapBind(store, {
  ...mapGetters("studio", ["isStudioMode"])
});

export function scrollBehavior(to, from) {
  if (isStudioMode() || onSearchParticipant(to, from) || isSameItem(to, from))
    return stayThere(to);
  if (hasamplemSelector(to)) return scrollToItem(to);
  return goToTop(to);
}

function goToTop() {
  return { x: 0, y: 0 };
}

function isSameItem(to, from) {
  return (
    "interview" in to.query &&
    to.query.interview == from.query?.interview &&
    "page" in to.query &&
    to.query?.page == from.query?.page &&
    to.hash == from.hash
  );
}

function onSearchParticipant(to, from) {
  return to.name == "Search participant" && from.name == "Search participant";
}

function stayThere() {
  return false;
}

function hasamplemSelector(to) {
  return to.hash;
}

function scrollToItem(to) {
  return new Promise(r =>
    setTimeout(
      () =>
        r({
          selector: to.hash.replace(/&instance=[0-9]+/, ""),
          behavior: "smooth",
          offset: { y: 50 }
        }),
      500
    )
  );
}
