import React, { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import MainContent from "../components/mainContent/MainContent";
import * as SidebarContext from "../context/SidebarContext";

// Utility function to render the component within the context of React Router
const renderWithRouter = (ui: ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: Router });
};

it("renders without crashing", () => {
  renderWithRouter(<MainContent />);
  expect(screen.getByTestId("main-content")).toBeInTheDocument();
});

jest.mock("../context/SidebarContext", () => ({
  useSidebar: jest.fn().mockReturnValue({
    isSidebarOpen: true, // Mocking as true
  }),
}));

it("adjusts layout based on sidebar state", () => {
  renderWithRouter(<MainContent />);
  const mainContent = screen.getByTestId("main-content");

  // Since isSidebarOpen is mocked to true, expect the class to be 'ml-[300px]'
  expect(mainContent).toHaveClass("ml-[300px]");
});

it("renders the Weekly component for root path", () => {
  renderWithRouter(<MainContent />, { route: "/" });
  // Assuming the Weekly component has specific identifiable content or a test id
  expect(screen.getByText(/content specific to Weekly/i)).toBeInTheDocument();
});

it("renders the Monthly component for /month path", () => {
  renderWithRouter(<MainContent />, { route: "/month" });
  // Assuming the Monthly component has specific identifiable content or a test id
  expect(screen.getByText(/content specific to Monthly/i)).toBeInTheDocument();
});
