import { useEffect } from "react";
import { useIntl } from "react-intl";

export function ClientTest() {
  const intl = useIntl();
  useEffect(() => {
    console.log("ClientTest component mounted");
  }, []);

  return (
    <div className="ko:flex ko:flex-col ko:gap-2 ko:p-4">
      <p>
        {intl.formatMessage({
          id: "clientComponentTest",
          defaultMessage: "Client component default message",
        })}
      </p>
    </div>
  );
}
