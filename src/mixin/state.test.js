import test from "tape";
import Vue from "vue";
import state from "./state.js";

test("push save to state", async t => {
  function saveItems(v) {
    t.equal(v[0].value, 1);
    return Promise.resolve();
  }

  const c = new Vue({
    methods: {
      saveItems
    },
    mixins: [state]
  });

  function onSaved() {
    t.pass();
  }

  t.plan(3);
  c.pushSaveItems([{ value: 1 }]);
  await c.pushSaveItems([{ value: 1 }], onSaved);
});

test("push with delay", async t => {
  const start = Date.now();
  function saveItems() {
    t.ok(Date.now() - start > 300);
    t.ok(Date.now() - start < 400);
    return Promise.resolve();
  }

  const c = new Vue({
    methods: {
      saveItems
    },
    mixins: [state]
  });

  function shouldPass() {
    t.pass();
    return Promise.resolve();
  }

  t.plan(6);
  const delayed = c.delaySave(300, shouldPass);
  c.pushSaveItems([{ value: 1 }]);
  const saved = c.pushSaveItems([{ value: 1 }], shouldPass);

  await Promise.all([delayed, saved]);
});

test("cancel push", async t => {
  function shouldNotPass() {
    t.fail();
  }

  const c = new Vue({
    methods: {
      saveItems: shouldNotPass
    },
    mixins: [state]
  });

  function onCanceled() {
    t.pass();
    return Promise.resolve();
  }

  t.plan(2);
  const delayed = c.delaySave(300, shouldNotPass, onCanceled);
  c.pushSaveItems([{ value: 1 }]);
  c.pushSaveItems([{ value: 1 }]);
  c.pushSaveItems([{ value: 1 }]);
  const canceled = c.cancelSave(onCanceled);

  await Promise.all([delayed, canceled]);
});
