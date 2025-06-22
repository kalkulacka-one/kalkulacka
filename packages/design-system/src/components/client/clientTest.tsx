import { useEffect } from "react";
import { useIntl } from "react-intl";

export function ClientTest() {
  const intl = useIntl();
  useEffect(() => {
    console.log("ClientTest component mounted");
  }, []);

  return (
    <div className="ko:flex ko:flex-col ko:gap-2 ko:p-4">
      <p>Client component</p>
      <p>
        Language:{" "}
        {intl.formatMessage({
          id: "key1",
          defaultMessage: "Default message",
        })}
      </p>
    </div>
  );
}
