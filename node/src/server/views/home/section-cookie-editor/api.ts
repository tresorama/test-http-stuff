import type { Response } from "express";
import z from "zod";

import type { AddRoutesFn } from "@/server/types/add-route";
import type { CookieData } from "@/server/types/cookie";
import { CONSTANTS } from '@/constants';

const { SERVER_BASE_URL } = CONSTANTS;


export const sectionCookieEditor_addRoutes: AddRoutesFn = ({ app }) => {

  app.all("/cookie-editor/set", (req, res) => {

    // enure request method is POST or GET
    if (req.method !== 'POST' && req.method !== 'GET') {
      res.status(400).json({
        status: 'error',
        errorCode: "INVALID_REQUEST_METHOD",
      });
      return;
    }

    // parse form data from body
    //NOTE: already done by multer

    // validate form data
    const formValuesRaw = req.method === 'POST' ? req.body : req.query;
    const formValuesValidated = schemaSetInput.safeParse(formValuesRaw);
    console.log({
      formValuesRaw,
      formValuesValidated,
    });
    if (!formValuesValidated.success) {
      res.status(400).json({
        status: 'error',
        errorCode: "INVALID_FORM_DATA",
        requestMethod: req.method,
        requestDataSource: req.method === 'POST' ? 'body' : 'query',
        requestDataRaw: formValuesRaw,
        validationErrors: z.flattenError(formValuesValidated.error).fieldErrors,
      });
      return;
    }

    // set cookie
    const cookieData = setCookieBasedOnRequestData(res, formValuesValidated.data);

    // reply
    res.status(200).json({
      message: 'cookie set',
      requestMethod: req.method,
      requestDataSource: req.method === 'POST' ? 'body' : 'query',
      requestDataRaw: formValuesRaw,
      requestDataValidated: formValuesValidated,
      cookieData,
    });

  });

  app.get("/cookie-editor/check", (req, res) => {
    const cookies = req.cookies;
    res.status(200).json({
      message: 'These are all cookies received by the server',
      cookies,
    });
  });

};


// internals

const schemaHtmlInput = {
  typeCheckbox: z.preprocess(
    v => {
      if (v === 'on') return true;
      if (v === 'true') return true;
      if (v === 'false') return false;
      if (v === '') return undefined;
      return v;
    },
    z.boolean().optional(),
  ),
  typeText: z.preprocess(
    v => {
      if (v === '') return undefined;
      return v;
    },
    z.string().optional(),
  ),
};

const schemaSetInput = z.object({
  name: schemaHtmlInput.typeText.pipe(z.string().min(1)),
  httpOnly: schemaHtmlInput.typeCheckbox,
  sameSite: schemaHtmlInput.typeText.pipe(
    z.enum(['strict', 'lax', 'none']).optional()
  ),
  domain: schemaHtmlInput.typeText.pipe(
    z.string().optional()
  ),
});

function setCookieBasedOnRequestData(res: Response, bodyData: z.infer<typeof schemaSetInput>) {
  const cookieData: CookieData = {
    name: bodyData.name,
    value: 'FIXED_VALUE',
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: bodyData.httpOnly ?? undefined,
    sameSite: bodyData.sameSite ?? undefined,
    domain: bodyData.domain ?? new URL('', SERVER_BASE_URL).hostname,
  };

  res.cookie(cookieData.name, cookieData.value, cookieData);

  return cookieData;

}