import os
import sys
import unittest
from unittest.mock import Mock

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from auth import create_access_token, get_current_user
from fastapi import HTTPException


class AuthDependencyTests(unittest.TestCase):
    def test_get_current_user_returns_user_for_valid_token(self):
        db = Mock()
        expected_user = Mock(email="user@example.com")
        db.query.return_value.filter.return_value.first.return_value = expected_user

        token = create_access_token({"sub": "user@example.com"})
        current_user = get_current_user(token, db)

        self.assertIs(current_user, expected_user)

    def test_get_current_user_raises_for_invalid_token(self):
        db = Mock()

        with self.assertRaises(HTTPException) as context:
            get_current_user("not-a-valid-token", db)

        self.assertEqual(context.exception.status_code, 401)
        self.assertEqual(context.exception.detail, "Could not validate credentials")


if __name__ == "__main__":
    unittest.main()
