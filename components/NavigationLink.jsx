"use client";

import Link, { useLinkStatus } from "next/link";
import { useState } from "react";

function PendingLink() {
  const { pending } = useLinkStatus();
  return <span hidden aria-hidden="true" data-link-pending={pending ? "" : undefined} />;
}

export default function NavigationLink({
  children,
  prefetch,
  prefetchOnIntent = false,
  onPointerEnter,
  onFocus,
  ...props
}) {
  const [hasIntent, setHasIntent] = useState(false);

  return (
    <Link
      {...props}
      prefetch={prefetchOnIntent ? hasIntent : prefetch}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (prefetchOnIntent && !event.defaultPrevented) setHasIntent(true);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (prefetchOnIntent && !event.defaultPrevented) setHasIntent(true);
      }}
    >
      {children}
      <PendingLink />
    </Link>
  );
}
