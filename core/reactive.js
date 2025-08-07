const reactive = (obj) => {
  return new Proxy(obj, {
    get(target, key) {
      // 依赖收集
      track(target, key);
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      // 触发更新
      trigger(target, key);
      return Reflect.set(target, key, value);
    }
  });
};
