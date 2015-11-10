import unittest

from coders.run import app


class HomeTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()

    def test_home(self):
        r = self.app.get("/")
        self.assertEqual(r.status_code, 200)

    def test_developers(self):
        r = self.app.get("/developers")
        self.assertEqual(r.status_code, 200)
