import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { format, parseISO } from "date-fns";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { fetchRidersByStatus, updateRiderStatus } from "../../../features/riders/api";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["pendingRiders", page, size],
    queryFn: () => fetchRidersByStatus(axiosSecure, "pending", { page, size }),
    staleTime: 60000
  });

  const riders = data?.data || [];
  const pagination = data?.pagination || { totalItems: 0, totalPages: 1 };
  const totalPages = pagination.totalPages;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const startRange = (page - 1) * size + 1;
  const endRange = Math.min(page * size, pagination.totalItems);

  const handleDecision = async (id: string, decision: string, email?: string) => {
    const isApproving = decision === "approve";
    const actionText = isApproving ? "approve" : "reject";

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${actionText} this rider`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isApproving ? "#3085d6" : "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, ${actionText}!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const dataRes = await updateRiderStatus(
            axiosSecure,
            id,
            isApproving ? "approved" : "rejected",
            email
          );

          if (dataRes.modifiedCount > 0) {
            Swal.fire(
              `${isApproving ? "Approved" : "Rejected"}!`,
              `Rider has been ${actionText}d.`,
              "success"
            );
            refetch();
          }
        } catch (err: any) {
          Swal.fire("Error!", err.message, "error");
        }
      }
    });
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRider(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PP");
    } catch (e) {
      console.error("Invalid date format:", e, dateString);
      return "N/A";
    }
  };

  if (isLoading) return <div className="text-center py-8"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="alert alert-error">Error: {error.message}</div>;

  const downloadCSV = () => {
    if (riders.length === 0) return;
    
    const headers = ["Applicant Name", "Email", "Vehicle", "Reg No", "NID", "Age", "District", "Status"];
    const rows = riders.map((r: any) => [
      r.name,
      r.email,
      r.bikeBrand,
      r.bikeRegNo,
      r.nid,
      r.age,
      r.district,
      "Pending"
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `gram2city_applications_report_${new Date().getTime()}.csv`);
    link.click();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Pending Rider Applications</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadCSV}
            className="btn btn-sm bg-primary text-white border-none hover:bg-primary/90 shadow-lg shadow-primary/20 px-6 rounded-xl font-bold"
          >
            Download Report
          </button>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-tight">Rows:</span>
            <select 
              className="select select-ghost select-xs focus:bg-transparent outline-none border-none text-gray-700 font-bold"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="badge badge-warning font-bold py-3 px-4 bg-amber-50 text-amber-600 border-none">
            {pagination.totalItems} Applications
          </div>
        </div>
      </div>

      {riders.length === 0 ? (
        <div className="alert alert-info bg-blue-50 border-blue-100 text-blue-700 rounded-2xl">
          No pending applications at the moment.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                  <th className="py-4">Applicant</th>
                  <th>Vehicle Info</th>
                  <th>Documents</th>
                  <th>Region</th>
                  <th className="text-right px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {riders.map((rider: any) => (
                  <tr key={rider._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-gray-800">{rider.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono tracking-tighter">{rider.email}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-gray-800 text-sm">{rider.bikeBrand}</div>
                      <div className="text-[10px] text-gray-500">{rider.bikeRegNo}</div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">NID: {rider.nid}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Age: {rider.age}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-medium text-gray-600">{rider.district}</div>
                      <div className="text-[10px] text-gray-400">{rider.region}</div>
                    </td>
                    <td className="text-right px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedRider(rider);
                            setIsModalOpen(true);
                          }}
                          className="btn btn-xs bg-blue-50 text-blue-600 border-none hover:bg-blue-100 font-bold"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleDecision(rider._id, "approve", rider.email)}
                          className="btn btn-xs bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100 font-bold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(rider._id, "reject")}
                          className="btn btn-xs bg-red-50 text-red-600 border-none hover:bg-red-100 font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100 gap-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Showing <span className="text-gray-800">{startRange}</span> to <span className="text-gray-800">{endRange}</span> of <span className="text-gray-800">{pagination.totalItems}</span> applicants
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="btn btn-sm bg-white border-none shadow-sm hover:bg-primary hover:text-white transition-all text-gray-400"
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <FiChevronLeft />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`btn btn-sm w-9 h-9 min-h-0 border-none shadow-sm transition-all ${
                          page === pageNum ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum} className="text-gray-300 font-bold px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                className="btn btn-sm bg-white border-none shadow-sm hover:bg-primary hover:text-white transition-all text-gray-400"
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}

      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Rider Application Details</h3>

          {selectedRider && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Personal Information</p>
                  <p><strong>Name:</strong> {selectedRider.name}</p>
                  <p><strong>Email:</strong> {selectedRider.email}</p>
                  <p><strong>Phone:</strong> {selectedRider.phone}</p>
                  <p><strong>Age:</strong> {selectedRider.age}</p>
                </div>
                <div>
                  <p className="font-semibold">Identification</p>
                  <p><strong>NID:</strong> {selectedRider.nid}</p>
                  <p><strong>Region:</strong> {selectedRider.region}</p>
                  <p><strong>District:</strong> {selectedRider.district}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold">Vehicle Information</p>
                <p><strong>Brand:</strong> {selectedRider.bikeBrand}</p>
                <p><strong>Registration:</strong> {selectedRider.bikeRegNo}</p>
              </div>

              <div>
                <p className="font-semibold">Additional Information</p>
                <p>{selectedRider.additionalInfo}</p>
              </div>

              <div>
                <p className="font-semibold">Application Details</p>
                <p><strong>Applied On:</strong> {formatDate(selectedRider.createdAt)}</p>
              </div>
            </div>
          )}

          <div className="modal-action">
            <button
              className="btn btn-success"
              onClick={() => {
                handleDecision(selectedRider._id, "approve", selectedRider.email);
                closeModal();
              }}
            >
              Approve
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                handleDecision(selectedRider._id, "reject", selectedRider.email);
                closeModal();
              }}
            >
              Reject
            </button>
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PendingRiders;