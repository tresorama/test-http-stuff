import { useState } from "react";

import { UIAlert, UIDebugJson } from "./ui";
import z from "zod";

const BACKEND_SERVER_BASE_URL = `http://localhost:9000`;
const API_ENDPOINT = `${BACKEND_SERVER_BASE_URL}/cookie-editor/check`;

type Result = (
  | { status: 'idle'; }
  | { status: 'loading'; }
  | {
    status: 'success' | 'error',
    errorCode?: string | null,
    [k: string]: unknown;
  }
);

export function CheckCookiePresence() {

  const [resultJson, setResultJson] = useState<Result | null>(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      setResultJson({ status: 'loading' });

      const sleep = (timeInMs: number) => new Promise(res => setTimeout(res, timeInMs));
      await sleep(400);
      const response = await fetch(API_ENDPOINT);
      const json = await response.json();

      const jsonValidated = z.object({
        status: z.literal('error').optional(),
      }).safeParse(json);
      if (!jsonValidated.success) {
        setResultJson({
          status: 'error',
          errorCode: 'INVALID_RESPONSE',
          ...json,
        });
        return;
      }

      setResultJson({
        status: jsonValidated.data.status === 'error' ? 'error' : 'success',
        ...json,
      });

    } catch (error) {
      const json = {
        name: error instanceof Error ? error.message : 'Unknown Error',
        message: error instanceof Error ? error.message : 'Unknown Error',
        stack: error instanceof Error ? error.stack : 'Unknown Error',
      };
      setResultJson({
        status: 'error',
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
        <UIAlert status={'status' in resultJson ? resultJson.status : 'idle'}>
          <UIDebugJson data={resultJson} />
        </UIAlert>
      )}
    </>
  );
}