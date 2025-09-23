export default [
  ["config-hook-global", "是否挂钩总开关"],
  ["config-hook-Function", "hook-Function"],
  [
    "config-hook-eval",
    "hook-eval（eval函数会记录上下文，若 eval 用到封闭的上下文参数可能报错）",
  ],
  [
    "config-hook-remove-dyn-debugger",
    `remove-dyn-debugger(need selected "hook-Function" or "hook-eval")`,
  ],
  ["config-hook-settimeout", "hook-settimeout"],
  ["config-hook-setinterval", "hook-setinterval"],
  [
    "config-hook-random",
    "是否启用启用下面四种调试功能（用于固定随机性，便于对比调试）",
  ],
  [
    "config-hook-random-freeze",
    "config-hook-random（让 random 函数固定返回 0.5）",
  ],
  [
    "config-hook-random-fake",
    "config-hook-random（让random 变成伪随机函数。如果已经配置了该伪随机，则会覆盖上面的 0.5）",
  ],
  [
    "config-hook-time-freeze",
    "config-hook-time（时间函数返回的值固定成一个数字）",
  ],
];
