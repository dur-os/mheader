# mheader - 浏览器请求/响应头修改工具

<p align="center">
  <img src="assets/icon.svg" alt="mheader logo" width="128" />
</p>

<p align="center">
  <strong>一款基于 WXT 和 React 构建的现代化浏览器扩展，旨在轻松修改和管理网络请求头与响应头。</strong>
</p>

---

## ✨ 特性

-   🚀 **现代化技术栈**：使用 [WXT](https://wxt.dev/)、[React 19](https://react.dev/)、[Tailwind CSS](https://tailwindcss.com/) 和 [HeroUI](https://heroui.com/) 构建，提供极致的开发体验和流畅的 UI 交互。
-   📂 **多配置文件支持**：可以创建和切换多个不同的配置方案（Profiles），满足多场景调试需求。
-   🛠️ **动态修改**：支持实时修改 HTTP(S) 请求头和响应头。
-   🔍 **URL 过滤**：强大的正则表达式支持，精确控制规则生效的页面范围。
-   🌓 **智能主题**：完美适配深色/浅色模式。
-   📊 **实时反馈**：浏览器角标实时显示当前生效的规则数量。
-   📤 **导入导出**：支持配置文件的导入导出，方便在不同设备间同步。

## 🛠️ 技术栈

-   **框架**: [WXT (Web Extension Toolbox)](https://wxt.dev/)
-   **UI 库**: [React](https://reactjs.org/)
-   **样式**: [Tailwind CSS](https://tailwindcss.com/)
-   **组件库**: [HeroUI](https://heroui.com/)
-   **图标**: [Lucide React](https://lucide.dev/)
-   **动画**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

启动开发服务器，它会自动在浏览器中加载扩展：

```bash
pnpm run dev
# 或者针对 Firefox
pnpm run dev:firefox
```

### 构建项目

生成生产环境的构建包：

```bash
pnpm run build
```

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源。