import React, { useEffect, useState } from "react";
import LoggedInUser from "./Loginuser";

function Header({ ...props }) {

  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 769px)").matches)

  useEffect(() => {
    window
    .matchMedia("(min-width: 769px)")
    .addEventListener('change', e => setIsDesktop( e.matches ));
  }, []);

  return (
    <div className="header-container">
      <div className="site-logo"></div>
      {isDesktop && (
        <div className="header-title">Technical Underwriting Connect (TUC)</div>
      )}
      <LoggedInUser />
    </div>
  );
}

export default Header;
