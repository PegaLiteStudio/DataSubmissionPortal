import { Request, Response } from 'express';

const RESPONSE_MESSAGES = {
    MISSING_PARAMETERS: "000",
    INVALID_EMAIL: "001",
    INVALID_NUMBER: "002",
    INVALID_PASSWORD: "003",
    INVALID_OTP: "004",
    INVALID_NAME: "005",
    INVALID_REFER_CODE: "006",
    ACCOUNT_EXISTS: "101",
    ACCOUNT_NOT_EXISTS: "102",
    REFER_BONUS_ALREADY_CLAIMED: "103",
    REQUEST_ALREADY_PENDING: "104",
    ACCOUNT_BANNED: "201",
    MAX_ATTEMPTS_REACHED: "202",
    ACCOUNT_LINKED_WITH_OTHER_DEVICE: "203",
    DEVICE_ALREADY_REGISTERED: "204",
    OTP_EXPIRED: "301",
    SESSION_EXPIRED: "302",
    SUBSCRIPTION_EXPIRED: "303",
    GAME_NOT_FOUND: "601",
    MATCH_NOT_FOUND: "602",
    MATCH_ALREADY_JOINED: "603",
    MATCH_ALREADY_STARTED: "604",
    MATCH_SEATS_FULL: "605",
    RESULT_ALREADY_SUBMITTED: "606",
    INSUFFICIENT_GAME_BALANCE: "701",
    INSUFFICIENT_WINNING_BALANCE: "702",
    TRANSACTION_NOT_FOUND: "703",
    APP_UNDER_MAINTENANCE: "901",
    UPDATE_REQUIRED: "902",
    INVALID_APP_VERSION: "903",
    ERROR: "1001",
    TOO_MANY_REQUESTS: "1002"
} as const;

type ResponseMessageCode = typeof RESPONSE_MESSAGES[keyof typeof RESPONSE_MESSAGES];

/**
 * Log an error and respond with a generic error message.
 */
const throwError = (res: Response, err: string): void => {
    console.error(err);
    res.status(200).json({ status: "error", error: err });
};

/**
 * Log an internal server error and respond with a 500 status code.
 */
const throwInternalError = (req: Request, res: Response, err: string): void => {
    console.error(err);
    res.status(500).json({ status: "error", error: err });
};

/**
 * Respond with a success message.
 */
const respondSuccess = (res: Response): void => {
    res.status(200).json({ status: "success" });
};

/**
 * Respond with a success message and additional data.
 */
const respondSuccessWithData = (res: Response, data: object | object[]): void => {
    res.status(200).json({ status: "success", data: Array.isArray(data) ? data : [data] });
};

/**
 * Respond with a failure message and optional data.
 */
const respondFailed = (res: Response, code: ResponseMessageCode, data: any = null): void => {
    res.status(200).json({ status: "failed", code, data });
};

/**
 * Respond with a custom data object.
 */
const respond = (res: Response, data: object): void => {
    res.status(200).json(data);
};

/**
 * Respond with a pre-declared message.
 */
const respondDeclared = (res: Response, msg: object): void => {
    res.status(200).json(msg);
};

export {
    throwError,
    throwInternalError,
    respondSuccess,
    respondSuccessWithData,
    respondFailed,
    respond,
    respondDeclared,
    RESPONSE_MESSAGES,
    ResponseMessageCode,
};
