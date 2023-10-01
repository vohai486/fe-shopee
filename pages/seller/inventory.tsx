import { inventoryApi } from "@/api-client";
import { Pagination } from "@/components/common";
import { SellerLayout } from "@/components/layouts";
import { FormImportProduct } from "@/components/seller";
import {
  InventoryTable,
  InventoryTableOperations,
} from "@/components/seller/inventory";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function InvertorySellerPage() {
  const { query, pathname, push } = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [idSelect, setIdSelect] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["inventory", query],
    queryFn: () => inventoryApi.manageInventory(query),
    staleTime: 60,
  });
  const mutation = useMutation({
    mutationFn: inventoryApi.importProduct,
    onSuccess: () => {
      toast.success("Thêm thành công");
      refetch();
    },
  });
  const handleImport = (quantity: number, price: number) => {
    mutation.mutate({
      productId: idSelect,
      quantity,
      price,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Tồn kho</h1>
        <InventoryTableOperations />
      </div>
      <InventoryTable />
    </>
  );
}
InvertorySellerPage.Layout = SellerLayout;
