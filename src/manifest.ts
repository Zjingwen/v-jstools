// manifest: Imanifest
const manifest: any = {
  "name": "js-tools",
  "version": "0.0.1",
  "description": "JS-HOOK工具",
  "manifest_version": 3,
  "permissions": [
    "storage",
    "unlimitedStorage",
    "activeTab",
    "tabs",
    "debugger",
    "storage",
    "contextMenus",
    "scripting"
  ],
  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],
  "background": {
    "service_worker": "serviceWorker.js",
    "type": "module"
  },
  "action": {
    "default_popup": "src/popup/index.html"
  },
  "options_page": "src/options/index.html",
  // "devtools_page": "src/devtools/index.html",
  "content_scripts": [
    {
      "js": [
        "contentScripts.js"
      ],
      "matches": ["<all_urls>"]
    }
  ],
  "default_locale": "zh_CN",
  "web_accessible_resources": [
    {
      "resources": ["*"],
      "matches": ["<all_urls>"]
    }
  ],
  "options_ui": {
    "open_in_tab": true,
    "page": "src/options/index.html"
  }
}
export default manifest