"use client";

import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      <div className="hidden md:block w-60 flex-shrink-0">
        <DesktopSidebar />
      </div>
      <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
