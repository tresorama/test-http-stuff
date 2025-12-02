import { useState } from "react";
import z from "zod";

import { UIAlert, UIDebugJson, UIFormField, UIFormFieldHelperText, UIFormLabel, UIInput, UISelect } from "./ui";
import { sleep } from "@/lib/utils/sleep";

const BACKEND_SERVER_BASE_URL = `http://localhost:9000`;
const API_ENDPOINT = `${BACKEND_SERVER_BASE_URL}/cookie-editor/set`;

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

type Result = (
  | { fetchStatus: 'idle'; }
  | { fetchStatus: 'loading'; }
  | {
    fetchStatus: 'success' | 'error',
    errorCode?: string | null,
    [k: string]: unknown;
  }
);

export function FormFetch() {
  const [formMethod, setFormMethod] = useState<'get' | 'post'>('get');
  const [resultJson, setResultJson] = useState<Result | null>(null);

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {

      // prevent default form submit behavior
      e.preventDefault();

      // set pending state
      setResultJson({ fetchStatus: 'loading' });

      // get form data
      const formData = new FormData(e.currentTarget);

      // do fetch
      await sleep(400);
      let fetchPromise: Promise<Response>;
      if (formMethod === 'get') {
        const url = new URL(API_ENDPOINT);
        for (const [key, value] of formData) {
          url.searchParams.set(key, value.toString());
        }
        fetchPromise = fetch(url.toString());
      }
      else {
        fetchPromise = fetch(API_ENDPOINT, {
          method: 'POST',
          body: formData,
        });
      }
      const response = await fetchPromise;

      // validate response
      const json = await response.json();
      const jsonValidated = z.object({
        status: z.literal(['error']).optional(),
      }).safeParse(json);
      console.log({ response, jsonValidated, json });

      // if invalid response -> show error
      if (!jsonValidated.success) {
        setResultJson({
          fetchStatus: 'success',
          errorCode: 'INVALID_RESPONSE_PARSE',
          response: {
            ...json,
          }
        });
        return;
      }

      // if valid response -> show data (can be error or success)
      setResultJson({
        fetchStatus: 'success',
        fetchStatusCode: response.status,
        response: {
          ...json,
        }
      });

    } catch (error) {
      const json = {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown Error',
        track: error instanceof Error ? error.stack : 'Unknown Error',
      };
      setResultJson({
        fetchStatus: 'error',
        errorCode: 'UNEXPECTED_ERROR',
        ...json,
      });
    }

  };

  return (
    <>
      <form
        method={formMethod}
        onSubmit={handleFormSubmit}
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
          <UIInput name="name" id="name" />
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

        <button type="submit">
          Set Cookie (Fetch)
        </button>
      </form>

      {resultJson && (
        <UIAlert status={resultJson.fetchStatus}>
          <UIDebugJson data={resultJson} />
        </UIAlert>
      )}
    </>
  );
}
