import { cloneElement, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import ArLogo from "../assets/images/ar_logo.svg";
import CollapseIcon from "../assets/images/svg/collapse.svg";
import RegulationIcon, {
  AuditIcon,
  ExecutionIcon,
  MappingEditorIcon,
  ObligationIcon,
  ResultsIcon,
} from "../assets/images/svg/SidebarIcon";

const sidebarArr = [
  {
    id: 1,
    label: "Regulation Ingestion",
    route: "/",
    icon: <RegulationIcon />,
  },
  {
    id: 2,
    label: "Obligation Review",
    route: "/obligation-review",
    icon: <ObligationIcon />,
  },
  {
    id: 3,
    label: "Mapping Editor",
    route: "/mapping-editor",
    icon: <MappingEditorIcon />,
  },
  {
    id: 4,
    label: "Execution & Job History",
    route: "/execution-history",
    icon: <ExecutionIcon />,
  },
  {
    id: 5,
    label: "Results & Exceptions",
    route: "/results",
    icon: <ResultsIcon />,
  },
  { id: 6, label: "Audit Export", route: "/audit-export", icon: <AuditIcon /> },
];

function Sidebar({ displaySidebar, setDisplaySidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(sidebarArr[0].id);

  // keep active state in sync with url (refresh/back/forward)
  useEffect(() => {
    const found = sidebarArr.find((i) => i.route === location.pathname);
    if (found) setActiveTab(found.id);
  }, [location.pathname]);

  const handleNavigate = (item) => {
    setActiveTab(item.id);
    navigate(item.route);
  };

  return (
    <div
      className={`
        fixed top-0 h-screen bg-[#0F192E] border-r border-[#4D4D64]
        transition-all duration-300
        ${displaySidebar ? "w-75 p-6" : "w-20 p-4"}
      `}
    >
      {/* Header */}
      <div className="border-b border-[#4D4D64] h-13">
        {displaySidebar ? (
          <img src={Logo} alt="Argus" />
        ) : (
          <img src={ArLogo} alt="Argus" />
        )}
      </div>

      {/* Main */}
      <div className="py-6 h-[calc(100vh-152px)] overflow-y-auto">
        <ul className="flex flex-col gap-4">
          {sidebarArr.map((item) => {
            const isActive = item.id === activeTab;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item)}
                  className={`
                    w-full flex items-center rounded-xl transition-all cursor-pointer duration-200
                    ${displaySidebar ? "gap-3 px-4 py-3" : "justify-center h-12"}
                    ${isActive ? "text-[#00D1BC]" : "text-gray-400 hover:text-white"}
                  `}
                  style={{
                    boxShadow: isActive
                      ? "0px 0px 1.5px 2px #00D1BC59"
                      : "none",
                    background: isActive
                      ? "linear-gradient(90deg, rgb(42, 54, 74) 0%, rgb(21 131 131 / 68%) 40%, rgb(0 209 188 / 41%) 60%, rgb(42, 54, 74) 100%)"
                      : "transparent",
                  }}
                >
                  {cloneElement(item.icon, {
                    color: isActive ? "#00D1BC" : "#A0A0A8",
                  })}

                  {displaySidebar && (
                    <span className="text-[16px] font-semibold text-start">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <button
        type="button"
        onClick={() => setDisplaySidebar((prev) => !prev)}
        className="border-t border-[#4D4D64] w-full h-13 cursor-pointer"
      >
        <div className="flex items-center justify-center gap-2 h-full">
          <img
            src={CollapseIcon}
            alt="Collapse Icon"
            className={`transition-transform duration-300 ${displaySidebar ? "" : "rotate-180"}`}
          />
          {displaySidebar && (
            <span className="text-[16px] text-[#808085]">Collapse</span>
          )}
        </div>
      </button>
    </div>
  );
}

export default Sidebar;
