import React, { useState } from "react";
import { useQuery } from "react-query";
import useUserInfo from "../../hooks/useUserInfo";
import { Link } from "react-router-dom";
import { GrUserAdmin, GrTrash } from "react-icons/gr";
import { Pagination } from "react-pagination-bar";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuthContext from "../../hooks/useAuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AnimateText from "@moxy/react-animate-text";

const AdminManageUsers = () => {
  const [userFromDB, , , totalSpentArray] = useUserInfo();
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();

  // fetch all users data
  const {
    data: allUsers,
    isLoading: isUsersLoading,
    refetch,
  } = useQuery({
    enabled:
      !isAuthLoading && user?.uid !== undefined && userFromDB?.admin === true,
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  // Handle Make Admin User
  const handleMakeAdmin = (email) => {
    axiosSecure
      .patch(`/admin/users/make-admin/${email}`, {
        admin: true,
      })
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          toast.success("The user is now an Admin");
          refetch();
        }
      })
      .catch((e) => console.error(e));
  };

  // Handle delete user
  const handleDeleteUser = (email) => {
    Swal.fire({
      title: "BE CAREFUL!",
      text: "All information associated with this user will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#ef4c53",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "w-[85%] md:w-[32em] ml-14",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/admin/delete-user/${email}`)
          .then((res) => {
            if (res.data.success) {
              Swal.fire({
                title: "Deletion Successful!",
                text: "All data associated with the user is deleted.",
                icon: "success",
              });
              refetch();
            }
          })
          .catch((e) => console.error(e));
      }
    });
  };

  // pagination settings
  const [currentPage, setCurrentPage] = useState(1);
  const pageProductLimit = 6;

  return (
    <div className="px-4">
      <div>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/dashboard/adminDashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link to="/dashboard/adminUsers">Users</Link>
            </li>
          </ul>
        </div>

        <h2
          className="mt-1 font-extrabold text-4xl tracking-wider"
          style={{ fontFamily: "var(--italiana)" }}
        >
          <AnimateText initialDelay={0.2} wordDelay={0.2} separator="">
            <span>Users</span>
          </AnimateText>
        </h2>
      </div>

      <div className="overflow-x-auto mb-5 mt-10 px-4">
        {isUsersLoading ? (
          <div>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                className="skeleton w-full h-16 my-4 rounded-none"
                key={idx}
              ></div>
            ))}
          </div>
        ) : (
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="font-bold text-black border-b-2 border-b-black">
                <th>Name</th>
                <th>Registered</th>
                <th>Country</th>
                <th>Spent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allUsers
                ?.slice(
                  (currentPage - 1) * pageProductLimit,
                  currentPage * pageProductLimit
                )
                .map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={user.img}
                              alt={user.name}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        <div>
                          {user?.admin ? (
                            <div className="flex items-center gap-2 font-bold">
                              <h4 className="font-bold">{user.name}</h4>
                              <div className="badge badge-success badge-outline badge-sm">
                                Admin
                              </div>
                            </div>
                          ) : (
                            <h4 className="font-bold">{user.name}</h4>
                          )}

                          <div className="text-sm opacity-75">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.createdAt.slice(0, 10)}</td>
                    <td>
                      {user.shippingAddress
                        ? user.shippingAddress?.country
                        : "-Not Added-"}
                    </td>
                    <td>
                      $
                      {totalSpentArray
                        ?.find((item) => item.email === user.email)
                        ?.totalSpent?.toFixed(2) || 0}
                    </td>

                    <td className="flex items-center gap-3">
                      {!user?.admin && (
                        <div className="tooltip" data-tip="Make Admin">
                          <button
                            className="btn btn-square text-white btn-sm btn-success"
                            onClick={() => handleMakeAdmin(user.email)}
                          >
                            <GrUserAdmin />
                          </button>
                        </div>
                      )}

                      <div className="tooltip" data-tip="Remove User">
                        <button
                          className="btn btn-square text-white btn-sm btn-error"
                          onClick={() => handleDeleteUser(user.email)}
                        >
                          <GrTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        <div className="pb-5">
          <p className="text-xs mt-8">
            Showing {currentPage > 1 ? currentPage - 1 : currentPage}
            {currentPage > 1 && allUsers?.length > 10 && "1"} to{" "}
            {Math.ceil(allUsers?.length / 10) === currentPage
              ? allUsers?.length % 10 !== 0
                ? (currentPage - 1) * 10 + (allUsers?.length % 10)
                : currentPage * 10
              : currentPage * 10}{" "}
            of {allUsers?.length}
          </p>
          <Pagination
            currentPage={currentPage}
            totalItems={allUsers?.length}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            itemsPerPage={pageProductLimit}
            pageNeighbours={3}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminManageUsers;
