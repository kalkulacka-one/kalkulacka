export function Demo() {
  return (
    <div className="ko:flex ko:flex-col ko:gap-4">
      <div className="ko:px-4 ko:py-2 ko:bg-neutral ko:border ko:border-neutral ko:hover:cursor-pointer ko:hover:border-neutral-hover">
        <h1 className="ko:text-neutral ko:hover:text-neutral-hover">Hello from design-system</h1>
      </div>
      <div className="ko:px-4 ko:py-2 ko:bg-primary ko:border ko:border-primary ko:hover:cursor-pointer">
        <h1 className="ko:text-primary ko:hover:text-primary-hover">Hello from design-system</h1>
      </div>
      <div className="ko:px-4 ko:py-2 ko:bg-secondary ko:border ko:border-secondary ko:hover:cursor-pointer">
        <h1 className="ko:text-secondary ko:hover:text-secondary-hover">Hello from design-system</h1>
      </div>
    </div>
  );
}
