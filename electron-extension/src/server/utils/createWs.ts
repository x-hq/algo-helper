import expressWs from "express-ws";
import express from "express";

const {app, getWss} = expressWs(express());

export {app, getWss};