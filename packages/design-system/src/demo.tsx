export function Demo() {
  return (
    <div className="k:flex k:flex-col k:gap-4">
      <div className="k:px-4 k:py-2 k:bg-neutral k:border k:border-neutral k:hover:cursor-pointer k:hover:border-neutral-hover">
        <h1 className="k:text-neutral k:hover:text-neutral-hover">Hello from design-system</h1>
      </div>
      <div className="k:px-4 k:py-2 k:bg-primary k:border k:border-primary k:hover:cursor-pointer">
        <h1 className="k:text-primary k:hover:text-primary-hover">Hello from design-system</h1>
      </div>
      <div className="k:px-4 k:py-2 k:bg-secondary k:border k:border-secondary k:hover:cursor-pointer">
        <h1 className="k:text-secondary k:hover:text-secondary-hover">Hello from design-system</h1>
      </div>
    </div>
  );
}
