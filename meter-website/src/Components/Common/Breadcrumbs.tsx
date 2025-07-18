import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type BreadcrumbsProps = {
  items: { label: string; path?: string }[];
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="text-sm text-gray-600 border-b border-gray-300 pb-2 " aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.path ? (
              <Link
                to={item.path}
                className="text-blue-600 hover:underline transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{item.label}</span>
            )}

            {index < items.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
