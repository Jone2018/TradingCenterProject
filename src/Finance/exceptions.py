class BalanceLogException(Exception):
    pass


class BalanceChargeException(Exception):
    pass


class BalanceWithdrawException(Exception):
    pass


class BalanceFrozenException(Exception):
    pass


class BalanceUnfrozenException(Exception):
    pass


class BalanceTransferException(Exception):
    pass


class BalanceForwardException(Exception):
    pass


class BalanceConfirmException(Exception):
    pass


class BalanceModifyException(Exception):
    pass


class BalanceDispatchException(Exception):
    pass


class BalanceFeeException(Exception):
    pass


class APIException(Exception):
    def __init__(self, message, code):
        self.code = code
        self.message = message


class CoinTypeNotFoundException(APIException):
    pass


class CaptchaFailException(APIException):
    pass


class PhoneCaptchaFailException(APIException):
    pass


class EmailCaptchaFailException(APIException):
    pass


class AmountExceededLimitException(APIException):
    pass
