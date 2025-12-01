import express from "express";

export type CookieData = {
  name: string,
  value: string,
} & express.CookieOptions;