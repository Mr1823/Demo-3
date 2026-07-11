import React from "react";

const TimeAgo = ({ timestamp }) => {
  if (!timestamp) return <span className="text-xs text-gray-400">Recently</span>;

  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return <span className="text-xs text-gray-400">{interval} year{interval > 1 ? "s" : ""} ago</span>;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return <span className="text-xs text-gray-400">{interval} month{interval > 1 ? "s" : ""} ago</span>;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return <span className="text-xs text-gray-400">{interval} day{interval > 1 ? "s" : ""} ago</span>;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return <span className="text-xs text-gray-400">{interval} hour{interval > 1 ? "s" : ""} ago</span>;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return <span className="text-xs text-gray-400">{interval} min{interval > 1 ? "s" : ""} ago</span>;

  return <span className="text-xs text-gray-400">Just now</span>;
};

export default TimeAgo;
