import React, { useState } from "react";
import { useQuery } from "react-query";
import useUserInfo from "../../../hooks/useUserInfo";
import useAuthContext from "../../../hooks/useAuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

const AdminMessages = () => {
  const [userFromDB] = useUserInfo();
  const { user, isAuthLoading } = useAuthContext();
  const [axiosSecure] = useAxiosSecure();
  const [expandedId, setExpandedId] = useState(null);

  const { data: messages, isLoading } = useQuery({
    enabled:
      !isAuthLoading &&
      user !== null &&
      user !== undefined &&
      (userFromDB?.admin === true || userFromDB?.role === "ADMIN"),
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/contact");
      return res.data?.data || [];
    },
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <header className="h-20 flex items-center justify-between px-6 md:px-margin-desktop bg-background/80 backdrop-blur-md border-b border-outline-variant/30 z-40 shrink-0">
        <h2 className="font-display-lg text-headline-md text-primary">Messages</h2>
        {messages?.length > 0 && (
          <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-[0.1em]">
            {messages.length} total
          </span>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-margin-desktop custom-scrollbar">
        <div className="bg-surface-dim border border-secondary/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-high/50">
                  <th className="px-6 py-4 font-label-caps text-outline text-[11px]">From</th>
                  <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Email</th>
                  <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Subject</th>
                  <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Message</th>
                  <th className="px-6 py-4 font-label-caps text-outline text-[11px]">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-outline">
                      Loading messages...
                    </td>
                  </tr>
                ) : messages?.length ? (
                  messages.map((m) => {
                    const isExpanded = expandedId === m._id;
                    const isLong = (m.message || "").length > 120;
                    return (
                      <tr key={m._id} className="hover:bg-white/40 transition-colors align-top">
                        <td className="px-6 py-4">
                          <p className="font-button-text text-on-surface">{m.name}</p>
                          {m.phone && <p className="text-[12px] text-outline mt-1">{m.phone}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`mailto:${m.email}`}
                            className="text-[13px] text-primary hover:underline break-all"
                          >
                            {m.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-on-surface-variant">
                          {m.subject || "—"}
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <p className={`text-[13px] text-on-surface-variant whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-2"}`}>
                            {m.message}
                          </p>
                          {isLong && (
                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : m._id)}
                              className="mt-1 text-[12px] text-primary hover:underline"
                            >
                              {isExpanded ? "Show less" : "Show more"}
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-[13px] text-on-surface-variant whitespace-nowrap">
                          {formatDate(m.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-outline">
                      No messages yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
