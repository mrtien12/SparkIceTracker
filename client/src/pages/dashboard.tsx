import { useState } from "react";
import Sidebar from "@/components/sidebar";
import SparkJobsTable from "@/components/spark-jobs-table";
import IcebergTablesTable from "@/components/iceberg-tables-table";
import backgroundImage from "@assets/background-image_1753071029177.jpg";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<"spark-jobs" | "iceberg-tables">("spark-jobs");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Header with VietinBank Image */}
      <div 
        className="h-48 w-full relative overflow-hidden bg-gradient-to-r from-vietinblue-800 via-vietinblue-600 to-vietinblue-700"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">VietinBank</h1>
            <p className="text-xl font-light">Data Management Platform</p>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === "spark-jobs" ? "Spark Jobs Management" : "Iceberg Tables Management"}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeSection === "spark-jobs" 
                    ? "Monitor and manage Spark job configurations" 
                    : "Monitor and manage Iceberg table configurations"}
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {activeSection === "spark-jobs" ? <SparkJobsTable /> : <IcebergTablesTable />}
          </div>
        </div>
      </div>
    </div>
  );
}
