import { HttpResponse } from '@internal/HttpResponse';

export /**
 * AVCommandResponse
 */
    class AVCommandResponse extends HttpResponse {
    constructor(base: HttpResponse) {
        super();
        this.body = base.body;
        this.satusCode = base.satusCode;
    }
}