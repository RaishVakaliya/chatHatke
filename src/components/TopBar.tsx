"use client";

import { useState, useEffect } from "react";
import { Bell, Sun, Moon, HelpCircle, LogOut, Trash2 } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Varela_Round, Unbounded } from "next/font/google";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const varelaRound = Varela_Round({
  weight: "400",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  weight: "400",
  subsets: ["latin"],
});

export default function TopBar() {
  const [dark, setDark] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const deleteUserFromConvex = useMutation(api.users.deleteUser);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : (user?.firstName?.[0]?.toUpperCase() ?? "U");
  const unreadChatsCount = useQuery(api.chats.getUnreadCounts) ?? 0;

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    let convexDeleted = false;

    try {
      // 1. Try to delete from Convex first
      await deleteUserFromConvex();
      convexDeleted = true;
    } catch (error) {
      console.error("Error deleting account from Convex:", error);
      // We'll continue with Clerk deletion even if Convex deletion fails
    }

    try {
      // 2. Always attempt to delete from Clerk
      if (user) {
        await user.delete();
        toast.success("Account deleted successfully. Redirecting...", {
          duration: 3000,
        });
        // Delay redirect to allow toast to be seen
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      console.error("Error deleting account from Clerk:", error);

      // Handle the error based on whether Convex deletion succeeded
      if (convexDeleted) {
        toast.error(
          "Database record removed, but couldn't delete authentication data. Please contact support.",
          { duration: 5000 },
        );
      } else {
        // Specific check for Clerk re-verification error
        if (error.message?.includes("additional verification")) {
          toast.error(
            "Sensitive action: Please sign out and sign in again to verify your identity before deleting.",
            { duration: 6000 },
          );
        } else {
          toast.error("Failed to delete account. Please try again later.");
        }
      }
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-2 shrink-0 relative"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-primary)",
      }}
    >
      {/* App Logo+Name */}
      <div className="flex items-center gap-2.5 select-none cursor-pointer">
        <Image
          src="/app_logo.png"
          alt="chatHatke logo"
          width={36}
          height={36}
          className="rounded-lg object-contain"
        />
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          chat
          <span className={`${unbounded.className} text-green-500`}>Hatke</span>
        </span>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--active-chat)] transition-colors">
            <Bell className="w-5 h-5" />

            {unreadChatsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-green-700 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[var(--bg-primary)]">
                {unreadChatsCount}
              </span>
            )}
          </button>
        </div>
        <button
          onClick={() => setDark(!dark)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--active-chat)] transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* profile avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full select-none overflow-hidden flex items-center justify-center bg-zinc-700 text-xs font-semibold text-white shrink-0 ml-1">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || "Profile"}
                  width={32}
                  height={32}
                />
              ) : (
                <span>{initials}</span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-64 bg-zinc-900 border-zinc-800 text-sm rounded-xl p-0 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 group">
              <div className="w-10 h-10 rounded-full select-none overflow-hidden bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                    width={40}
                    height={40}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="text-sm text-zinc-300 font-semibold truncate">
                  {user?.fullName || user?.username || "User"}
                </div>
                <div
                  className={`${varelaRound.className} text-xs text-zinc-400 truncate`}
                >
                  {user?.primaryEmailAddress?.emailAddress ??
                    user?.emailAddresses?.[0]?.emailAddress ??
                    ""}
                </div>
              </div>

              {/* Delete Icon with vertical line */}
              <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        disabled={isDeleting}
                        className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-100"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAccount();
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 text-white hover:bg-red-700 border-none disabled:bg-red-900/50"
                      >
                        {isDeleting ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <DropdownMenuItem
              className="flex items-center justify-center gap-2 px-3 py-2 text-zinc-300 cursor-pointer focus:bg-zinc-800 data-[highlighted]:bg-zinc-800 rounded-none"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
