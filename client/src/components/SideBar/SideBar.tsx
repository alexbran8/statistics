import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { SidebarData } from "./SideBarData.js";
import SubMenu from "./SubMenu";
// import { IconContext } from "react-icons/lib";
import { Menu } from "react-feather";
import "./SideBar.scss";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from "react-i18next";
import "../../services/i18n";

// const Nav = styled.div`
//   height: 80px;
//   align-items: center;
// `;

const SidebarNav = styled.nav`
  background: #4E5478;
  width: 200px;
  height: 100vh;
  maring: 100px;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 80px;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 490ms;
  z-index: 999;
`;

const SidebarWrap = styled.div`
  width: 100%;
  maring-top: 10px;
  // padding: 0 100px;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const { t, i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <>
      <Menu className="ShowSideBarIcon" onClick={showSidebar} /> 

      <SidebarNav sidebar={sidebar} >
        <SidebarWrap>
          <div className="slideBarData">
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} showSidebar={showSidebar}/>;
            })}
          </div>
          <LanguageSelector />
        </SidebarWrap>
      </SidebarNav>
      {/* </IconContext.Provider> */}
    </>
  );
};

export default Sidebar;
