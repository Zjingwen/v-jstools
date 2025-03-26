// https://developer.chrome.com/docs/extensions/mv3/manifest/
interface Imanifest {
  /**
   * manifest的版本，默认3
   */
  manifest_version: 3,
  /**
   * 插件名称
   */
  name: string,
  /**
   * 插件版本
   */
  version: string,
  /**
   * 使用chrome.action控制popup
   */
  action?: {
    /**
     * icon配置
     */
    default_icon?: {
      16?: string,
      24?: string,
      32?: string,
    },
    /**
     * popup的默认title
     */
    default_title?: string,
    /**
     * popup的路径
     */
    default_popup?: string,
  },
  /**
   * 插件默认语言，必须在_locales下存在
   */
  default_locale: string,
  /**
   * 插件说明
   */
  description?: string,
  /**
   * 多个图标，不支持 WebP 和 SVG 文件
   */
  icons?: {
    16?: string,
    32?: string,
    48?: string,
    128?: string,
  },
  /**
   * 开发者
   */
  author?: string,
  /**
   * 未知
   */
  automation?: object,
  /**
   * background配置
   */
  background?: {
    service_worker: string,
    type?: string,
  },
  /**
   * 未知
   */
  chrome_settings_overrides?: any,
  /**
   * 未知
   */
  chrome_url_overrides?: any,
  /**
   * 快捷键
   */
  commands?: {},
  /**
   * content_scripts配置
   */
  content_scripts?: {
    /**
     * js文件路径
     */
    js?: string[],
    /**
     * css 文件路径
     */
    css?: string[],
    /**
     * 页面过滤
     */
    matches?: string[],
    match_about_blank?: boolean,
    match_origin_as_fallback?: boolean,
    /**
     * 排除注入的路径
     */
    exclude_matches?: string[],
    /**
     * 排除注入的路径
     */
    include_globs?: string[],
    exclude_globs?: string[],
    run_at?: 'document_idle' | 'document_start' | 'document_end',
    all_frames?: boolean,
  }[],
  /**
   * 扩展的内容安全策略
   */
  content_security_policy?: {
    extension_pages: string,
    sandbox: string,
  },
  cross_origin_embedder_policy?: {
    value: string,
  },
  cross_origin_opener_policy?: {
    value: string,
  },
  /**
   * 静态资源规则
   */
  declarative_net_request?: {
    rule_resources: {
      id: string,
      enabled: boolean,
      path: string,
    }[],
  },
  /**
   * 扩展 DevTools 面板
   */
  devtools_page?: string,
  /**
   * 事件规则
   */
  event_rules?: {
    event: string,
    actions: {
      type: string,
    }[],
    conditions: {
      type: string,
      css: string[]
    }[]
  }[],
  /**
   * 引入模块
   */
  export?: {
    allowlist: string[],
  },
  externally_connectable: {
    ids: string[],
  },
  /**
   * 文件管理
   */
  file_browser_handlers?: {
    id: "upload",
    default_title: string
    file_filters: string[]
  }[],
  /**
   * 插件依赖的chrome版本
   */
  minimum_chrome_version?: string,
  permissions: string[],
  optional_permissions?: string[],
  /**
   * 允许扩展程序访问哪些安全的域名
   */
  host_permissions?: string[],
  optional_host_permissions?: string[],
  web_accessible_resources?: {
    resources: string[],
    matches: string[],
    extension_ids: string[],
    use_dynamic_url: boolean
  }[],
  options_ui?: any
}