"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function NotificationBell() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastSeenCount, setLastSeenCount] = useState(0); // যতগুলো ইউজার সবশেষ popup খুলে দেখেছে
  const popupRef = useRef(null);

  useEffect(() => {
    if (!user?.email) return;
    axiosSecure
      .get(`/notifications/${user.email}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Notification fetch failed:", err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      // popup খোলার মুহূর্তে বর্তমান সব notification "দেখা হয়েছে" হিসেবে মার্ক হচ্ছে,
      // তাই badge এখনই clear হয়ে যাবে — নতুন notification আসলে আবার দেখাবে।
      if (next) setLastSeenCount(notifications.length);
      return next;
    });
  };

  const handleNotificationClick = (actionRoute) => {
    setOpen(false);
    if (actionRoute) router.push(actionRoute);
  };

  const unreadCount = Math.max(0, notifications.length - lastSeenCount);

  return (
    <div className="relative" ref={popupRef}>
      <button
        onClick={handleToggle}
        className="relative rounded-full p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white"
        aria-label="Notifications"
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] max-h-96 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl">
          <div className="border-b border-neutral-800 px-4 py-3 text-sm font-medium">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-neutral-500">No notifications yet</p>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  onClick={() => handleNotificationClick(n.actionRoute)}
                  className="cursor-pointer px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800"
                >
                  <p>{n.message}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {new Date(n.time).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}