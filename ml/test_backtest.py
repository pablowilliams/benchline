import unittest
from ml import backtest


class MetricTests(unittest.TestCase):
    def test_perfect_ndcg_is_one(self):
        self.assertAlmostEqual(backtest.ndcg([1, 2, 3], {1, 2, 3}, 3), 1.0)

    def test_recall_handles_partial_slate(self):
        self.assertEqual(backtest.recall([1, 4], {1, 2}, 2), 0.5)

    def test_dataset_is_deterministic(self):
        first = backtest.generate_dataset()
        second = backtest.generate_dataset()
        self.assertEqual(first[2][0], second[2][0])
        self.assertEqual(first[3][10], second[3][10])


if __name__ == "__main__":
    unittest.main()
