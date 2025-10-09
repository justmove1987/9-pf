
interface ConfirmModalProps {
  show: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  show,
  title = "Confirmació",
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-80 text-center">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {message}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel·lar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
