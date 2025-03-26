// chrome.devtools.panels.create(
//   "甲壳虫",
//   "icon.png",
//   "src/panel/index.html",
//   () => {
//     console.log("user switched to this panel");
//   }
// );

chrome.devtools.panels.create("v_opitons", null, "src/options/options.html");

chrome.devtools.panels.create("v_diff", null, "src/v_diff/diff_text.html");

chrome.devtools.panels.create(
  "v_ast",
  null,
  "src/v_ast/astexplorer_babel.html"
);
