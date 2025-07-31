import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  User,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Check,
  X,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  getStoredUser,
  clearAuthData,
  getCaseStatusLabel,
  getCaseStatusColor,
  getCaseTypeLabel,
  getOppositeStatusLabel,
} from "../../lib/auth";
import { caseAPI } from "../../lib/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isPolling, setIsPolling] = useState(true);

  const fetchAllCases = useCallback(
    async (showToast = false) => {
      try {
        const response = await caseAPI.fetchAll();
        setCases(response.data);
        setLastUpdated(new Date());
        if (showToast) {
          toast.success("Cases refreshed successfully");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching cases:", error);
        if (!isLoading) {
          toast.error("Failed to fetch cases");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  useEffect(() => {
    const userData = getStoredUser();
    if (userData) {
      setUser(userData);
      fetchAllCases();
    }

    // Set up polling for real-time updates every 5 seconds
    const interval = setInterval(() => {
      if (isPolling) {
        fetchAllCases();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAllCases, isPolling]);

  useEffect(() => {
    // Filter cases based on selected filters
    let filtered = cases;

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (c) => c.caseStatus === parseInt(filterStatus)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((c) => c.caseType === parseInt(filterType));
    }

    setFilteredCases(filtered);
  }, [cases, filterStatus, filterType]);

  const handleLogout = () => {
    clearAuthData();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleVerifyCase = async (caseId, verified) => {
    try {
      await caseAPI.updateVerificationStatus(caseId, verified);
      toast.success(`Case ${verified ? "verified" : "rejected"} successfully`);
      fetchAllCases();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating verification status:", error);
      toast.error("Failed to update verification status");
    }
  };

  const handleUpdateOppositeStatus = async (caseId, status) => {
    try {
      await caseAPI.updateOppositeStatus(caseId, status);
      toast.success("Opposite party status updated successfully");
      fetchAllCases();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating opposite status:", error);
      toast.error("Failed to update opposite status");
    }
  };

  const handleUpdateCaseStatus = async (caseId, status) => {
    try {
      await caseAPI.updateCaseStatus(caseId, status);
      toast.success("Case status updated successfully");
      fetchAllCases();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error updating case status:", error);
      toast.error("Failed to update case status");
    }
  };

  const openCaseModal = (caseItem) => {
    setSelectedCase(caseItem);
    setShowCaseModal(true);
  };

  const closeCaseModal = () => {
    setSelectedCase(null);
    setShowCaseModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                ResolveIt Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPolling ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
                <span>
                  {isPolling ? "Auto-refresh: ON" : "Auto-refresh: OFF"} | Last
                  updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              <button
                onClick={() => fetchAllCases(true)}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <RefreshCw className="h-5 w-5" />
                <span className="text-sm">Refresh</span>
              </button>
              <button
                onClick={() => setIsPolling(!isPolling)}
                className={`flex items-center space-x-2 text-xs px-2 py-1 rounded ${
                  isPolling
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                <span>{isPolling ? "Pause" : "Resume"} Auto-refresh</span>
              </button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage dispute cases and monitor the resolution process.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Cases
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cases.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cases.filter((c) => c.caseStatus === 0).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Panel Created
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cases.filter((c) => c.caseStatus === 1).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cases.filter((c) => c.caseStatus === 2).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cases.filter((c) => c.caseStatus === 3).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="all">All</option>
                <option value="0">Not Started</option>
                <option value="1">Panel Created</option>
                <option value="2">Mediation in Progress</option>
                <option value="3">Resolved</option>
                <option value="4">Unresolved</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="all">All</option>
                <option value="0">Family</option>
                <option value="1">Business</option>
                <option value="2">Criminal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Cases ({filteredCases.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            {filteredCases.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No cases found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No cases match the selected filters.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opposite Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCases.map((caseItem) => (
                    <tr key={caseItem._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {caseItem.description.substring(0, 40)}...
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(caseItem.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {caseItem.userId?.userName || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {caseItem.userId?.email || "No email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCaseTypeLabel(caseItem.caseType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {caseItem.verifiedByAdmin ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <div className="flex space-x-1">
                            <button
                              onClick={() =>
                                handleVerifyCase(caseItem._id, true)
                              }
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Verify
                            </button>
                            <button
                              onClick={() =>
                                handleVerifyCase(caseItem._id, false)
                              }
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={caseItem.oppositeStatus}
                          onChange={(e) =>
                            handleUpdateOppositeStatus(
                              caseItem._id,
                              parseInt(e.target.value)
                            )
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value={0}>Not Started</option>
                          <option value={1}>Awaiting Response</option>
                          <option value={2}>Accepted</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={caseItem.caseStatus}
                          onChange={(e) =>
                            handleUpdateCaseStatus(
                              caseItem._id,
                              parseInt(e.target.value)
                            )
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value={0}>Not Started</option>
                          <option value={1}>Panel Created</option>
                          <option value={2}>Mediation in Progress</option>
                          <option value={3}>Resolved</option>
                          <option value={4}>Unresolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openCaseModal(caseItem)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Case Details Modal */}
      {showCaseModal && selectedCase && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Case Details
                </h3>
                <button
                  onClick={closeCaseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Case ID
                  </label>
                  <p className="text-sm text-gray-900">{selectedCase._id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedCase.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Case Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {getCaseTypeLabel(selectedCase.caseType)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created
                    </label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedCase.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Opposite Party
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedCase.oppositePartyName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedCase.oppositePartyContact}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedCase.oppositePartyAddress}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Legal Status
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedCase.issuePendingStatus}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Verification
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedCase.verifiedByAdmin
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedCase.verifiedByAdmin
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Opposite Status
                    </label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getOppositeStatusLabel(selectedCase.oppositeStatus)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Case Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCaseStatusColor(
                        selectedCase.caseStatus
                      )}`}
                    >
                      {getCaseStatusLabel(selectedCase.caseStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
