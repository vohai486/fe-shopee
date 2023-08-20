export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray">
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
