'use client';
import { FormattedMessage } from 'react-intl';
export default function Page() {
  return (
    <div>
      <h2>Page</h2>
      <p>
        <FormattedMessage id="key1" defaultMessage="Good morning" />
      </p>
      <p>
        <FormattedMessage id="key2" defaultMessage="This message is in English" />
      </p>
    </div>
  );
}
