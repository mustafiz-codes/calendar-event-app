import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CalendarProvider } from "./context/CalendarContext";
import { SidebarProvider } from "./context/SidebarContext";
import TopNav from "./components/topNav/TopNav";

test("renders App", () => {
  render(
    <BrowserRouter>
      <ThemeProvider>
        <CalendarProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </CalendarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );

  const element = screen.getByTestId("app-container");
  expect(element).toBeInTheDocument();
});
