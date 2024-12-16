import OtazkaButton from "./OtazkaButton";

export default function OtazkaComponent({ id, statement, detail }: any) {
  return (
    <div className="mb-2 border-4 border-red-500 bg-slate-800 p-4 text-white">
      <h1>{statement}</h1>
      <span>{detail}</span>
      <OtazkaButton id={id} />
    </div>
  );
}
