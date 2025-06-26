import { useQueryState, parseAsBoolean } from "nuqs";

export const useDeleteWorkspaceModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "delete-workspace",
    parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    })
  );

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
