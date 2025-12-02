import { useState } from "react";

import { UIFormField, UIFormFieldHelperText, UIFormLabel, UIInput, UISelect } from "./ui";
import { CONSTANTS } from "@/constants";

const API_ENDPOINT = `${CONSTANTS.SERVER_BASE_URL}/cookie-editor/set`;

const FORM_FIELDS = {
  FORM_CHANGE_METHOD: [
    { label: 'GET', value: 'get' },
    { label: 'POST', value: 'post' },
  ],
  SAME_SITE_OPTIONS: [
    { label: '', value: '' },
    { label: 'Lax', value: 'lax' },
    { label: 'None', value: 'none' },
    { label: 'Strict', value: 'strict' },
  ]
} as const;

export function FormDocument() {
  const [formMethod, setFormMethod] = useState<'get' | 'post'>('get');

  return (
    <>
      <form
        action={API_ENDPOINT}
        method={formMethod}
        className="flex flex-col gap-4"
      >
        <UIFormField>
          <UIFormLabel htmlFor="form-method">Form Method</UIFormLabel>
          <UISelect
            id="form-method"
            options={FORM_FIELDS.FORM_CHANGE_METHOD}
            onSelectOption={option => setFormMethod(option.value)}
          />
          <UIFormFieldHelperText>
            {
              formMethod === 'get'
                ? "If GET data is sent with URL query params"
                : "If POST data is sent as multipart form data"
            }
          </UIFormFieldHelperText>
        </UIFormField>

        <UIFormField>
          <UIFormLabel htmlFor="name">name *</UIFormLabel>
          <UIInput name="name" id="name" autoComplete="on" />
        </UIFormField>

        <UIFormField>
          <UIFormLabel htmlFor="domain">domain</UIFormLabel>
          <UIInput name="domain" id="domain" />
        </UIFormField>

        <UIFormField>
          <UIFormLabel htmlFor="httpOnly">httpOnly</UIFormLabel>
          <UIInput name="httpOnly" id="httpOnly" type="checkbox" defaultChecked />
        </UIFormField>

        <UIFormField>
          <UIFormLabel htmlFor="sameSite">sameSite</UIFormLabel>
          <UISelect name="sameSite" id="sameSite" options={FORM_FIELDS.SAME_SITE_OPTIONS} />
        </UIFormField>

        <UIFormField>
          <UIFormLabel htmlFor="secure">secure</UIFormLabel>
          <UIInput name="secure" id="secure" type="checkbox" />
        </UIFormField>

        <UIFormField>
          <UIFormLabel htmlFor="partitioned">partitioned</UIFormLabel>
          <UIInput name="partitioned" id="partitioned" type="checkbox" />
        </UIFormField>

        <button type="submit">
          Set Cookie (Document)
        </button>
      </form>
      <p className="text-muted-foreground">
        Result of this Form loads in a new page
      </p>
    </>
  );
}
