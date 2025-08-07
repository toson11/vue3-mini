const reactive = (obj) => {
  return new Proxy(obj, {
    get(target, key) {
      // 依赖收集
      track(target, key);
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      // 先修改数据，再触发更新
      const result = Reflect.set(target, key, value);
      trigger(target, key);
      return result;
    }
  });
};
