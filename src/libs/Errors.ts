export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZATED = 401,
    FORBIDDIN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
    SOMETHING_WENT_WRONG = "somthing went wrong!",
    NO_DATA_FOUND = "no data is found!",
    CREATE_FAILED = "creating is failed!",
    UPDATE_FAILED = "updating is failed!",

    USED_NICK_PHONE = "this nickname or phone is already used!",
    NO_MEMBER_NICK = "no member with this nickname!",
    WRONG_PASSWORD = "wrong password! please try again!",
}

class Errors extends Error {
    public code: HttpCode;
    public message: Message;

    static standard = {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: Message.SOMETHING_WENT_WRONG
    };

    constructor(statusCode: HttpCode, statusMessage: Message) {
        super();
        this.code = statusCode;
        this.message = statusMessage;
    }
}

export default Errors;