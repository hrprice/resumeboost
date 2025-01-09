export const LoadingDots = () => {
  return (
    <div className="flex gap-1 py-2 pt-3 items-center w-10 justify-center">
      <div
        className="rounded-full bg-text-muted animate-bounce size-2"
        style={{ animationDuration: "1s" }}
      />
      <div
        className="rounded-full bg-text-muted animate-bounce size-2"
        style={{ animationDelay: "0.2s", animationDuration: "1s" }}
      />
      <div
        className="rounded-full bg-text-muted animate-bounce size-2"
        style={{ animationDelay: "0.4s", animationDuration: "1s" }}
      />
    </div>
  );
};
