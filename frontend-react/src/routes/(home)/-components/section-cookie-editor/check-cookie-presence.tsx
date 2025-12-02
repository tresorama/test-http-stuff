import { useState } from "react";
import z from "zod";

import { UIAlert, UIDebugJson } from "./ui";
import { sleep } from "@/lib/utils/sleep";

const BACKEND_SERVER_BASE_URL = `http://localhost:9000`;
const API_ENDPOINT = `${BACKEND_SERVER_BASE_URL}/cookie-editor/check`;

type Result = (
  | { fetchStatus: 'idle'; }
  | { fetchStatus: 'loading'; }
  | {
    fetchStatus: 'success' | 'error',
    errorCode?: string | null,
    [k: string]: unknown;
  }
);

export function CheckCookiePresence() {

  const [resultJson, setResultJson] = useState<Result | null>(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      // set pending state
      setResultJson({ fetchStatus: 'loading' });

      // do fetch (with a delay to simulate a real-world situation)
      await sleep(400);
      const response = await fetch(API_ENDPOINT);

      // validate response
      const json = await response.json();
      const jsonValidated = z.object({
        status: z.literal('error').optional(),
      }).safeParse(json);

      // if invalid response -> show error
      if (!jsonValidated.success) {
        setResultJson({
          fetchStatus: 'success',
          fetchStatusCode: response.status,
          errorCode: 'INVALID_RESPONSE',
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
        response: json
      });

    } catch (error) {

      // if unexpected error or failed fetch communication -> show error
      const json = {
        name: error instanceof Error ? error.message : 'Unknown Error',
        message: error instanceof Error ? error.message : 'Unknown Error',
        stack: error instanceof Error ? error.stack : 'Unknown Error',
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
      <button
        type="button"
        onClick={handleClick}
      >
        Check Cookie Presence
      </button>
      {resultJson && (
        <UIAlert status={resultJson.fetchStatus}>
          <UIDebugJson data={resultJson} />
        </UIAlert>
      )}
    </>
  );
}