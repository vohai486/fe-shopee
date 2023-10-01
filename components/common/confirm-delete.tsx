import { Button } from "./button";

export interface ConfirmModalProps {
  onConfirm: () => void;
  onCloseModal?: () => void;
  label: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  onConfirm,
  onCloseModal,
  label,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <div className="w-[300px] text-sm px-4 pt-2 flex flex-col bg-box border-box gap-6 shadow-sm-50">
      <h3 className="text-title font-semibold text-lg text-center">{label}</h3>
      <div className="flex gap-x-3">
        <Button
          onClick={() => {
            onCloseModal?.();
          }}
          disabled={isLoading}
          label="Trở về"
          className="text-title border border-box w-full h-10 rounded-md"
        />
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          label="Xác nhận"
          onClick={() => {
            onConfirm();
            onCloseModal?.();
          }}
          className="text-grey-0 bg-red-200 w-full h-10 rounded-md"
        />
      </div>
    </div>
  );
}
