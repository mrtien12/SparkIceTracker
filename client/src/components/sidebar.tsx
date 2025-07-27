import { Database, Zap, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeSection: "spark-jobs" | "iceberg-tables";
  onSectionChange: (section: "spark-jobs" | "iceberg-tables") => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-72 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-vietinblue-600 rounded-lg flex items-center justify-center">
            <Database className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Data Manager</h2>
            <p className="text-sm text-gray-500">Monitoring & CRUD</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onSectionChange("spark-jobs")}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === "spark-jobs"
                  ? "bg-vietinblue-50 text-vietinblue-700 border border-vietinblue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Zap size={20} />
              <span className="font-medium">Spark Jobs</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onSectionChange("iceberg-tables")}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === "iceberg-tables"
                  ? "bg-vietinblue-50 text-vietinblue-700 border border-vietinblue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Database size={20} />
              <span className="font-medium">Iceberg Tables</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={14} />
            </div>
            <div>
              <p className="font-medium">{user?.username}</p>
              <p className="text-xs">VietinBank User</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
