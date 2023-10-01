export function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-box">
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
