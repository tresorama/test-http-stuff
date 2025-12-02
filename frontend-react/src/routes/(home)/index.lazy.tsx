import { createLazyFileRoute } from '@tanstack/react-router';

import { SectionHeader } from './-components/section-header';
import { SectionCookieEditor } from './-components/section-cookie-editor';

export const Route = createLazyFileRoute('/(home)/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SectionHeader />
      <SectionCookieEditor />
    </>
  );
}
