import React from "react";
import SingleDatePicker from "../datePicker/Single";
import { useSidebar } from "../../context/SidebarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const SideNav = () => {
  const { isSidebarOpen } = useSidebar();
  return (
    <aside
      className={`fixed  w-[320px] h-full transform transition-transform duration-300 ease-in-out px-4 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-[320px]"
      }`}
      data-testid="side-nav"
    >
      <button
        className={`cs-btn-theme w-full mb-4 p-3 rounded-3xl flex justify-center items-center gap-1
        }`}
      >
        <FontAwesomeIcon icon={faAdd} className=" h-5 w-5" />
        Create Event
      </button>
      <SingleDatePicker />
    </aside>
  );
};

export default SideNav;
