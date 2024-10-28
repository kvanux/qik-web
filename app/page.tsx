import QikLogger from "@/components/ui/custom/qikLogger/QikLogger";

export default function Home() {
  return (
    <div id="container" className="grid grid-cols-12 gap-6 w-full">
      <div
        id="panel-layout-3"
        className="col-span-3 bg-white rounded-xl px-5 pt-4 pb-6 h-fit shadow-qele-panel"
      >
        <div id="section-Logger" className="flex flex-col gap-4 w-full">
          <div id="sectionTitle-Logger" className="w-full flex">
            <h2 className="text-xl font-semibold text-neutral-800 w-full">
              QIK Log
            </h2>
            <div id="interactGroup-Logger" className="flex gap-2"></div>
          </div>
          <div id="sectionContent-Logger" className="flex w-full">
            <QikLogger />
          </div>
        </div>
      </div>
      <div
        id="panel-layout-9"
        className="col-span-9 bg-white rounded-xl h-[400px] px-5 py-4 shadow-qele-panel"
      >
        <div id="section-Data" className="flex flex-col gap-4 w-full">
          <div id="sectionTitle-Data" className="w-full flex">
            <h2 className="text-xl font-semibold text-neutral-800 w-full">
              QIK Cashflow
            </h2>
            <div id="interactGroup-Data" className="flex gap-2"></div>
          </div>
          <div id="sectionContent-Data"></div>
        </div>
      </div>
    </div>
  );
}
