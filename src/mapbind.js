export default function(store, mapped) {
  const bindAccumulate = (accumulator, [name, fn]) => {
    accumulator[name] = fn.bind({
      $store: store
    });
    return accumulator;
  };
  return Object.entries(mapped).reduce(bindAccumulate, {});
}
