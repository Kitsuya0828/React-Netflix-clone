import React, { useState, useEffect } from "react";
import "./Nav.scss";
import logo from "../logo.png";

type Props = {
  className?: string;
};

export const Nav = (props: Props) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleShow = () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleShow);
    return () => {
      window.removeEventListener("scroll", handleShow);
    };
  }, []);
  return (
    <div className={`Nav ${show && "Nav-black"}`}>
      <img
        className="Nav-logo"
        src={logo}
        alt="Azumax Logo"
      />
      {/* <img
        className="Nav-avater"
        src="https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
        alt="Avatar"
      /> */}
    </div>
  );
};