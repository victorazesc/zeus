import { CURRENT_USER } from "@/constants/fetch-keys";
import { UserService } from "@/services/user.service";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const userService = new UserService();

export default function useUser({ redirectTo = "", redirectIfFound = false, options = {} } = {}) {
  const router = useRouter();
  const { data, isLoading, error, mutate } = useSWR<User>(CURRENT_USER, () => userService.currentUser(), options);
  const user = error ? undefined : data;

  useEffect(() => {    
    if (!redirectTo || !user) return;
    if (
      (redirectTo && !redirectIfFound) ||
      (redirectIfFound && user)
    ) {
      router.push(redirectTo);
      return;
    }
  }, [user, redirectIfFound, redirectTo, router]);

  return {
    user,
    isUserLoading: isLoading,
    mutateUser: mutate,
    userError: error,
  };
}
