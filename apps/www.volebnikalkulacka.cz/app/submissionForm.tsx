export default function SubmissionForm() {
  return (
    <form>
      <div>
        <label className="hidden" htmlFor="email">
          Zadejte svůj email
        </label>
        <input name="email" type="email" placeholder="Zadejte svůj email" />
      </div>
      <button type="submit">Odeslat</button>
    </form>
  );
}
