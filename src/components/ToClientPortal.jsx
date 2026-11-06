import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CLIENT_PORTAL_URL } from '/src/api/config.js';

// Old website portal addresses (/portal/login, /portal, /<company-name>)
// forward to the client portal, keeping the company name if there is one.
export default function ToClientPortal() {
  const { clientSlug } = useParams();
  useEffect(() => {
    window.location.replace(`${CLIENT_PORTAL_URL}/${clientSlug ? encodeURIComponent(clientSlug) : 'login'}`);
  }, [clientSlug]);
  return null;
}
