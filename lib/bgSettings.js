let linkDist = 100;
const subscribers = new Set();

export const bgSettings = {
  get: () => linkDist,
  set(value) {
    linkDist = value;
    subscribers.forEach((fn) => fn(value));
  },
  subscribe(fn) {
    subscribers.add(fn);
    fn(linkDist);
    return () => subscribers.delete(fn);
  },
};
