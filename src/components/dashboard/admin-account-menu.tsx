"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetMe } from "@/hooks/auth.hook";
import type { IUser } from "@/types";
import { formatDate } from "@/utils/format.utils";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AdminAccountMenu() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: userResponse, error: userError } = useGetMe();
  const user: IUser | undefined = userResponse?.data;

  return (
    <>
      <button
        type="button"
        className="flex min-w-0 items-center gap-2 rounded-full px-1.5 py-1 text-left transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={user ? `View profile for ${user.name}` : "Profile unavailable"}
        title={user?.email ?? userError?.message ?? "View profile"}
        disabled={!user}
        onClick={() => setIsProfileOpen(true)}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
          {user ? getInitials(user.name) : <UserRound aria-hidden="true" className="size-3.5" />}
        </span>
        <span className="min-w-0">
          <span className="block max-w-20 truncate text-xs font-medium sm:max-w-36">
            {user?.name ?? (userError ? "Account unavailable" : "Loading…")}
          </span>
          {user?.email && (
            <span className="hidden max-w-40 truncate text-[10px] text-muted-foreground lg:block">
              {user.email}
            </span>
          )}
        </span>
      </button>

      <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <SheetContent className="gap-0 sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Admin profile</SheetTitle>
            <SheetDescription>
              Your account information and access role.
            </SheetDescription>
          </SheetHeader>
          {user ? (
            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                  {getInitials(user.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{user.name}</h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <dl className="divide-y rounded-xl border">
                <div className="flex justify-between gap-4 p-4">
                  <dt className="text-sm text-muted-foreground">Phone</dt>
                  <dd className="text-right text-sm font-medium">
                    {user.phone || "Not provided"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 p-4">
                  <dt className="text-sm text-muted-foreground">Role</dt>
                  <dd className="text-right text-sm font-medium">
                    {formatLabel(user.role)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 p-4">
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="text-right text-sm font-medium">
                    {formatLabel(user.status)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 p-4">
                  <dt className="text-sm text-muted-foreground">
                    Member since
                  </dt>
                  <dd className="text-right text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p role="alert" className="p-6 text-sm text-destructive">
              {userError?.message || "Unable to load your profile."}
            </p>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
