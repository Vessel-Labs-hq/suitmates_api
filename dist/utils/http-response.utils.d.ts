export declare class HttpResponse {
    static success(payload: {
        data: any;
        message: string;
    }): {
        success: boolean;
        data: any;
        message: string;
    };
    static badRequest(data: {
        data: any;
        message: string;
    }): {
        success: boolean;
        data: any;
        message: string;
    };
}
