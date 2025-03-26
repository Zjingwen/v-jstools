// manifest: Imanifest
const manifest: any = {
  "name": "js-tools",
  "version": "0.0.1",
  "manifest_version": 3,
  "description": "JS-HOOK工具",
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
  "host_permissions": ["http://*/*", "https://*/*"],
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "devtools_page": "src/devtools/devtools.html",
  "content_scripts": [
    {
      "js": [
        "contentScripts.js"
      ],
      "matches": ["<all_urls>"]
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["*"],
      "matches": ["<all_urls>"]
    }
  ],
  "options_page": "options.html",
  "options_ui": {
    "open_in_tab": true,
    "page": "options.html"
  }
}
export default manifest