import {
  MemoryGrid,
  MemoryHeader,
  MemoryToolbar,
} from "../components";

function MemoryPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex h-full flex-col gap-8">
          <MemoryHeader />
          <MemoryToolbar />
          <div className="flex flex-1 flex-col">
            <MemoryGrid memories={[]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryPage;
