import React from 'react';
import ReactDOM from 'react-dom/client';
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import App from './App.tsx';
import "../../assets/tailwind.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <App />
      </NextThemesProvider>
    </HeroUIProvider>
  </React.StrictMode>,
);
