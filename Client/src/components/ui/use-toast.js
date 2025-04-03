export function useToast() {
  return {
    toast: ({ title, description, variant }) => {
      console.log(`[${variant || "info"}] ${title}: ${description}`);
    },
  };
}