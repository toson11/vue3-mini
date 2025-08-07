let activeEffect = null;
const effects = new Map();

const effect = (fn) => {
  const effectFn = () => {
    activeEffect = effectFn;
    fn()
    activeEffect = null;
  }
  effectFn();
};

const track = (target, key) => {
  console.log("🚀 ~ track ~ key:", key)
  if (!activeEffect) return;
  if (!effects.has(target)) {
    effects.set(target, new Map());
  }
  const deps = effects.get(target);
  if (!deps.has(key)) {
    deps.set(key, new Set());
  }
  deps.get(key).add(activeEffect);
};


const trigger = (target, key) => {
  console.log("🚀 ~ trigger ~ effect:", activeEffect)
  // 触发更新逻辑
  const deps = effects.get(target);
  if (!deps) return;

  const effectsToRun = deps.get(key);
  if (!effectsToRun) return;

  effectsToRun.forEach(fn => {
    fn();
  });
}
