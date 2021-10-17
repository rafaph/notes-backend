import type { RequestHandler } from 'express';
import { NOT_ACCEPTABLE, UNSUPPORTED_MEDIA_TYPE } from 'http-status';
import { ResponseError } from "@app/domains/common/utils/response-error";

export const contentType: RequestHandler = (req, _res, next) => {
    if (req.headers['content-type'] && !req.headers['content-type'].includes('application/json')) {
        next(new ResponseError(UNSUPPORTED_MEDIA_TYPE, `Not supported Content-Type: ${req.headers['content-type']}`));
        return;
    }

    if (
        req.headers['accept'] &&
        !req.headers['accept'].includes('*/*') &&
        !req.headers['accept'].includes('application/json')
    ) {
        next(new ResponseError(NOT_ACCEPTABLE, `Not supported response mime-type: ${req.headers['accept']}`));
        return;
    }

    next();
};
