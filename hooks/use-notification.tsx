import { notifyApi } from "@/api-client/notify-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useNotification(type: "user" | "shop") {
  const queryKey = type === "user" ? ["notify"] : ["notify-shop"];
  const { profile } = useAuth();
  const { data, refetch } = useQuery({
    queryKey,
    queryFn:
      type === "user" ? notifyApi.getNotifyByUser : notifyApi.getNotifyByShop,
    enabled: !!profile?._id,
    staleTime: 3 * 60 * 1000,
  });
  const markReadMutation = useMutation({
    mutationFn: notifyApi.markReadNotify,
    onSuccess: (data) => {
      refetch();
    },
  });
  const markReadAllMutation = useMutation({
    mutationFn: notifyApi.markReadAllNotify,
    onSuccess: () => {
      refetch();
    },
  });
  const handleMarkReadNotify = (id: string) => {
    markReadMutation.mutate(id);
  };
  const handleMarkReadAllNotify = () => {
    data?.metadata &&
      data?.metadata.filter((notify) => !notify.noti_isRead).length > 0 &&
      markReadAllMutation.mutate();
  };

  const listNotify = data?.metadata ? data.metadata : [];
  const numberIsNotRead =
    listNotify && listNotify.filter((notify) => !notify.noti_isRead).length;
  return {
    numberIsNotRead,
    listNotify,
    handleMarkReadNotify,
    handleMarkReadAllNotify,
  };
}
