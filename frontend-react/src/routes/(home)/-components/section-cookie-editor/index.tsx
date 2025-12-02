import { CheckCookiePresence } from "./check-cookie-presence";
import { FormDocument } from "./form-document";
import { FormFetch } from "./form-fetch";

import { UICard, UICardContent, UICardContentBlock, UICardContentBlockTitle, UICardTitle } from "./ui";

export function SectionCookieEditor() {
  return (
    <UICard>
      <UICardTitle>
        Cookie Editor
      </UICardTitle>
      <UICardContent>
        <UICardContentBlock>
          <UICardContentBlockTitle>
            Form Document
          </UICardContentBlockTitle>
          <FormDocument />
        </UICardContentBlock>
        <UICardContentBlock>
          <UICardContentBlockTitle>
            Form Fetch
          </UICardContentBlockTitle>
          <FormFetch />
        </UICardContentBlock>
        <UICardContentBlock>
          <UICardContentBlockTitle>
            Check Cookie Presence
          </UICardContentBlockTitle>
          <CheckCookiePresence />
        </UICardContentBlock>
      </UICardContent>
    </UICard>
  );
}



