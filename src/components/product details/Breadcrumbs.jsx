import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Home } from "lucide-react"; 
import { RiArrowDropRightLine } from "react-icons/ri";

const Breadcrumbs = () => {
  const location = useLocation();
  const { category } = useParams();

  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  const formatText = (text) => {
    if (!text) return "";
    return decodeURIComponent(text)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="relative mb-4">
      <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500  md:gap-2">
        <Link 
          to="/" 
          className="flex items-center gap-1 hover:text-primary font-medium transition-colors text-gray-600"
        >
          <Home size={16} className="text-primary" />
          <span>Home</span>
        </Link>

        {pathnames.map((value, index) => {
          if (value.toLowerCase() === "category") return null;

          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <React.Fragment key={to}>
              <RiArrowDropRightLine size={22} className="text-gray-400 shrink-0" />
              
              {isLast ? (
                <span className="font-semibold text-primary truncate max-w-[200px] md:max-w-none">
                  {formatText(value)}
                </span>
              ) : (
                <div
                  // to={value === category ? `/${value}` : to}
                  className="hover:text-primary font-medium transition-colors capitalize text-gray-600"
                >
                  {formatText(value)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
    </nav>
  );
};

export default Breadcrumbs;