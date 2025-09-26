import type { CSIProduct } from "../../types/products.type";
import CSICreateProduct from "./CSICreateProduct";

interface ModalProps {
  openCreateProductModal: boolean;
  setOpenCreateProductModal: (open: boolean) => void;
  inputtedProduct?: CSIProduct;
}

export default function CreateProductModal({
  openCreateProductModal,
  setOpenCreateProductModal,
  inputtedProduct,
}: ModalProps) {
  if (!openCreateProductModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal container */}
      <div className="relative mx-4 max-h-[90vh] w-full max-w-[1200px] overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-2xl font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => setOpenCreateProductModal(false)}
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Add a New Product
        </h2>

        {/* Modal Body */}
        <div className="w-full">
          <CSICreateProduct product={inputtedProduct} />
        </div>
      </div>
    </div>
  );
}
