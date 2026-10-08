class VerificationError(Exception):
    """Base exception for verification errors."""
    code: str = "VERIFICATION_ERROR"

    def __init__(self, message: str, code: str | None = None):
        super().__init__(message)
        if code:
            self.code = code


class InsufficientInputError(VerificationError):
    """Raised when the input list contains fewer than 2 usernames."""
    code = "INSUFFICIENT_INPUT"


class UserValidationError(VerificationError):
    """Raised when one or more usernames fail verification (not found, private)."""
    code = "USER_VALIDATION_ERROR"

    def __init__(
            self,
            not_found: list[str] | None = None,
            private: list[str] | None = None,
    ):
        self.not_found = not_found or []
        self.private = private or []

        parts = []
        if self.not_found:
            users = ", ".join(self.not_found)
            parts.append(
                f"The following username(s) could not be found: {users}. Please check for typos."
            )

        if self.private:
            users = ", ".join(self.private)
            parts.append(
                f"The following account(s) are private: {users}. Please ensure their profiles are public."
            )

        super().__init__(" ".join(parts))
