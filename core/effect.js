let activeEffect = null;
const effects = new Map();

const effect = (fn) => {
  const effectFn = () => {
    activeEffect = effectFn;
    // 每次执行 effectFn 时，清空上次的依赖
    cleanup(effectFn);
    fn()
    activeEffect = null;
  }
  // 初始化，记录可以触发该 effect 的依赖
  effectFn.deps = [];
  effectFn();
};

/**
 * 每次执行 effect 时，清空上次的依赖
 * 这样可以避免未执行的条件分支中的依赖变化导致 effect 被触发
 * @param {*} effectFn 
 */
const cleanup = (effectFn) => {
  effectFn.deps.forEach(dep => {
    dep.delete(effectFn);
  });
  effectFn.deps.length = 0; // 清空依赖
};

/**
 * 收集依赖
 */
const track = (target, key) => {
  // console.log("🚀 ~ track ~ key:", key)
  if (!activeEffect) return;
  if (!effects.has(target)) {
    effects.set(target, new Map());
  }
  const deps = effects.get(target);
  if (!deps.has(key)) {
    deps.set(key, new Set());
  }
  const dep = deps.get(key);
  dep.add(activeEffect);
  // 记录依赖，该 key 对应的 effects，后续再从effects中找出当前的 effectFn
  activeEffect.deps.push(dep);
};

/**
 * 触发依赖
 */
const trigger = (target, key) => {
  // console.log("🚀 ~ trigger ~ key:", key)
  const deps = effects.get(target);
  if (!deps) return;

  const effectsToRun = deps.get(key);
  if (!effectsToRun) return;

  // 用新的 Set 去遍历
  // forEach 时如果有新的 effect 被添加到 effectsToRun 中，会继续循环，因为每次触发effect 都会先执行 cleanup再重新收集依赖，导致死循环，因此需要用新的 Set 去遍历
  const newEffectsToRun = new Set(effectsToRun)
  newEffectsToRun.forEach(fn => {
    // 解决递归触发的问题
    if (fn === activeEffect) return;
    // console.log("🚀 ~ trigger ~ fn:", fn)
    fn();
  });
}
